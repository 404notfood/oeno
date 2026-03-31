import { z } from "zod";

export const createAromaCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis")
    .max(100, "Le nom ne peut pas depasser 100 caracteres"),
  description: z
    .string()
    .max(500, "La description ne peut pas depasser 500 caracteres")
    .optional()
    .nullable(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "La couleur doit etre au format hexadecimal (#RRGGBB)")
    .optional()
    .nullable(),
  order: z.number().int().min(0).default(0),
});

export const updateAromaCategorySchema = createAromaCategorySchema.partial();

export const createAromaSubCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis")
    .max(100, "Le nom ne peut pas depasser 100 caracteres"),
  categoryId: z.string().min(1, "La categorie est requise"),
  order: z.number().int().min(0).default(0),
});

export const updateAromaSubCategorySchema = createAromaSubCategorySchema.partial().omit({ categoryId: true });

export const createAromaSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis")
    .max(100, "Le nom ne peut pas depasser 100 caracteres"),
  description: z
    .string()
    .max(500, "La description ne peut pas depasser 500 caracteres")
    .optional()
    .nullable(),
  associatedWines: z.array(z.string()).default([]),
  subCategoryId: z.string().min(1, "La sous-categorie est requise"),
  order: z.number().int().min(0).default(0),
});

export const updateAromaSchema = createAromaSchema.partial().omit({ subCategoryId: true });

export type CreateAromaCategoryInput = z.infer<typeof createAromaCategorySchema>;
export type UpdateAromaCategoryInput = z.infer<typeof updateAromaCategorySchema>;
export type CreateAromaSubCategoryInput = z.infer<typeof createAromaSubCategorySchema>;
export type UpdateAromaSubCategoryInput = z.infer<typeof updateAromaSubCategorySchema>;
export type CreateAromaInput = z.infer<typeof createAromaSchema>;
export type UpdateAromaInput = z.infer<typeof updateAromaSchema>;
