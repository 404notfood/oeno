"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth-server";
import { createAuditLog } from "./audit";
import {
  createGrapeVarietySchema,
  updateGrapeVarietySchema,
  grapeFiltersSchema,
  type CreateGrapeVarietyInput,
  type UpdateGrapeVarietyInput,
  type GrapeFilters,
} from "@/lib/validations/admin";
import { revalidatePath } from "next/cache";

export async function getGrapeVarieties(filters: Partial<GrapeFilters> = {}) {
  await requireAdmin();

  const validatedFilters = grapeFiltersSchema.parse(filters);
  const { search, color, page, limit, sortBy, sortOrder } = validatedFilters;

  const where: Record<string, unknown> = {};

  if (color) {
    where.color = color;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { origin: { contains: search, mode: "insensitive" } },
      { characteristics: { contains: search, mode: "insensitive" } },
    ];
  }

  const [grapes, total] = await Promise.all([
    prisma.grapeVariety.findMany({
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
    prisma.grapeVariety.count({ where }),
  ]);

  return {
    data: grapes,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getGrapeVarietyById(id: string) {
  await requireAdmin();

  const grape = await prisma.grapeVariety.findUnique({
    where: { id },
    include: {
      wines: {
        include: {
          wine: {
            select: {
              id: true,
              name: true,
              vintage: true,
              type: true,
            },
          },
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

  if (!grape) {
    throw new Error("Cepage non trouve");
  }

  return grape;
}

export async function createGrapeVariety(data: CreateGrapeVarietyInput) {
  await requireAdmin();

  const validatedData = createGrapeVarietySchema.parse(data);

  // Check if name already exists
  const existing = await prisma.grapeVariety.findUnique({
    where: { name: validatedData.name },
  });

  if (existing) {
    throw new Error("Un cepage avec ce nom existe deja");
  }

  const grape = await prisma.grapeVariety.create({
    data: {
      ...validatedData,
      aromaticProfile: validatedData.aromaticProfile === null
        ? Prisma.JsonNull
        : validatedData.aromaticProfile === undefined
          ? undefined
          : (validatedData.aromaticProfile as Prisma.InputJsonValue),
    },
  });

  await createAuditLog({
    action: "CREATE",
    entityType: "GrapeVariety",
    entityId: grape.id,
    newValues: {
      name: grape.name,
      color: grape.color,
    },
  });

  revalidatePath("/admin/cepages");

  return grape;
}

export async function updateGrapeVariety(id: string, data: UpdateGrapeVarietyInput) {
  await requireAdmin();

  const validatedData = updateGrapeVarietySchema.parse(data);

  const existingGrape = await prisma.grapeVariety.findUnique({
    where: { id },
  });

  if (!existingGrape) {
    throw new Error("Cepage non trouve");
  }

  // Check if name is being changed and if it's already in use
  if (validatedData.name && validatedData.name !== existingGrape.name) {
    const nameExists = await prisma.grapeVariety.findUnique({
      where: { name: validatedData.name },
    });
    if (nameExists) {
      throw new Error("Un cepage avec ce nom existe deja");
    }
  }

  const grape = await prisma.grapeVariety.update({
    where: { id },
    data: {
      ...validatedData,
      aromaticProfile: validatedData.aromaticProfile === null
        ? Prisma.JsonNull
        : validatedData.aromaticProfile === undefined
          ? undefined
          : (validatedData.aromaticProfile as Prisma.InputJsonValue),
    },
  });

  await createAuditLog({
    action: "UPDATE",
    entityType: "GrapeVariety",
    entityId: id,
    oldValues: { name: existingGrape.name },
    newValues: { name: grape.name },
  });

  revalidatePath("/admin/cepages");
  revalidatePath(`/admin/cepages/${id}`);

  return grape;
}

export async function deleteGrapeVariety(id: string) {
  await requireAdmin();

  const grape = await prisma.grapeVariety.findUnique({
    where: { id },
    include: {
      _count: {
        select: { wines: true },
      },
    },
  });

  if (!grape) {
    throw new Error("Cepage non trouve");
  }

  if (grape._count.wines > 0) {
    throw new Error("Impossible de supprimer un cepage associe a des vins");
  }

  await prisma.grapeVariety.delete({
    where: { id },
  });

  await createAuditLog({
    action: "DELETE",
    entityType: "GrapeVariety",
    entityId: id,
    oldValues: { name: grape.name },
  });

  revalidatePath("/admin/cepages");
}

export async function getGrapeVarietiesCount() {
  await requireAdmin();

  const total = await prisma.grapeVariety.count();
  return { total };
}

export async function getAllGrapeVarieties() {
  await requireAdmin();

  return prisma.grapeVariety.findMany({
    select: {
      id: true,
      name: true,
      color: true,
    },
    orderBy: { name: "asc" },
  });
}
