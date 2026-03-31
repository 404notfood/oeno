import { z } from "zod";

export const questionTypeSchema = z.enum([
  "SINGLE_CHOICE",
  "MULTIPLE_CHOICE",
  "TRUE_FALSE",
  "TEXT",
  "ORDERING",
  "MATCHING",
]);

export const createOptionSchema = z.object({
  text: z
    .string()
    .min(1, "Le texte de l'option est requis")
    .max(500, "Le texte ne peut pas depasser 500 caracteres"),
  isCorrect: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
  imageUrl: z.string().url("L'URL de l'image n'est pas valide").optional().nullable(),
});

export const createQuestionSchema = z.object({
  type: questionTypeSchema,
  question: z
    .string()
    .min(1, "La question est requise")
    .max(1000, "La question ne peut pas depasser 1000 caracteres"),
  explanation: z
    .string()
    .max(2000, "L'explication ne peut pas depasser 2000 caracteres")
    .optional()
    .nullable(),
  points: z
    .number()
    .int()
    .min(1, "Les points doivent etre d'au moins 1")
    .max(100, "Les points ne peuvent pas depasser 100")
    .default(1),
  order: z.number().int().min(0).default(0),
  imageUrl: z.string().url("L'URL de l'image n'est pas valide").optional().nullable(),
  quizId: z.string().min(1, "Le quiz est requis"),
  options: z.array(createOptionSchema).optional(),
});

export const updateQuestionSchema = createQuestionSchema.partial().omit({ quizId: true });

export const createQuizSchema = z.object({
  title: z
    .string()
    .min(1, "Le titre est requis")
    .max(200, "Le titre ne peut pas depasser 200 caracteres"),
  description: z
    .string()
    .max(1000, "La description ne peut pas depasser 1000 caracteres")
    .optional()
    .nullable(),
  timeLimit: z
    .number()
    .int()
    .min(1, "La limite de temps doit etre d'au moins 1 minute")
    .max(480, "La limite de temps ne peut pas depasser 8 heures")
    .optional()
    .nullable(),
  passingScore: z
    .number()
    .int()
    .min(0, "Le score minimum ne peut pas etre negatif")
    .max(100, "Le score minimum ne peut pas depasser 100%")
    .default(60),
  shuffleQuestions: z.boolean().default(true),
  showCorrection: z.boolean().default(true),
  maxAttempts: z
    .number()
    .int()
    .min(1, "Le nombre de tentatives doit etre d'au moins 1")
    .optional()
    .nullable(),
  blockId: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export const updateQuizSchema = createQuizSchema.partial();

export const quizFiltersSchema = z.object({
  search: z.string().optional(),
  blockId: z.string().optional(),
  isActive: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.enum(["createdAt", "title", "passingScore"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type QuestionType = z.infer<typeof questionTypeSchema>;
export type CreateOptionInput = z.infer<typeof createOptionSchema>;
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;
export type CreateQuizInput = z.infer<typeof createQuizSchema>;
export type UpdateQuizInput = z.infer<typeof updateQuizSchema>;
export type QuizFilters = z.infer<typeof quizFiltersSchema>;
