"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";
import { createAuditLog } from "./audit";
import {
  createAromaCategorySchema,
  updateAromaCategorySchema,
  createAromaSubCategorySchema,
  updateAromaSubCategorySchema,
  createAromaSchema,
  updateAromaSchema,
  type CreateAromaCategoryInput,
  type UpdateAromaCategoryInput,
  type CreateAromaSubCategoryInput,
  type UpdateAromaSubCategoryInput,
  type CreateAromaInput,
  type UpdateAromaInput,
} from "@/lib/validations/admin";
import { revalidatePath } from "next/cache";

// Get complete aroma tree
export async function getAromaTree() {
  await requireAdmin();

  const categories = await prisma.aromaCategory.findMany({
    include: {
      subCategories: {
        include: {
          aromas: {
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { order: "asc" },
  });

  return categories;
}

// Categories
export async function getAromaCategories() {
  await requireAdmin();

  return prisma.aromaCategory.findMany({
    include: {
      _count: {
        select: {
          subCategories: true,
        },
      },
    },
    orderBy: { order: "asc" },
  });
}

export async function createAromaCategory(data: CreateAromaCategoryInput) {
  await requireAdmin();

  const validatedData = createAromaCategorySchema.parse(data);

  const existing = await prisma.aromaCategory.findUnique({
    where: { name: validatedData.name },
  });

  if (existing) {
    throw new Error("Une categorie avec ce nom existe deja");
  }

  const category = await prisma.aromaCategory.create({
    data: validatedData,
  });

  await createAuditLog({
    action: "CREATE",
    entityType: "AromaCategory",
    entityId: category.id,
    newValues: { name: category.name },
  });

  revalidatePath("/admin/aromes");

  return category;
}

export async function updateAromaCategory(id: string, data: UpdateAromaCategoryInput) {
  await requireAdmin();

  const validatedData = updateAromaCategorySchema.parse(data);

  const existing = await prisma.aromaCategory.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Categorie non trouvee");
  }

  if (validatedData.name && validatedData.name !== existing.name) {
    const nameExists = await prisma.aromaCategory.findUnique({
      where: { name: validatedData.name },
    });
    if (nameExists) {
      throw new Error("Une categorie avec ce nom existe deja");
    }
  }

  const category = await prisma.aromaCategory.update({
    where: { id },
    data: validatedData,
  });

  await createAuditLog({
    action: "UPDATE",
    entityType: "AromaCategory",
    entityId: id,
    oldValues: { name: existing.name },
    newValues: { name: category.name },
  });

  revalidatePath("/admin/aromes");

  return category;
}

export async function deleteAromaCategory(id: string) {
  await requireAdmin();

  const category = await prisma.aromaCategory.findUnique({
    where: { id },
    include: {
      _count: { select: { subCategories: true } },
    },
  });

  if (!category) {
    throw new Error("Categorie non trouvee");
  }

  if (category._count.subCategories > 0) {
    throw new Error("Impossible de supprimer une categorie avec des sous-categories");
  }

  await prisma.aromaCategory.delete({ where: { id } });

  await createAuditLog({
    action: "DELETE",
    entityType: "AromaCategory",
    entityId: id,
    oldValues: { name: category.name },
  });

  revalidatePath("/admin/aromes");
}

// Sub-categories
export async function createAromaSubCategory(data: CreateAromaSubCategoryInput) {
  await requireAdmin();

  const validatedData = createAromaSubCategorySchema.parse(data);

  const existing = await prisma.aromaSubCategory.findFirst({
    where: {
      name: validatedData.name,
      categoryId: validatedData.categoryId,
    },
  });

  if (existing) {
    throw new Error("Une sous-categorie avec ce nom existe deja dans cette categorie");
  }

  const subCategory = await prisma.aromaSubCategory.create({
    data: validatedData,
  });

  await createAuditLog({
    action: "CREATE",
    entityType: "AromaSubCategory",
    entityId: subCategory.id,
    newValues: { name: subCategory.name },
  });

  revalidatePath("/admin/aromes");

  return subCategory;
}

export async function updateAromaSubCategory(id: string, data: UpdateAromaSubCategoryInput) {
  await requireAdmin();

  const validatedData = updateAromaSubCategorySchema.parse(data);

  const existing = await prisma.aromaSubCategory.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Sous-categorie non trouvee");
  }

  if (validatedData.name && validatedData.name !== existing.name) {
    const nameExists = await prisma.aromaSubCategory.findFirst({
      where: {
        name: validatedData.name,
        categoryId: existing.categoryId,
        NOT: { id },
      },
    });
    if (nameExists) {
      throw new Error("Une sous-categorie avec ce nom existe deja dans cette categorie");
    }
  }

  const subCategory = await prisma.aromaSubCategory.update({
    where: { id },
    data: validatedData,
  });

  await createAuditLog({
    action: "UPDATE",
    entityType: "AromaSubCategory",
    entityId: id,
    oldValues: { name: existing.name },
    newValues: { name: subCategory.name },
  });

  revalidatePath("/admin/aromes");

  return subCategory;
}

export async function deleteAromaSubCategory(id: string) {
  await requireAdmin();

  const subCategory = await prisma.aromaSubCategory.findUnique({
    where: { id },
    include: {
      _count: { select: { aromas: true } },
    },
  });

  if (!subCategory) {
    throw new Error("Sous-categorie non trouvee");
  }

  if (subCategory._count.aromas > 0) {
    throw new Error("Impossible de supprimer une sous-categorie avec des aromes");
  }

  await prisma.aromaSubCategory.delete({ where: { id } });

  await createAuditLog({
    action: "DELETE",
    entityType: "AromaSubCategory",
    entityId: id,
    oldValues: { name: subCategory.name },
  });

  revalidatePath("/admin/aromes");
}

// Aromas
export async function createAroma(data: CreateAromaInput) {
  await requireAdmin();

  const validatedData = createAromaSchema.parse(data);

  const existing = await prisma.aroma.findFirst({
    where: {
      name: validatedData.name,
      subCategoryId: validatedData.subCategoryId,
    },
  });

  if (existing) {
    throw new Error("Un arome avec ce nom existe deja dans cette sous-categorie");
  }

  const aroma = await prisma.aroma.create({
    data: validatedData,
  });

  await createAuditLog({
    action: "CREATE",
    entityType: "Aroma",
    entityId: aroma.id,
    newValues: { name: aroma.name },
  });

  revalidatePath("/admin/aromes");

  return aroma;
}

export async function updateAroma(id: string, data: UpdateAromaInput) {
  await requireAdmin();

  const validatedData = updateAromaSchema.parse(data);

  const existing = await prisma.aroma.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Arome non trouve");
  }

  if (validatedData.name && validatedData.name !== existing.name) {
    const nameExists = await prisma.aroma.findFirst({
      where: {
        name: validatedData.name,
        subCategoryId: existing.subCategoryId,
        NOT: { id },
      },
    });
    if (nameExists) {
      throw new Error("Un arome avec ce nom existe deja dans cette sous-categorie");
    }
  }

  const aroma = await prisma.aroma.update({
    where: { id },
    data: validatedData,
  });

  await createAuditLog({
    action: "UPDATE",
    entityType: "Aroma",
    entityId: id,
    oldValues: { name: existing.name },
    newValues: { name: aroma.name },
  });

  revalidatePath("/admin/aromes");

  return aroma;
}

export async function deleteAroma(id: string) {
  await requireAdmin();

  const aroma = await prisma.aroma.findUnique({ where: { id } });

  if (!aroma) {
    throw new Error("Arome non trouve");
  }

  await prisma.aroma.delete({ where: { id } });

  await createAuditLog({
    action: "DELETE",
    entityType: "Aroma",
    entityId: id,
    oldValues: { name: aroma.name },
  });

  revalidatePath("/admin/aromes");
}

export async function getAromasCount() {
  await requireAdmin();

  const [categories, subCategories, aromas] = await Promise.all([
    prisma.aromaCategory.count(),
    prisma.aromaSubCategory.count(),
    prisma.aroma.count(),
  ]);

  return { categories, subCategories, aromas };
}

export async function reorderAromaCategories(orderedIds: { id: string; order: number }[]) {
  await requireAdmin();

  await Promise.all(
    orderedIds.map(({ id, order }) =>
      prisma.aromaCategory.update({
        where: { id },
        data: { order },
      })
    )
  );

  revalidatePath("/admin/aromes");
}

export async function reorderAromaSubCategories(orderedIds: { id: string; order: number }[]) {
  await requireAdmin();

  await Promise.all(
    orderedIds.map(({ id, order }) =>
      prisma.aromaSubCategory.update({
        where: { id },
        data: { order },
      })
    )
  );

  revalidatePath("/admin/aromes");
}

export async function reorderAromas(orderedIds: { id: string; order: number }[]) {
  await requireAdmin();

  await Promise.all(
    orderedIds.map(({ id, order }) =>
      prisma.aroma.update({
        where: { id },
        data: { order },
      })
    )
  );

  revalidatePath("/admin/aromes");
}
