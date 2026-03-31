import { z } from "zod";

export const createClassSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom de la classe est requis")
    .max(200, "Le nom ne peut pas depasser 200 caracteres"),
  year: z
    .string()
    .min(1, "L'annee scolaire est requise")
    .regex(/^\d{4}-\d{4}$/, "L'annee doit etre au format AAAA-AAAA (ex: 2025-2026)"),
  level: z
    .string()
    .max(100, "Le niveau ne peut pas depasser 100 caracteres")
    .optional(),
  establishmentId: z.string().min(1, "L'etablissement est requis"),
  isActive: z.boolean().default(true),
});

export const updateClassSchema = createClassSchema.partial().omit({ establishmentId: true }).extend({
  establishmentId: z.string().optional(),
});

export const assignTeacherSchema = z.object({
  classId: z.string().min(1, "L'identifiant de la classe est requis"),
  teacherId: z.string().min(1, "L'identifiant de l'enseignant est requis"),
});

export const assignStudentsSchema = z.object({
  classId: z.string().min(1, "L'identifiant de la classe est requis"),
  studentIds: z.array(z.string()).min(1, "Au moins un eleve doit etre selectionne"),
});

export const removeStudentSchema = z.object({
  classId: z.string().min(1, "L'identifiant de la classe est requis"),
  studentId: z.string().min(1, "L'identifiant de l'eleve est requis"),
});

export const classFiltersSchema = z.object({
  search: z.string().optional(),
  establishmentId: z.string().optional(),
  year: z.string().optional(),
  level: z.string().optional(),
  isActive: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.enum(["createdAt", "name", "year", "level"]).default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type CreateClassInput = z.infer<typeof createClassSchema>;
export type UpdateClassInput = z.infer<typeof updateClassSchema>;
export type AssignTeacherInput = z.infer<typeof assignTeacherSchema>;
export type AssignStudentsInput = z.infer<typeof assignStudentsSchema>;
export type ClassFilters = z.infer<typeof classFiltersSchema>;
