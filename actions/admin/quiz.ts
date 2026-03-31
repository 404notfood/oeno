"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";
import { createAuditLog } from "./audit";
import {
  createQuizSchema,
  updateQuizSchema,
  quizFiltersSchema,
  createQuestionSchema,
  updateQuestionSchema,
  type CreateQuizInput,
  type UpdateQuizInput,
  type QuizFilters,
  type CreateQuestionInput,
  type UpdateQuestionInput,
} from "@/lib/validations/admin";
import { revalidatePath } from "next/cache";

export async function getQuizzes(filters: Partial<QuizFilters> = {}) {
  await requireAdmin();

  const validatedFilters = quizFiltersSchema.parse(filters);
  const { search, blockId, isActive, page, limit, sortBy, sortOrder } = validatedFilters;

  const where: Record<string, unknown> = {};

  if (blockId) {
    where.blockId = blockId;
  }

  if (typeof isActive === "boolean") {
    where.isActive = isActive;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [quizzes, total] = await Promise.all([
    prisma.quiz.findMany({
      where,
      include: {
        block: {
          select: {
            id: true,
            number: true,
            title: true,
          },
        },
        _count: {
          select: {
            questions: true,
            attempts: true,
          },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.quiz.count({ where }),
  ]);

  return {
    data: quizzes,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getQuizById(id: string) {
  await requireAdmin();

  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      block: true,
      questions: {
        include: {
          options: {
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
      _count: {
        select: {
          attempts: true,
        },
      },
    },
  });

  if (!quiz) {
    throw new Error("Quiz non trouve");
  }

  return quiz;
}

export async function createQuiz(data: CreateQuizInput) {
  await requireAdmin();

  const validatedData = createQuizSchema.parse(data);

  const quiz = await prisma.quiz.create({
    data: validatedData,
  });

  await createAuditLog({
    action: "CREATE",
    entityType: "Quiz",
    entityId: quiz.id,
    newValues: {
      title: quiz.title,
      blockId: quiz.blockId,
    },
  });

  revalidatePath("/admin/quiz");

  return quiz;
}

export async function updateQuiz(id: string, data: UpdateQuizInput) {
  await requireAdmin();

  const validatedData = updateQuizSchema.parse(data);

  const existingQuiz = await prisma.quiz.findUnique({
    where: { id },
  });

  if (!existingQuiz) {
    throw new Error("Quiz non trouve");
  }

  const quiz = await prisma.quiz.update({
    where: { id },
    data: validatedData,
  });

  await createAuditLog({
    action: "UPDATE",
    entityType: "Quiz",
    entityId: id,
    oldValues: {
      title: existingQuiz.title,
      isActive: existingQuiz.isActive,
    },
    newValues: {
      title: quiz.title,
      isActive: quiz.isActive,
    },
  });

  revalidatePath("/admin/quiz");
  revalidatePath(`/admin/quiz/${id}`);

  return quiz;
}

export async function deleteQuiz(id: string) {
  await requireAdmin();

  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      _count: {
        select: { attempts: true },
      },
    },
  });

  if (!quiz) {
    throw new Error("Quiz non trouve");
  }

  if (quiz._count.attempts > 0) {
    throw new Error("Impossible de supprimer un quiz avec des tentatives associees");
  }

  await prisma.quiz.delete({
    where: { id },
  });

  await createAuditLog({
    action: "DELETE",
    entityType: "Quiz",
    entityId: id,
    oldValues: { title: quiz.title },
  });

  revalidatePath("/admin/quiz");
}

// Questions
export async function createQuestion(data: CreateQuestionInput) {
  await requireAdmin();

  const validatedData = createQuestionSchema.parse(data);
  const { options, ...questionData } = validatedData;

  const question = await prisma.quizQuestion.create({
    data: {
      ...questionData,
      options: options
        ? {
            create: options,
          }
        : undefined,
    },
    include: {
      options: true,
    },
  });

  await createAuditLog({
    action: "CREATE",
    entityType: "QuizQuestion",
    entityId: question.id,
    newValues: {
      question: question.question,
      type: question.type,
      quizId: question.quizId,
    },
  });

  revalidatePath(`/admin/quiz/${validatedData.quizId}`);

  return question;
}

export async function updateQuestion(id: string, data: UpdateQuestionInput) {
  await requireAdmin();

  const validatedData = updateQuestionSchema.parse(data);
  const { options, ...questionData } = validatedData;

  const existingQuestion = await prisma.quizQuestion.findUnique({
    where: { id },
    include: { options: true },
  });

  if (!existingQuestion) {
    throw new Error("Question non trouvee");
  }

  // Update question
  const question = await prisma.quizQuestion.update({
    where: { id },
    data: questionData,
  });

  // Update options if provided
  if (options) {
    // Delete existing options
    await prisma.quizOption.deleteMany({
      where: { questionId: id },
    });

    // Create new options
    await prisma.quizOption.createMany({
      data: options.map((opt) => ({
        ...opt,
        questionId: id,
      })),
    });
  }

  await createAuditLog({
    action: "UPDATE",
    entityType: "QuizQuestion",
    entityId: id,
    oldValues: { question: existingQuestion.question },
    newValues: { question: question.question },
  });

  revalidatePath(`/admin/quiz/${existingQuestion.quizId}`);

  return question;
}

export async function deleteQuestion(id: string) {
  await requireAdmin();

  const question = await prisma.quizQuestion.findUnique({
    where: { id },
  });

  if (!question) {
    throw new Error("Question non trouvee");
  }

  await prisma.quizQuestion.delete({
    where: { id },
  });

  await createAuditLog({
    action: "DELETE",
    entityType: "QuizQuestion",
    entityId: id,
    oldValues: { question: question.question },
  });

  revalidatePath(`/admin/quiz/${question.quizId}`);
}

export async function reorderQuestions(quizId: string, orderedIds: { id: string; order: number }[]) {
  await requireAdmin();

  await Promise.all(
    orderedIds.map(({ id, order }) =>
      prisma.quizQuestion.update({
        where: { id },
        data: { order },
      })
    )
  );

  await createAuditLog({
    action: "REORDER",
    entityType: "QuizQuestion",
    newValues: { quizId, orderedIds },
  });

  revalidatePath(`/admin/quiz/${quizId}`);
}

export async function getQuizzesCount() {
  await requireAdmin();

  const [total, active] = await Promise.all([
    prisma.quiz.count(),
    prisma.quiz.count({ where: { isActive: true } }),
  ]);

  return { total, active };
}
