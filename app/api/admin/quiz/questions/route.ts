import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || !["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
      return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
    }

    const body = await request.json();
    const { quizId, question, type, explanation, points, order, options } = body;

    // Validate required fields
    if (!quizId || !question || !options || options.length < 2) {
      return NextResponse.json(
        { error: "Donnees invalides" },
        { status: 400 }
      );
    }

    // Create question with options
    const newQuestion = await prisma.quizQuestion.create({
      data: {
        quizId,
        question,
        type: type || "SINGLE_CHOICE",
        explanation: explanation || null,
        points: points || 1,
        order: order || 1,
        options: {
          create: options.map((opt: { text: string; isCorrect: boolean; order: number }) => ({
            text: opt.text,
            isCorrect: opt.isCorrect,
            order: opt.order,
          })),
        },
      },
      include: {
        options: true,
      },
    });

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "Erreur lors de la creation" },
      { status: 500 }
    );
  }
}
