"use server";

import prisma from "@/lib/prisma";
import { ProgressStatus } from "@prisma/client";

export interface ProgressData {
  completedBlocks: number;
  totalBlocks: number;
  completedActivities: number;
  totalActivities: number;
  averageScore: number;
}

export interface BlocProgress {
  num: number;
  icon: string;
  title: string;
  progress: number;
  status: "completed" | "in_progress" | "locked";
}

export interface RecentActivity {
  type: "quiz" | "activity" | "tasting";
  title: string;
  bloc: number;
  score?: number;
  date: string;
}

// Icones par defaut pour les blocs
const BLOC_ICONS: Record<number, string> = {
  1: "🍇",
  2: "🌿",
  3: "🍷",
  4: "👃",
  5: "🍃",
  6: "🔍",
  7: "🥂",
  8: "⚖️",
};

// Titres par defaut pour les blocs (si non definis en base)
const BLOC_TITLES: Record<number, string> = {
  1: "Culture vitivinicole",
  2: "Vigne et raisin",
  3: "Vinification",
  4: "Analyse sensorielle",
  5: "Cepages et styles",
  6: "Qualite et defauts",
  7: "Vins sans alcool",
  8: "Reglementation",
};

/**
 * Recupere les donnees de progression globales d'un utilisateur
 */
export async function getUserProgressData(userId: string): Promise<ProgressData> {
  // Recuperer le nombre total d'activites actives
  const totalActivities = await prisma.activity.count({
    where: { isActive: true },
  });

  // Recuperer les progressions completees de l'utilisateur
  const userProgress = await prisma.userProgress.findMany({
    where: {
      userId,
      status: ProgressStatus.COMPLETED,
    },
    include: {
      activity: {
        include: {
          block: true,
        },
      },
    },
  });

  const completedActivities = userProgress.length;

  // Calculer le score moyen
  const scoresWithValues = userProgress.filter((p) => p.score !== null);
  const averageScore =
    scoresWithValues.length > 0
      ? Math.round(
          scoresWithValues.reduce((sum, p) => sum + (p.score || 0), 0) /
            scoresWithValues.length
        )
      : 0;

  // Recuperer les blocs avec leurs activites
  const blocks = await prisma.competencyBlock.findMany({
    where: { isActive: true },
    include: {
      activities: {
        where: { isActive: true },
      },
    },
  });

  // Compter les blocs completes (toutes les activites terminees)
  let completedBlocks = 0;
  for (const block of blocks) {
    if (block.activities.length === 0) continue;

    const blockActivityIds = block.activities.map((a) => a.id);
    const completedInBlock = userProgress.filter((p) =>
      blockActivityIds.includes(p.activityId)
    ).length;

    if (completedInBlock === block.activities.length) {
      completedBlocks++;
    }
  }

  return {
    completedBlocks,
    totalBlocks: 8,
    completedActivities,
    totalActivities,
    averageScore,
  };
}

/**
 * Recupere la progression par bloc pour un utilisateur
 */
export async function getUserBlocsProgress(userId: string): Promise<BlocProgress[]> {
  // Recuperer tous les blocs avec leurs activites
  const blocks = await prisma.competencyBlock.findMany({
    where: { isActive: true },
    orderBy: { number: "asc" },
    include: {
      activities: {
        where: { isActive: true },
      },
    },
  });

  // Recuperer toutes les progressions de l'utilisateur
  const userProgress = await prisma.userProgress.findMany({
    where: { userId },
  });

  const progressByActivityId = new Map(
    userProgress.map((p) => [p.activityId, p])
  );

  // Generer les 8 blocs (meme s'ils n'existent pas encore en base)
  const blocsProgress: BlocProgress[] = [];
  let previousBlockCompleted = true;

  for (let num = 1; num <= 8; num++) {
    const block = blocks.find((b) => b.number === num);

    if (!block || block.activities.length === 0) {
      // Bloc sans activites - utiliser les valeurs par defaut
      blocsProgress.push({
        num,
        icon: BLOC_ICONS[num] || "📚",
        title: BLOC_TITLES[num] || `Bloc ${num}`,
        progress: 0,
        status: previousBlockCompleted ? "in_progress" : "locked",
      });
      previousBlockCompleted = false;
      continue;
    }

    // Calculer la progression du bloc
    const completedInBlock = block.activities.filter((a) => {
      const progress = progressByActivityId.get(a.id);
      return progress?.status === ProgressStatus.COMPLETED;
    }).length;

    const progressPercent = Math.round(
      (completedInBlock / block.activities.length) * 100
    );

    let status: "completed" | "in_progress" | "locked";
    if (progressPercent === 100) {
      status = "completed";
    } else if (previousBlockCompleted) {
      status = "in_progress";
    } else {
      status = "locked";
    }

    blocsProgress.push({
      num,
      icon: block.icon || BLOC_ICONS[num] || "📚",
      title: block.title || BLOC_TITLES[num] || `Bloc ${num}`,
      progress: progressPercent,
      status,
    });

    previousBlockCompleted = progressPercent === 100;
  }

  return blocsProgress;
}

/**
 * Recupere les activites recentes d'un utilisateur
 */
export async function getUserRecentActivities(
  userId: string,
  limit: number = 5
): Promise<RecentActivity[]> {
  const recentActivities: RecentActivity[] = [];

  // Recuperer les dernieres progressions
  const recentProgress = await prisma.userProgress.findMany({
    where: {
      userId,
      status: {
        in: [ProgressStatus.COMPLETED, ProgressStatus.IN_PROGRESS],
      },
    },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      activity: {
        include: {
          block: true,
        },
      },
    },
  });

  for (const progress of recentProgress) {
    recentActivities.push({
      type: "activity",
      title: progress.activity.title,
      bloc: progress.activity.block.number,
      score: progress.score ?? undefined,
      date: formatRelativeDate(progress.updatedAt),
    });
  }

  // Recuperer les derniers quiz
  const recentQuizzes = await prisma.quizAttempt.findMany({
    where: {
      userId,
      completedAt: { not: null },
    },
    orderBy: { completedAt: "desc" },
    take: limit,
    include: {
      quiz: {
        include: {
          block: true,
        },
      },
    },
  });

  for (const attempt of recentQuizzes) {
    recentActivities.push({
      type: "quiz",
      title: `Quiz - ${attempt.quiz.title}`,
      bloc: attempt.quiz.block?.number || 0,
      score: attempt.score ?? undefined,
      date: formatRelativeDate(attempt.completedAt!),
    });
  }

  // Recuperer les dernieres degustations
  const recentTastings = await prisma.tasting.findMany({
    where: {
      userId,
      status: { not: "DRAFT" },
    },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      wine: true,
    },
  });

  for (const tasting of recentTastings) {
    recentActivities.push({
      type: "tasting",
      title: tasting.title || `Degustation ${tasting.wine?.name || ""}`,
      bloc: 4, // Les degustations sont liees au bloc 4 (analyse sensorielle)
      score: tasting.overallScore ?? undefined,
      date: formatRelativeDate(tasting.updatedAt),
    });
  }

  // Trier par date et limiter
  return recentActivities
    .sort((a, b) => {
      // Convertir les dates relatives en priorite (Aujourd'hui > Hier > etc.)
      const priority: Record<string, number> = {
        "Aujourd'hui": 0,
        Hier: 1,
      };
      const aPriority = priority[a.date] ?? 99;
      const bPriority = priority[b.date] ?? 99;
      return aPriority - bPriority;
    })
    .slice(0, limit);
}

/**
 * Recupere le bloc actuellement en cours pour un utilisateur
 */
export async function getCurrentBlock(userId: string): Promise<number | null> {
  const blocsProgress = await getUserBlocsProgress(userId);
  const inProgressBloc = blocsProgress.find((b) => b.status === "in_progress");
  return inProgressBloc?.num || null;
}

/**
 * Formate une date en format relatif
 */
function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
  return `Il y a ${Math.floor(diffDays / 30)} mois`;
}
