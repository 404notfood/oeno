import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const completeActivitySchema = z.object({
  activityId: z.string().min(1, "ID d'activité requis"),
  score: z.number().min(0).max(100).optional(),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = completeActivitySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { activityId, score } = parsed.data;

    // Check if activity exists
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
    });

    if (!activity) {
      return NextResponse.json(
        { error: "Activité non trouvée" },
        { status: 404 }
      );
    }

    // Create or update progress — userId comes from the session, never from the client
    const progress = await prisma.userProgress.upsert({
      where: {
        userId_activityId: {
          userId: session.user.id,
          activityId,
        },
      },
      update: {
        status: "COMPLETED",
        score: score ?? 100,
        completedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        activityId,
        status: "COMPLETED",
        score: score ?? 100,
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      progress,
      points: activity.points,
    });
  } catch (error) {
    console.error("Error completing activity:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
