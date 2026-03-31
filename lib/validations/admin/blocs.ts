import { z } from "zod";

export const updateBlocSchema = z.object({
  title: z
    .string()
    .min(1, "Le titre est requis")
    .max(200, "Le titre ne peut pas depasser 200 caracteres")
    .optional(),
  description: z
    .string()
    .max(1000, "La description ne peut pas depasser 1000 caracteres")
    .optional()
    .nullable(),
  icon: z.string().max(50, "L'icone ne peut pas depasser 50 caracteres").optional().nullable(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "La couleur doit etre au format hexadecimal (#RRGGBB)")
    .optional()
    .nullable(),
  isActive: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
});

export const blocFiltersSchema = z.object({
  isActive: z.boolean().optional(),
  sortBy: z.enum(["number", "title", "order"]).default("number"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type UpdateBlocInput = z.infer<typeof updateBlocSchema>;
export type BlocFilters = z.infer<typeof blocFiltersSchema>;
