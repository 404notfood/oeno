import { z } from "zod";

export const appellationTypeSchema = z.enum(["AOP", "IGP", "VDF"]);

export const createAppellationSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis")
    .max(200, "Le nom ne peut pas depasser 200 caracteres"),
  type: appellationTypeSchema,
  region: z
    .string()
    .min(1, "La region est requise")
    .max(100, "La region ne peut pas depasser 100 caracteres"),
  country: z
    .string()
    .max(100, "Le pays ne peut pas depasser 100 caracteres")
    .default("France"),
  description: z
    .string()
    .max(2000, "La description ne peut pas depasser 2000 caracteres")
    .optional()
    .nullable(),
  regulations: z
    .string()
    .max(5000, "La reglementation ne peut pas depasser 5000 caracteres")
    .optional()
    .nullable(),
});

export const updateAppellationSchema = createAppellationSchema.partial();

export const appellationFiltersSchema = z.object({
  search: z.string().optional(),
  type: appellationTypeSchema.optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.enum(["createdAt", "name", "type", "region"]).default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type AppellationType = z.infer<typeof appellationTypeSchema>;
export type CreateAppellationInput = z.infer<typeof createAppellationSchema>;
export type UpdateAppellationInput = z.infer<typeof updateAppellationSchema>;
export type AppellationFilters = z.infer<typeof appellationFiltersSchema>;
