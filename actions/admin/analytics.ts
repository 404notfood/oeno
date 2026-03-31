"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";

// Types
export interface TimeSeriesDataPoint {
  name: string;
  value: number;
}

export interface MultiSeriesDataPoint {
  name: string;
  [key: string]: string | number;
}

export interface DistributionDataPoint {
  name: string;
  value: number;
  color?: string;
}

// Statistiques d'inscription par période
export async function getUserRegistrationStats(
  period: "week" | "month" | "year" = "month"
): Promise<TimeSeriesDataPoint[]> {
  await requireAdmin();

  const now = new Date();
  let startDate: Date;
  let groupByFormat: string;
  let labels: string[];

  switch (period) {
    case "week":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      groupByFormat = "day";
      labels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
      break;
    case "year":
      startDate = new Date(now.getFullYear(), 0, 1);
      groupByFormat = "month";
      labels = [
        "Jan",
        "Fév",
        "Mar",
        "Avr",
        "Mai",
        "Juin",
        "Juil",
        "Août",
        "Sep",
        "Oct",
        "Nov",
        "Déc",
      ];
      break;
    case "month":
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      groupByFormat = "day";
      const daysInMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0
      ).getDate();
      labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
      break;
  }

  const users = await prisma.user.findMany({
    where: {
      createdAt: { gte: startDate },
    },
    select: {
      createdAt: true,
    },
  });

  // Grouper par période
  const counts: Record<string, number> = {};
  labels.forEach((label) => (counts[label] = 0));

  users.forEach((user) => {
    const date = new Date(user.createdAt);
    let key: string;

    if (groupByFormat === "day") {
      if (period === "week") {
        const dayIndex = (date.getDay() + 6) % 7; // Lundi = 0
        key = labels[dayIndex];
      } else {
        key = `${date.getDate()}`;
      }
    } else {
      key = labels[date.getMonth()];
    }

    if (counts[key] !== undefined) {
      counts[key]++;
    }
  });

  return labels.map((label) => ({
    name: label,
    value: counts[label] || 0,
  }));
}

// Distribution des utilisateurs par rôle
export async function getUserRoleDistribution(): Promise<DistributionDataPoint[]> {
  await requireAdmin();

  const roleCounts = await prisma.user.groupBy({
    by: ["role"],
    _count: true,
  });

  const roleLabels: Record<string, string> = {
    STUDENT: "Élèves",
    TEACHER: "Enseignants",
    ADMIN: "Administrateurs",
    SUPER_ADMIN: "Super Admin",
  };

  const roleColors: Record<string, string> = {
    STUDENT: "#6B1F3D",
    TEACHER: "#C5975C",
    ADMIN: "#4A5D3F",
    SUPER_ADMIN: "#3B82F6",
  };

  return roleCounts.map((item) => ({
    name: roleLabels[item.role] || item.role,
    value: item._count,
    color: roleColors[item.role] || "#566573",
  }));
}

// Activité par bloc de compétence
export async function getActivityByBloc(): Promise<DistributionDataPoint[]> {
  await requireAdmin();

  try {
    const blocs = await prisma.competencyBlock.findMany({
      select: {
        id: true,
        title: true,
        number: true,
        _count: {
          select: {
            activities: true,
          },
        },
      },
      orderBy: { number: "asc" },
    });

    return blocs.map((bloc) => ({
      name: `B${bloc.number}`,
      value: bloc._count.activities,
    }));
  } catch {
    // Fallback si le modèle n'existe pas
    return [];
  }
}

// Progression des quiz au fil du temps
export async function getQuizCompletionStats(
  period: "week" | "month" | "year" = "month"
): Promise<MultiSeriesDataPoint[]> {
  await requireAdmin();

  const now = new Date();
  let startDate: Date;
  let labels: string[];

  switch (period) {
    case "week":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      labels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
      break;
    case "year":
      startDate = new Date(now.getFullYear(), 0, 1);
      labels = [
        "Jan",
        "Fév",
        "Mar",
        "Avr",
        "Mai",
        "Juin",
        "Juil",
        "Août",
        "Sep",
        "Oct",
        "Nov",
        "Déc",
      ];
      break;
    case "month":
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const daysInMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0
      ).getDate();
      labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
      break;
  }

  try {
    const attempts = await prisma.quizAttempt.findMany({
      where: {
        completedAt: { gte: startDate },
      },
      select: {
        completedAt: true,
        score: true,
      },
    });

    // Initialiser les compteurs
    const completions: Record<string, number> = {};
    const averageScores: Record<string, { total: number; count: number }> = {};
    labels.forEach((label) => {
      completions[label] = 0;
      averageScores[label] = { total: 0, count: 0 };
    });

    attempts.forEach((attempt) => {
      if (!attempt.completedAt) return;
      const date = new Date(attempt.completedAt);
      let key: string;

      if (period === "week") {
        const dayIndex = (date.getDay() + 6) % 7;
        key = labels[dayIndex];
      } else if (period === "year") {
        key = labels[date.getMonth()];
      } else {
        key = `${date.getDate()}`;
      }

      if (completions[key] !== undefined) {
        completions[key]++;
        // Score is already 0-100
        if (attempt.score !== null) {
          averageScores[key].total += attempt.score;
          averageScores[key].count++;
        }
      }
    });

    return labels.map((label) => ({
      name: label,
      completions: completions[label] || 0,
      averageScore:
        averageScores[label].count > 0
          ? Math.round(averageScores[label].total / averageScores[label].count)
          : 0,
    }));
  } catch {
    return labels.map((label) => ({
      name: label,
      completions: 0,
      averageScore: 0,
    }));
  }
}

// Statistiques de connexion par période
export async function getLoginStats(
  period: "week" | "month" | "year" = "month"
): Promise<TimeSeriesDataPoint[]> {
  await requireAdmin();

  const now = new Date();
  let startDate: Date;
  let labels: string[];

  switch (period) {
    case "week":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      labels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
      break;
    case "year":
      startDate = new Date(now.getFullYear(), 0, 1);
      labels = [
        "Jan",
        "Fév",
        "Mar",
        "Avr",
        "Mai",
        "Juin",
        "Juil",
        "Août",
        "Sep",
        "Oct",
        "Nov",
        "Déc",
      ];
      break;
    case "month":
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const daysInMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0
      ).getDate();
      labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
      break;
  }

  try {
    const sessions = await prisma.session.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      select: {
        createdAt: true,
      },
    });

    const counts: Record<string, number> = {};
    labels.forEach((label) => (counts[label] = 0));

    sessions.forEach((session) => {
      const date = new Date(session.createdAt);
      let key: string;

      if (period === "week") {
        const dayIndex = (date.getDay() + 6) % 7;
        key = labels[dayIndex];
      } else if (period === "year") {
        key = labels[date.getMonth()];
      } else {
        key = `${date.getDate()}`;
      }

      if (counts[key] !== undefined) {
        counts[key]++;
      }
    });

    return labels.map((label) => ({
      name: label,
      value: counts[label] || 0,
    }));
  } catch {
    return labels.map((label) => ({
      name: label,
      value: 0,
    }));
  }
}

// Distribution des établissements par région
export async function getEstablishmentsByRegion(): Promise<DistributionDataPoint[]> {
  await requireAdmin();

  const establishments = await prisma.establishment.groupBy({
    by: ["region"],
    _count: true,
    orderBy: {
      _count: {
        region: "desc",
      },
    },
    take: 10,
  });

  return establishments.map((item) => ({
    name: item.region || "Non défini",
    value: item._count,
  }));
}

// Distribution des classes par niveau
export async function getClassesByLevel(): Promise<DistributionDataPoint[]> {
  await requireAdmin();

  const classes = await prisma.classGroup.groupBy({
    by: ["level"],
    _count: true,
    orderBy: {
      _count: {
        level: "desc",
      },
    },
  });

  return classes.map((item) => ({
    name: item.level || "Non défini",
    value: item._count,
  }));
}

// Statistiques de contenu
export async function getContentStats(): Promise<{
  wines: number;
  grapes: number;
  appellations: number;
  glossaryTerms: number;
  quizzes: number;
  questions: number;
}> {
  await requireAdmin();

  const [wines, grapes, appellations, glossaryTerms, quizzes, questions] =
    await Promise.all([
      prisma.wine.count(),
      prisma.grapeVariety.count(),
      prisma.appellation.count(),
      prisma.glossaryTerm.count(),
      prisma.quiz.count(),
      prisma.quizQuestion.count(),
    ]);

  return {
    wines,
    grapes,
    appellations,
    glossaryTerms,
    quizzes,
    questions,
  };
}

// Tendances globales (comparaison mois actuel vs précédent)
export async function getGlobalTrends(): Promise<{
  users: { current: number; previous: number; trend: number };
  sessions: { current: number; previous: number; trend: number };
  quizCompleted: { current: number; previous: number; trend: number };
}> {
  await requireAdmin();

  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // Utilisateurs
  const [currentUsers, previousUsers] = await Promise.all([
    prisma.user.count({
      where: { createdAt: { gte: startOfCurrentMonth } },
    }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: startOfPreviousMonth,
          lt: startOfCurrentMonth,
        },
      },
    }),
  ]);

  // Sessions
  const [currentSessions, previousSessions] = await Promise.all([
    prisma.session.count({
      where: { createdAt: { gte: startOfCurrentMonth } },
    }),
    prisma.session.count({
      where: {
        createdAt: {
          gte: startOfPreviousMonth,
          lt: startOfCurrentMonth,
        },
      },
    }),
  ]);

  // Quiz complétés
  let currentQuiz = 0;
  let previousQuiz = 0;
  try {
    [currentQuiz, previousQuiz] = await Promise.all([
      prisma.quizAttempt.count({
        where: { completedAt: { gte: startOfCurrentMonth } },
      }),
      prisma.quizAttempt.count({
        where: {
          completedAt: {
            gte: startOfPreviousMonth,
            lt: startOfCurrentMonth,
          },
        },
      }),
    ]);
  } catch {
    // Model might not exist
  }

  const calculateTrend = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  return {
    users: {
      current: currentUsers,
      previous: previousUsers,
      trend: calculateTrend(currentUsers, previousUsers),
    },
    sessions: {
      current: currentSessions,
      previous: previousSessions,
      trend: calculateTrend(currentSessions, previousSessions),
    },
    quizCompleted: {
      current: currentQuiz,
      previous: previousQuiz,
      trend: calculateTrend(currentQuiz, previousQuiz),
    },
  };
}
