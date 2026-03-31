"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";
import { createAuditLog } from "./audit";
import {
  createEstablishmentSchema,
  updateEstablishmentSchema,
  establishmentFiltersSchema,
  type CreateEstablishmentInput,
  type UpdateEstablishmentInput,
  type EstablishmentFilters,
} from "@/lib/validations/admin";
import { revalidatePath } from "next/cache";

export async function getEstablishments(filters: Partial<EstablishmentFilters> = {}) {
  await requireAdmin();

  const validatedFilters = establishmentFiltersSchema.parse(filters);
  const { search, region, isActive, page, limit, sortBy, sortOrder } = validatedFilters;

  const where: Record<string, unknown> = {};

  if (region) {
    where.region = region;
  }

  if (typeof isActive === "boolean") {
    where.isActive = isActive;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { uai: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
    ];
  }

  const [establishments, total] = await Promise.all([
    prisma.establishment.findMany({
      where,
      include: {
        _count: {
          select: {
            users: true,
            classes: true,
          },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.establishment.count({ where }),
  ]);

  return {
    data: establishments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getEstablishmentById(id: string) {
  await requireAdmin();

  const establishment = await prisma.establishment.findUnique({
    where: { id },
    include: {
      users: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
        },
        take: 10,
      },
      classes: {
        include: {
          _count: {
            select: {
              students: true,
              teachers: true,
            },
          },
        },
      },
      _count: {
        select: {
          users: true,
          classes: true,
        },
      },
    },
  });

  if (!establishment) {
    throw new Error("Etablissement non trouve");
  }

  return establishment;
}

export async function createEstablishment(data: CreateEstablishmentInput) {
  await requireAdmin();

  const validatedData = createEstablishmentSchema.parse(data);

  // Check if UAI already exists
  const existingEstablishment = await prisma.establishment.findUnique({
    where: { uai: validatedData.uai },
  });

  if (existingEstablishment) {
    throw new Error("Un etablissement avec ce code UAI existe deja");
  }

  const establishment = await prisma.establishment.create({
    data: validatedData,
  });

  await createAuditLog({
    action: "CREATE",
    entityType: "Establishment",
    entityId: establishment.id,
    newValues: {
      uai: establishment.uai,
      name: establishment.name,
      city: establishment.city,
    },
  });

  revalidatePath("/admin/etablissements");

  return establishment;
}

export async function updateEstablishment(id: string, data: UpdateEstablishmentInput) {
  await requireAdmin();

  const validatedData = updateEstablishmentSchema.parse(data);

  const existingEstablishment = await prisma.establishment.findUnique({
    where: { id },
  });

  if (!existingEstablishment) {
    throw new Error("Etablissement non trouve");
  }

  // Check if UAI is being changed and if it's already in use
  if (validatedData.uai && validatedData.uai !== existingEstablishment.uai) {
    const uaiExists = await prisma.establishment.findUnique({
      where: { uai: validatedData.uai },
    });
    if (uaiExists) {
      throw new Error("Un etablissement avec ce code UAI existe deja");
    }
  }

  const establishment = await prisma.establishment.update({
    where: { id },
    data: validatedData,
  });

  await createAuditLog({
    action: "UPDATE",
    entityType: "Establishment",
    entityId: id,
    oldValues: {
      uai: existingEstablishment.uai,
      name: existingEstablishment.name,
      isActive: existingEstablishment.isActive,
    },
    newValues: {
      uai: establishment.uai,
      name: establishment.name,
      isActive: establishment.isActive,
    },
  });

  revalidatePath("/admin/etablissements");
  revalidatePath(`/admin/etablissements/${id}`);

  return establishment;
}

export async function deleteEstablishment(id: string) {
  await requireAdmin();

  const establishment = await prisma.establishment.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          users: true,
          classes: true,
        },
      },
    },
  });

  if (!establishment) {
    throw new Error("Etablissement non trouve");
  }

  if (establishment._count.users > 0 || establishment._count.classes > 0) {
    throw new Error(
      "Impossible de supprimer un etablissement avec des utilisateurs ou des classes associes"
    );
  }

  await prisma.establishment.delete({
    where: { id },
  });

  await createAuditLog({
    action: "DELETE",
    entityType: "Establishment",
    entityId: id,
    oldValues: {
      uai: establishment.uai,
      name: establishment.name,
    },
  });

  revalidatePath("/admin/etablissements");
}

export async function getEstablishmentsCount() {
  await requireAdmin();

  const [total, active] = await Promise.all([
    prisma.establishment.count(),
    prisma.establishment.count({ where: { isActive: true } }),
  ]);

  return { total, active };
}

export async function getEstablishmentRegions() {
  const regions = await prisma.establishment.findMany({
    select: { region: true },
    distinct: ["region"],
    where: { region: { not: null } },
  });

  return regions.map((r) => r.region).filter(Boolean) as string[];
}

export async function getAllEstablishments() {
  await requireAdmin();

  return prisma.establishment.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      uai: true,
    },
    orderBy: { name: "asc" },
  });
}
