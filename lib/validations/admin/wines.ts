import { z } from "zod";

export const wineTypeSchema = z.enum(["STILL", "SPARKLING", "FORTIFIED", "SWEET"]);
export const wineColorSchema = z.enum(["WHITE", "RED", "ROSE", "ORANGE"]);

// Enums pour le profil sensoriel
export const acidityLevelSchema = z.enum(["LOW", "MEDIUM", "HIGH"]);
export const alcoholLevelSchema = z.enum(["LOW", "MODERATE", "HIGH"]);
export const bodyLevelSchema = z.enum(["LIGHT", "MEDIUM", "FULL", "POWERFUL"]);
export const structureTypeSchema = z.enum(["TENSE", "AMPLE"]);
export const tanninLevelSchema = z.enum(["FINE", "SOFT", "FIRM", "PRONOUNCED"]);
export const finishLengthSchema = z.enum(["SHORT", "MEDIUM", "MEDIUM_LONG", "LONG"]);
export const variabilityLevelSchema = z.enum(["LOW", "MEDIUM", "HIGH"]);

// Schema du profil sensoriel
export const sensoryProfileSchema = z.object({
  acidity: acidityLevelSchema,
  perceivedAlcohol: alcoholLevelSchema,
  body: bodyLevelSchema,
  structure: structureTypeSchema,
  tannins: tanninLevelSchema.optional().nullable(),
  finish: finishLengthSchema,
  dominantAromas: z.array(z.string()).min(1, "Au moins un arome est requis"),
  variability: variabilityLevelSchema,
  typicalCharacteristics: z.string().optional().nullable(),
  pedagogicalNotes: z.string().optional().nullable(),
});

export const createWineSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis")
    .max(200, "Le nom ne peut pas depasser 200 caracteres"),
  vintage: z
    .number()
    .int()
    .min(1900, "Le millesime doit etre posterieur a 1900")
    .max(new Date().getFullYear() + 1, "Le millesime ne peut pas etre dans le futur")
    .optional()
    .nullable(),
  type: wineTypeSchema,
  color: wineColorSchema,
  isAlcoholic: z.boolean().default(true),
  alcoholLevel: z
    .number()
    .min(0, "Le degre d'alcool ne peut pas etre negatif")
    .max(25, "Le degre d'alcool ne peut pas depasser 25%")
    .optional()
    .nullable(),
  producer: z
    .string()
    .max(200, "Le producteur ne peut pas depasser 200 caracteres")
    .optional()
    .nullable(),
  region: z
    .string()
    .max(100, "La region ne peut pas depasser 100 caracteres")
    .optional()
    .nullable(),
  country: z
    .string()
    .max(100, "Le pays ne peut pas depasser 100 caracteres")
    .default("France"),
  imageUrl: z.string().url("L'URL de l'image n'est pas valide").optional().nullable(),
  description: z
    .string()
    .max(2000, "La description ne peut pas depasser 2000 caracteres")
    .optional()
    .nullable(),
  appellationId: z.string().optional().nullable(),
  climate: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  grapeVarietyIds: z
    .array(
      z.object({
        grapeVarietyId: z.string(),
        percentage: z.number().int().min(0).max(100).optional().nullable(),
      })
    )
    .optional(),
  sensoryProfile: sensoryProfileSchema.optional().nullable(),
});

// Schema pour l'import JSON de vins
export const importWineSchema = z.object({
  id: z.string().optional(),
  cepage: z.array(z.string()),
  region: z.string(),
  climat: z.string(),
  type: z.string(),
  acidite: z.string(),
  alcool_percu: z.string(),
  matiere: z.string(),
  structure: z.string(),
  tanins: z.string().nullable(),
  aromes_dominants: z.array(z.string()),
  finale: z.string(),
  variabilite: z.string(),
});

export const importWinesSchema = z.array(importWineSchema);

export const updateWineSchema = createWineSchema.partial();

export const wineFiltersSchema = z.object({
  search: z.string().optional(),
  type: wineTypeSchema.optional(),
  color: wineColorSchema.optional(),
  appellationId: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  minVintage: z.number().int().optional(),
  maxVintage: z.number().int().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.enum(["createdAt", "name", "vintage", "type", "color"]).default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type WineType = z.infer<typeof wineTypeSchema>;
export type WineColor = z.infer<typeof wineColorSchema>;
export type AcidityLevel = z.infer<typeof acidityLevelSchema>;
export type AlcoholLevel = z.infer<typeof alcoholLevelSchema>;
export type BodyLevel = z.infer<typeof bodyLevelSchema>;
export type StructureType = z.infer<typeof structureTypeSchema>;
export type TanninLevel = z.infer<typeof tanninLevelSchema>;
export type FinishLength = z.infer<typeof finishLengthSchema>;
export type VariabilityLevel = z.infer<typeof variabilityLevelSchema>;
export type SensoryProfileInput = z.infer<typeof sensoryProfileSchema>;
export type ImportWineInput = z.infer<typeof importWineSchema>;
export type CreateWineInput = z.infer<typeof createWineSchema>;
export type UpdateWineInput = z.infer<typeof updateWineSchema>;
export type WineFilters = z.infer<typeof wineFiltersSchema>;
