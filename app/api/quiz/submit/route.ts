import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const submitQuizSchema = z.object({
  quizId: z.string().min(1, "ID de quiz requis"),
  answers: z.record(z.string(), z.array(z.string())),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = submitQuizSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { quizId, answers } = parsed.data;

    // Check if quiz exists and get questions with options
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz non trouvé" },
        { status: 404 }
      );
    }

    // Compute correctness per question and derive score server-side
    const totalQuestions = quiz.questions.length;
    let correctCount = 0;

    const answerData = quiz.questions.map((question) => {
      const userOptionIds: string[] = answers[question.id] || [];

      // Get correct option IDs
      const correctOptionIds = question.options
        .filter((opt) => opt.isCorrect)
        .map((opt) => opt.id);

      // Check if answer is correct
      const isCorrect =
        userOptionIds.length === correctOptionIds.length &&
        userOptionIds.every((id) => correctOptionIds.includes(id));

      if (isCorrect) {
        correctCount++;
      }

      return {
        questionId: question.id,
        selectedOptions: userOptionIds,
        isCorrect,
        points: isCorrect ? question.points : 0,
      };
    });

    // Score and pass/fail computed entirely server-side
    const score = totalQuestions > 0
      ? Math.round((correctCount / totalQuestions) * 100)
      : 0;
    const passed = score >= quiz.passingScore;

    // Create quiz attempt with nested answers
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: session.user.id,
        quizId,
        score,
        passed,
        completedAt: new Date(),
        answers: {
          create: answerData,
        },
      },
      include: {
        answers: true,
      },
    });

    return NextResponse.json({
      success: true,
      attempt,
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
