import { z } from "zod";

export const createEstablishmentSchema = z.object({
  uai: z
    .string()
    .min(1, "Le code UAI est requis")
    .regex(/^[0-9]{7}[A-Z]$/, "Le code UAI doit etre au format 0000000X"),
  name: z
    .string()
    .min(1, "Le nom est requis")
    .max(200, "Le nom ne peut pas depasser 200 caracteres"),
  address: z.string().max(500, "L'adresse ne peut pas depasser 500 caracteres").optional(),
  city: z.string().max(100, "La ville ne peut pas depasser 100 caracteres").optional(),
  zipCode: z
    .string()
    .regex(/^[0-9]{5}$/, "Le code postal doit contenir 5 chiffres")
    .optional()
    .or(z.literal("")),
  region: z.string().max(100, "La region ne peut pas depasser 100 caracteres").optional(),
  phone: z
    .string()
    .regex(/^(\+33|0)[1-9](\d{2}){4}$/, "Format de telephone invalide")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Format d'email invalide").optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

export const updateEstablishmentSchema = createEstablishmentSchema.partial().omit({ uai: true }).extend({
  uai: z
    .string()
    .regex(/^[0-9]{7}[A-Z]$/, "Le code UAI doit etre au format 0000000X")
    .optional(),
});

export const establishmentFiltersSchema = z.object({
  search: z.string().optional(),
  region: z.string().optional(),
  isActive: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.enum(["createdAt", "name", "uai", "city", "region"]).default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type CreateEstablishmentInput = z.infer<typeof createEstablishmentSchema>;
export type UpdateEstablishmentInput = z.infer<typeof updateEstablishmentSchema>;
export type EstablishmentFilters = z.infer<typeof establishmentFiltersSchema>;
