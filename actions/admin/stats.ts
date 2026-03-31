"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";

export async function getGlobalStats() {
  await requireAdmin();

  const [
    usersCount,
    studentsCount,
    teachersCount,
    establishmentsCount,
    classesCount,
    activitiesCount,
    quizzesCount,
    winesCount,
    grapesCount,
    appellationsCount,
    tastingsCount,
    quizAttemptsCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "TEACHER" } }),
    prisma.establishment.count({ where: { isActive: true } }),
    prisma.classGroup.count({ where: { isActive: true } }),
    prisma.activity.count({ where: { isActive: true } }),
    prisma.quiz.count({ where: { isActive: true } }),
    prisma.wine.count(),
    prisma.grapeVariety.count(),
    prisma.appellation.count(),
    prisma.tasting.count(),
    prisma.quizAttempt.count(),
  ]);

  return {
    users: {
      total: usersCount,
      students: studentsCount,
      teachers: teachersCount,
    },
    establishments: establishmentsCount,
    classes: classesCount,
    activities: activitiesCount,
    quizzes: quizzesCount,
    wines: winesCount,
    grapes: grapesCount,
    appellations: appellationsCount,
    tastings: tastingsCount,
    quizAttempts: quizAttemptsCount,
  };
}

export async function getRecentActivity() {
  await requireAdmin();

  const [recentUsers, recentTastings, recentQuizAttempts] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.tasting.findMany({
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        wine: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.quizAttempt.findMany({
      select: {
        id: true,
        score: true,
        passed: true,
        completedAt: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        quiz: {
          select: {
            title: true,
          },
        },
      },
      where: { completedAt: { not: null } },
      orderBy: { completedAt: "desc" },
      take: 5,
    }),
  ]);

  return {
    recentUsers,
    recentTastings,
    recentQuizAttempts,
  };
}

export async function getUserStats() {
  await requireAdmin();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [totalUsers, activeUsers, newUsersThisMonth, usersByRole] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: {
        lastLoginAt: { gte: thirtyDaysAgo },
      },
    }),
    prisma.user.count({
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
    prisma.user.groupBy({
      by: ["role"],
      _count: { role: true },
    }),
  ]);

  return {
    total: totalUsers,
    active: activeUsers,
    newThisMonth: newUsersThisMonth,
    byRole: usersByRole.reduce(
      (acc, curr) => {
        acc[curr.role] = curr._count.role;
        return acc;
      },
      {} as Record<string, number>
    ),
  };
}

export async function getProgressStats() {
  await requireAdmin();

  const [
    totalProgress,
    completedProgress,
    avgScore,
    quizPassRate,
  ] = await Promise.all([
    prisma.userProgress.count(),
    prisma.userProgress.count({ where: { status: "COMPLETED" } }),
    prisma.userProgress.aggregate({
      _avg: { score: true },
      where: { score: { not: null } },
    }),
    prisma.quizAttempt.aggregate({
      _avg: { score: true },
      where: { completedAt: { not: null } },
    }),
  ]);

  const completionRate = totalProgress > 0
    ? Math.round((completedProgress / totalProgress) * 100)
    : 0;

  return {
    totalProgress,
    completedProgress,
    completionRate,
    avgScore: Math.round(avgScore._avg.score || 0),
    avgQuizScore: Math.round(quizPassRate._avg.score || 0),
  };
}

export async function getContentStats() {
  await requireAdmin();

  const [
    blocsActive,
    activitiesActive,
    quizzesActive,
    questionsTotal,
    winesTotal,
    grapesTotal,
    appellationsTotal,
    glossaryTerms,
    aromaCategories,
  ] = await Promise.all([
    prisma.competencyBlock.count({ where: { isActive: true } }),
    prisma.activity.count({ where: { isActive: true } }),
    prisma.quiz.count({ where: { isActive: true } }),
    prisma.quizQuestion.count(),
    prisma.wine.count(),
    prisma.grapeVariety.count(),
    prisma.appellation.count(),
    prisma.glossaryTerm.count(),
    prisma.aromaCategory.count(),
  ]);

  return {
    blocs: blocsActive,
    activities: activitiesActive,
    quizzes: quizzesActive,
    questions: questionsTotal,
    wines: winesTotal,
    grapes: grapesTotal,
    appellations: appellationsTotal,
    glossaryTerms,
    aromaCategories,
  };
}
