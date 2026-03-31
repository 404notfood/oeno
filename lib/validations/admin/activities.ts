import { z } from "zod";

export const activityTypeSchema = z.enum([
  "LESSON",
  "QUIZ",
  "TASTING",
  "EXERCISE",
  "VIDEO",
  "DOCUMENT",
  "INTERACTIVE",
]);

export const createActivitySchema = z.object({
  title: z
    .string()
    .min(1, "Le titre est requis")
    .max(200, "Le titre ne peut pas depasser 200 caracteres"),
  description: z
    .string()
    .max(1000, "La description ne peut pas depasser 1000 caracteres")
    .optional()
    .nullable(),
  type: activityTypeSchema,
  content: z.record(z.string(), z.unknown()).optional().nullable(),
  duration: z
    .number()
    .int()
    .min(1, "La duree doit etre d'au moins 1 minute")
    .max(480, "La duree ne peut pas depasser 8 heures")
    .optional()
    .nullable(),
  points: z
    .number()
    .int()
    .min(0, "Les points ne peuvent pas etre negatifs")
    .max(1000, "Les points ne peuvent pas depasser 1000")
    .default(10),
  blockId: z.string().min(1, "Le bloc de competence est requis"),
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

export const updateActivitySchema = createActivitySchema.partial().omit({ blockId: true }).extend({
  blockId: z.string().optional(),
});

export const activityFiltersSchema = z.object({
  search: z.string().optional(),
  blockId: z.string().optional(),
  type: activityTypeSchema.optional(),
  isActive: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.enum(["createdAt", "title", "type", "order", "points"]).default("order"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type ActivityType = z.infer<typeof activityTypeSchema>;
export type CreateActivityInput = z.infer<typeof createActivitySchema>;
export type UpdateActivityInput = z.infer<typeof updateActivitySchema>;
export type ActivityFilters = z.infer<typeof activityFiltersSchema>;
