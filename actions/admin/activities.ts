"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth-server";
import { createAuditLog } from "./audit";
import {
  createActivitySchema,
  updateActivitySchema,
  activityFiltersSchema,
  type CreateActivityInput,
  type UpdateActivityInput,
  type ActivityFilters,
} from "@/lib/validations/admin";
import { revalidatePath } from "next/cache";

export async function getActivities(filters: Partial<ActivityFilters> = {}) {
  await requireAdmin();

  const validatedFilters = activityFiltersSchema.parse(filters);
  const { search, blockId, type, isActive, page, limit, sortBy, sortOrder } = validatedFilters;

  const where: Record<string, unknown> = {};

  if (blockId) {
    where.blockId = blockId;
  }

  if (type) {
    where.type = type;
  }

  if (typeof isActive === "boolean") {
    where.isActive = isActive;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [activities, total] = await Promise.all([
    prisma.activity.findMany({
      where,
      include: {
        block: {
          select: {
            id: true,
            number: true,
            title: true,
          },
        },
        _count: {
          select: {
            progress: true,
          },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.activity.count({ where }),
  ]);

  return {
    data: activities,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getActivityById(id: string) {
  await requireAdmin();

  const activity = await prisma.activity.findUnique({
    where: { id },
    include: {
      block: true,
      _count: {
        select: {
          progress: true,
        },
      },
    },
  });

  if (!activity) {
    throw new Error("Activite non trouvee");
  }

  return activity;
}

export async function createActivity(data: CreateActivityInput) {
  await requireAdmin();

  const validatedData = createActivitySchema.parse(data);

  const activity = await prisma.activity.create({
    data: {
      ...validatedData,
      content: validatedData.content === null
        ? Prisma.JsonNull
        : validatedData.content === undefined
          ? undefined
          : (validatedData.content as Prisma.InputJsonValue),
    },
  });

  await createAuditLog({
    action: "CREATE",
    entityType: "Activity",
    entityId: activity.id,
    newValues: {
      title: activity.title,
      type: activity.type,
      blockId: activity.blockId,
    },
  });

  revalidatePath("/admin/blocs");
  revalidatePath(`/admin/blocs/${validatedData.blockId}`);

  return activity;
}

export async function updateActivity(id: string, data: UpdateActivityInput) {
  await requireAdmin();

  const validatedData = updateActivitySchema.parse(data);

  const existingActivity = await prisma.activity.findUnique({
    where: { id },
  });

  if (!existingActivity) {
    throw new Error("Activite non trouvee");
  }

  const activity = await prisma.activity.update({
    where: { id },
    data: {
      ...validatedData,
      content: validatedData.content === null
        ? Prisma.JsonNull
        : validatedData.content === undefined
          ? undefined
          : (validatedData.content as Prisma.InputJsonValue),
    },
  });

  await createAuditLog({
    action: "UPDATE",
    entityType: "Activity",
    entityId: id,
    oldValues: {
      title: existingActivity.title,
      type: existingActivity.type,
      isActive: existingActivity.isActive,
    },
    newValues: {
      title: activity.title,
      type: activity.type,
      isActive: activity.isActive,
    },
  });

  revalidatePath("/admin/blocs");
  revalidatePath(`/admin/blocs/${activity.blockId}`);
  revalidatePath(`/admin/blocs/${activity.blockId}/activites/${id}`);

  return activity;
}

export async function deleteActivity(id: string) {
  await requireAdmin();

  const activity = await prisma.activity.findUnique({
    where: { id },
    include: {
      _count: {
        select: { progress: true },
      },
    },
  });

  if (!activity) {
    throw new Error("Activite non trouvee");
  }

  if (activity._count.progress > 0) {
    throw new Error("Impossible de supprimer une activite avec des progressions associees");
  }

  await prisma.activity.delete({
    where: { id },
  });

  await createAuditLog({
    action: "DELETE",
    entityType: "Activity",
    entityId: id,
    oldValues: {
      title: activity.title,
      type: activity.type,
    },
  });

  revalidatePath("/admin/blocs");
  revalidatePath(`/admin/blocs/${activity.blockId}`);
}

export async function getActivitiesCount() {
  await requireAdmin();

  const [total, active] = await Promise.all([
    prisma.activity.count(),
    prisma.activity.count({ where: { isActive: true } }),
  ]);

  return { total, active };
}

export async function reorderActivities(blockId: string, orderedIds: { id: string; order: number }[]) {
  await requireAdmin();

  await Promise.all(
    orderedIds.map(({ id, order }) =>
      prisma.activity.update({
        where: { id },
        data: { order },
      })
    )
  );

  await createAuditLog({
    action: "REORDER",
    entityType: "Activity",
    newValues: { blockId, orderedIds },
  });

  revalidatePath(`/admin/blocs/${blockId}`);
}

export async function getAllActivities() {
  await requireAdmin();

  const activities = await prisma.activity.findMany({
    where: { isActive: true },
    include: {
      block: {
        select: {
          id: true,
          number: true,
          title: true,
        },
      },
    },
    orderBy: [
      { block: { number: "asc" } },
      { order: "asc" },
    ],
  });

  return activities;
}
