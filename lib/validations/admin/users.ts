import { z } from "zod";

export const userRoleSchema = z.enum(["STUDENT", "TEACHER", "ADMIN", "SUPER_ADMIN"]);

export const createUserSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
  firstName: z
    .string()
    .min(1, "Le prenom est requis")
    .max(100, "Le prenom ne peut pas depasser 100 caracteres"),
  lastName: z
    .string()
    .min(1, "Le nom est requis")
    .max(100, "Le nom ne peut pas depasser 100 caracteres"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
    ),
  role: userRoleSchema,
  establishmentId: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export const updateUserSchema = z.object({
  email: z.string().email("Format d'email invalide").optional(),
  firstName: z
    .string()
    .min(1, "Le prenom est requis")
    .max(100, "Le prenom ne peut pas depasser 100 caracteres")
    .optional(),
  lastName: z
    .string()
    .min(1, "Le nom est requis")
    .max(100, "Le nom ne peut pas depasser 100 caracteres")
    .optional(),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
    )
    .optional()
    .or(z.literal("")),
  role: userRoleSchema.optional(),
  establishmentId: z.string().optional().nullable(),
  emailVerified: z.boolean().optional(),
});

export const userFiltersSchema = z.object({
  search: z.string().optional(),
  role: userRoleSchema.optional(),
  establishmentId: z.string().optional(),
  isActive: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.enum(["createdAt", "email", "firstName", "lastName", "role"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserFilters = z.infer<typeof userFiltersSchema>;
