"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";
import { createAuditLog } from "./audit";
import {
  updateBlocSchema,
  type UpdateBlocInput,
} from "@/lib/validations/admin";
import { revalidatePath } from "next/cache";

export async function getBlocs() {
  await requireAdmin();

  const blocs = await prisma.competencyBlock.findMany({
    include: {
      _count: {
        select: {
          activities: true,
          quizzes: true,
        },
      },
    },
    orderBy: { number: "asc" },
  });

  return blocs;
}

export async function getBlocById(id: string) {
  await requireAdmin();

  const bloc = await prisma.competencyBlock.findUnique({
    where: { id },
    include: {
      activities: {
        orderBy: { order: "asc" },
      },
      quizzes: {
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          activities: true,
          quizzes: true,
        },
      },
    },
  });

  if (!bloc) {
    throw new Error("Bloc de competence non trouve");
  }

  return bloc;
}

export async function updateBloc(id: string, data: UpdateBlocInput) {
  await requireAdmin();

  const validatedData = updateBlocSchema.parse(data);

  const existingBloc = await prisma.competencyBlock.findUnique({
    where: { id },
  });

  if (!existingBloc) {
    throw new Error("Bloc de competence non trouve");
  }

  const bloc = await prisma.competencyBlock.update({
    where: { id },
    data: validatedData,
  });

  await createAuditLog({
    action: "UPDATE",
    entityType: "CompetencyBlock",
    entityId: id,
    oldValues: {
      title: existingBloc.title,
      description: existingBloc.description,
      isActive: existingBloc.isActive,
    },
    newValues: {
      title: bloc.title,
      description: bloc.description,
      isActive: bloc.isActive,
    },
  });

  revalidatePath("/admin/blocs");
  revalidatePath(`/admin/blocs/${id}`);

  return bloc;
}

export async function getBlocsCount() {
  await requireAdmin();

  const [total, active] = await Promise.all([
    prisma.competencyBlock.count(),
    prisma.competencyBlock.count({ where: { isActive: true } }),
  ]);

  return { total, active };
}

export async function reorderBlocs(orderedIds: { id: string; order: number }[]) {
  await requireAdmin();

  await Promise.all(
    orderedIds.map(({ id, order }) =>
      prisma.competencyBlock.update({
        where: { id },
        data: { order },
      })
    )
  );

  await createAuditLog({
    action: "REORDER",
    entityType: "CompetencyBlock",
    newValues: { orderedIds },
  });

  revalidatePath("/admin/blocs");
}
