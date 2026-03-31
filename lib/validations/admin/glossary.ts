import { z } from "zod";

export const glossaryCategorySchema = z.enum([
  "Viticulture",
  "Vinification",
  "Degustation",
  "Cepage",
  "Terroir",
  "Service",
  "Autre",
]);

export const createGlossaryTermSchema = z.object({
  term: z
    .string()
    .min(1, "Le terme est requis")
    .max(100, "Le terme ne peut pas depasser 100 caracteres"),
  definition: z
    .string()
    .min(1, "La definition est requise")
    .max(2000, "La definition ne peut pas depasser 2000 caracteres"),
  category: glossaryCategorySchema.optional().nullable(),
  relatedTerms: z.array(z.string()).default([]),
});

export const updateGlossaryTermSchema = createGlossaryTermSchema.partial();

export const glossaryFiltersSchema = z.object({
  search: z.string().optional(),
  category: glossaryCategorySchema.optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.enum(["createdAt", "term", "category"]).default("term"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type GlossaryCategory = z.infer<typeof glossaryCategorySchema>;
export type CreateGlossaryTermInput = z.infer<typeof createGlossaryTermSchema>;
export type UpdateGlossaryTermInput = z.infer<typeof updateGlossaryTermSchema>;
export type GlossaryFilters = z.infer<typeof glossaryFiltersSchema>;
