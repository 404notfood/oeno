import { z } from "zod";
import { wineColorSchema } from "./wines";

export const createGrapeVarietySchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis")
    .max(100, "Le nom ne peut pas depasser 100 caracteres"),
  color: wineColorSchema,
  origin: z
    .string()
    .max(200, "L'origine ne peut pas depasser 200 caracteres")
    .optional()
    .nullable(),
  characteristics: z
    .string()
    .max(2000, "Les caracteristiques ne peuvent pas depasser 2000 caracteres")
    .optional()
    .nullable(),
  aromaticProfile: z.record(z.string(), z.unknown()).optional().nullable(),
  imageUrl: z.string().url("L'URL de l'image n'est pas valide").optional().nullable(),
});

export const updateGrapeVarietySchema = createGrapeVarietySchema.partial();

export const grapeFiltersSchema = z.object({
  search: z.string().optional(),
  color: wineColorSchema.optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.enum(["createdAt", "name", "color", "origin"]).default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type CreateGrapeVarietyInput = z.infer<typeof createGrapeVarietySchema>;
export type UpdateGrapeVarietyInput = z.infer<typeof updateGrapeVarietySchema>;
export type GrapeFilters = z.infer<typeof grapeFiltersSchema>;
