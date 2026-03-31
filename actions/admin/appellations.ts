"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";
import { createAuditLog } from "./audit";
import {
  createAppellationSchema,
  updateAppellationSchema,
  appellationFiltersSchema,
  type CreateAppellationInput,
  type UpdateAppellationInput,
  type AppellationFilters,
} from "@/lib/validations/admin";
import { revalidatePath } from "next/cache";

export async function getAppellations(filters: Partial<AppellationFilters> = {}) {
  await requireAdmin();

  const validatedFilters = appellationFiltersSchema.parse(filters);
  const { search, type, region, country, page, limit, sortBy, sortOrder } = validatedFilters;

  const where: Record<string, unknown> = {};

  if (type) where.type = type;
  if (region) where.region = region;
  if (country) where.country = country;

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { region: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [appellations, total] = await Promise.all([
    prisma.appellation.findMany({
      where,
      include: {
        _count: {
          select: {
            wines: true,
          },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.appellation.count({ where }),
  ]);

  return {
    data: appellations,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getAppellationById(id: string) {
  await requireAdmin();

  const appellation = await prisma.appellation.findUnique({
    where: { id },
    include: {
      wines: {
        select: {
          id: true,
          name: true,
          vintage: true,
          type: true,
          color: true,
        },
        take: 10,
      },
      _count: {
        select: {
          wines: true,
        },
      },
    },
  });

  if (!appellation) {
    throw new Error("Appellation non trouvee");
  }

  return appellation;
}

export async function createAppellation(data: CreateAppellationInput) {
  await requireAdmin();

  const validatedData = createAppellationSchema.parse(data);

  // Check if name/region combo already exists
  const existing = await prisma.appellation.findUnique({
    where: {
      name_region: {
        name: validatedData.name,
        region: validatedData.region,
      },
    },
  });

  if (existing) {
    throw new Error("Une appellation avec ce nom existe deja dans cette region");
  }

  const appellation = await prisma.appellation.create({
    data: validatedData,
  });

  await createAuditLog({
    action: "CREATE",
    entityType: "Appellation",
    entityId: appellation.id,
    newValues: {
      name: appellation.name,
      type: appellation.type,
      region: appellation.region,
    },
  });

  revalidatePath("/admin/appellations");

  return appellation;
}

export async function updateAppellation(id: string, data: UpdateAppellationInput) {
  await requireAdmin();

  const validatedData = updateAppellationSchema.parse(data);

  const existingAppellation = await prisma.appellation.findUnique({
    where: { id },
  });

  if (!existingAppellation) {
    throw new Error("Appellation non trouvee");
  }

  // Check unique constraint if name or region is changing
  if (
    (validatedData.name && validatedData.name !== existingAppellation.name) ||
    (validatedData.region && validatedData.region !== existingAppellation.region)
  ) {
    const name = validatedData.name || existingAppellation.name;
    const region = validatedData.region || existingAppellation.region;
    const exists = await prisma.appellation.findFirst({
      where: {
        name,
        region,
        NOT: { id },
      },
    });
    if (exists) {
      throw new Error("Une appellation avec ce nom existe deja dans cette region");
    }
  }

  const appellation = await prisma.appellation.update({
    where: { id },
    data: validatedData,
  });

  await createAuditLog({
    action: "UPDATE",
    entityType: "Appellation",
    entityId: id,
    oldValues: { name: existingAppellation.name },
    newValues: { name: appellation.name },
  });

  revalidatePath("/admin/appellations");
  revalidatePath(`/admin/appellations/${id}`);

  return appellation;
}

export async function deleteAppellation(id: string) {
  await requireAdmin();

  const appellation = await prisma.appellation.findUnique({
    where: { id },
    include: {
      _count: {
        select: { wines: true },
      },
    },
  });

  if (!appellation) {
    throw new Error("Appellation non trouvee");
  }

  if (appellation._count.wines > 0) {
    throw new Error("Impossible de supprimer une appellation associee a des vins");
  }

  await prisma.appellation.delete({
    where: { id },
  });

  await createAuditLog({
    action: "DELETE",
    entityType: "Appellation",
    entityId: id,
    oldValues: { name: appellation.name },
  });

  revalidatePath("/admin/appellations");
}

export async function getAppellationsCount() {
  await requireAdmin();

  const total = await prisma.appellation.count();
  return { total };
}

export async function getAppellationRegions() {
  const regions = await prisma.appellation.findMany({
    select: { region: true },
    distinct: ["region"],
    orderBy: { region: "asc" },
  });

  return regions.map((r) => r.region);
}

export async function getAllAppellations() {
  await requireAdmin();

  return prisma.appellation.findMany({
    select: {
      id: true,
      name: true,
      type: true,
      region: true,
    },
    orderBy: { name: "asc" },
  });
}
