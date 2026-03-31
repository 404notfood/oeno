"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";
import { createAuditLog } from "./audit";
import {
  createGlossaryTermSchema,
  updateGlossaryTermSchema,
  glossaryFiltersSchema,
  type CreateGlossaryTermInput,
  type UpdateGlossaryTermInput,
  type GlossaryFilters,
} from "@/lib/validations/admin";
import { revalidatePath } from "next/cache";

export async function getGlossaryTerms(filters: Partial<GlossaryFilters> = {}) {
  await requireAdmin();

  const validatedFilters = glossaryFiltersSchema.parse(filters);
  const { search, category, page, limit, sortBy, sortOrder } = validatedFilters;

  const where: Record<string, unknown> = {};

  if (category) {
    where.category = category;
  }

  if (search) {
    where.OR = [
      { term: { contains: search, mode: "insensitive" } },
      { definition: { contains: search, mode: "insensitive" } },
    ];
  }

  const [terms, total] = await Promise.all([
    prisma.glossaryTerm.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.glossaryTerm.count({ where }),
  ]);

  return {
    data: terms,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getGlossaryTermById(id: string) {
  await requireAdmin();

  const term = await prisma.glossaryTerm.findUnique({
    where: { id },
  });

  if (!term) {
    throw new Error("Terme non trouve");
  }

  return term;
}

export async function createGlossaryTerm(data: CreateGlossaryTermInput) {
  await requireAdmin();

  const validatedData = createGlossaryTermSchema.parse(data);

  // Check if term already exists
  const existing = await prisma.glossaryTerm.findUnique({
    where: { term: validatedData.term },
  });

  if (existing) {
    throw new Error("Un terme avec ce nom existe deja");
  }

  const term = await prisma.glossaryTerm.create({
    data: validatedData,
  });

  await createAuditLog({
    action: "CREATE",
    entityType: "GlossaryTerm",
    entityId: term.id,
    newValues: {
      term: term.term,
      category: term.category,
    },
  });

  revalidatePath("/admin/glossaire");

  return term;
}

export async function updateGlossaryTerm(id: string, data: UpdateGlossaryTermInput) {
  await requireAdmin();

  const validatedData = updateGlossaryTermSchema.parse(data);

  const existingTerm = await prisma.glossaryTerm.findUnique({
    where: { id },
  });

  if (!existingTerm) {
    throw new Error("Terme non trouve");
  }

  // Check if term is being changed and if it's already in use
  if (validatedData.term && validatedData.term !== existingTerm.term) {
    const termExists = await prisma.glossaryTerm.findUnique({
      where: { term: validatedData.term },
    });
    if (termExists) {
      throw new Error("Un terme avec ce nom existe deja");
    }
  }

  const term = await prisma.glossaryTerm.update({
    where: { id },
    data: validatedData,
  });

  await createAuditLog({
    action: "UPDATE",
    entityType: "GlossaryTerm",
    entityId: id,
    oldValues: { term: existingTerm.term },
    newValues: { term: term.term },
  });

  revalidatePath("/admin/glossaire");
  revalidatePath(`/admin/glossaire/${id}`);

  return term;
}

export async function deleteGlossaryTerm(id: string) {
  await requireAdmin();

  const term = await prisma.glossaryTerm.findUnique({
    where: { id },
  });

  if (!term) {
    throw new Error("Terme non trouve");
  }

  await prisma.glossaryTerm.delete({
    where: { id },
  });

  await createAuditLog({
    action: "DELETE",
    entityType: "GlossaryTerm",
    entityId: id,
    oldValues: { term: term.term },
  });

  revalidatePath("/admin/glossaire");
}

export async function getGlossaryTermsCount() {
  await requireAdmin();

  const total = await prisma.glossaryTerm.count();
  return { total };
}

export async function getGlossaryCategories() {
  const categories = await prisma.glossaryTerm.findMany({
    select: { category: true },
    distinct: ["category"],
    where: { category: { not: null } },
    orderBy: { category: "asc" },
  });

  return categories.map((c) => c.category).filter(Boolean) as string[];
}

export async function getAllTerms() {
  await requireAdmin();

  return prisma.glossaryTerm.findMany({
    select: {
      id: true,
      term: true,
    },
    orderBy: { term: "asc" },
  });
}
