import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{ num: string }>;
}

async function getBlocWithActivities(blockNumber: number, userId: string) {
  const bloc = await prisma.competencyBlock.findUnique({
    where: { number: blockNumber },
    include: {
      activities: {
        where: { isActive: true },
        orderBy: { order: "asc" },
      },
      quizzes: {
        where: { isActive: true },
        include: {
          questions: true,
          attempts: {
            where: { userId },
            orderBy: { completedAt: "desc" },
            take: 1,
          },
        },
      },
    },
  });

  if (!bloc) return null;

  // Get user's activity progress
  const userProgressRecords = await prisma.userProgress.findMany({
    where: {
      userId,
      activityId: { in: bloc.activities.map((a) => a.id) },
    },
  });

  // Map activities with completion status
  const activitiesWithStatus = bloc.activities.map((activity) => {
    const progress = userProgressRecords.find((r) => r.activityId === activity.id);
    return {
      ...activity,
      completed: progress?.status === "COMPLETED",
      score: progress?.score || null,
    };
  });

  // Map quizzes with attempt status
  const quizzesWithStatus = bloc.quizzes.map((quiz) => {
    const lastAttempt = quiz.attempts[0];
    return {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      questionCount: quiz.questions.length,
      passingScore: quiz.passingScore,
      attempted: !!lastAttempt,
      passed: lastAttempt?.passed || false,
      lastScore: lastAttempt?.score || null,
    };
  });

  return {
    ...bloc,
    activities: activitiesWithStatus,
    quizzes: quizzesWithStatus,
  };
}

const activityTypeIcons: Record<string, string> = {
  LESSON: "📖",
  QUIZ: "❓",
  FRISE: "📅",
  SCHEMA: "🔀",
  ROUE_AROMES: "👃",
  FICHE_ANALYSE: "📋",
  ETUDE_CAS: "🔍",
  ARBRE_DIAGNOSTIC: "🌳",
  APPARIEMENT: "🔗",
  INTERACTIVE: "🎮",
};

const activityTypeLabels: Record<string, string> = {
  LESSON: "Leçon",
  QUIZ: "Quiz",
  FRISE: "Frise chronologique",
  SCHEMA: "Schéma interactif",
  ROUE_AROMES: "Roue des arômes",
  FICHE_ANALYSE: "Fiche d'analyse",
  ETUDE_CAS: "Étude de cas",
  ARBRE_DIAGNOSTIC: "Arbre de diagnostic",
  APPARIEMENT: "Appariement",
  INTERACTIVE: "Activité interactive",
};

export default async function BlocDetailPage({ params }: PageProps) {
  const session = await getServerSession();
  const { num } = await params;
  const blockNumber = parseInt(num);

  if (isNaN(blockNumber) || blockNumber < 1 || blockNumber > 8) {
    notFound();
  }

  const bloc = await getBlocWithActivities(blockNumber, session!.user.id);

  if (!bloc) {
    notFound();
  }

  const completedActivities = bloc.activities.filter((a) => a.completed).length;
  const totalActivities = bloc.activities.length;
  const progress =
    totalActivities > 0
      ? Math.round((completedActivities / totalActivities) * 100)
      : 0;

  return (
    <>
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-[var(--gris-tech)]">
          <li>
            <Link href="/dashboard" className="hover:text-[var(--bordeaux)]">
              Tableau de bord
            </Link>
          </li>
          <li>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li>
            <Link href="/dashboard/blocs" className="hover:text-[var(--bordeaux)]">
              Les 8 blocs
            </Link>
          </li>
          <li>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li className="text-[var(--bordeaux)] font-medium">Bloc {bloc.number}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="card mb-8">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--bordeaux)] to-[var(--or)] flex items-center justify-center text-4xl shrink-0">
            {bloc.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-[var(--bordeaux)] bg-[var(--bordeaux)] bg-opacity-10 px-3 py-1 rounded-full">
                Bloc {bloc.number}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--gris-dark)] mb-2">
              {bloc.title}
            </h1>
            <p className="text-[var(--gris-tech)] mb-4">{bloc.description}</p>

            {/* Progress */}
            <div className="flex items-center gap-4">
              <div className="flex-1 max-w-md">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-[var(--gris-light)]">
                    {completedActivities}/{totalActivities} activités complétées
                  </span>
                  <span className="font-medium text-[var(--bordeaux)]">
                    {progress}%
                  </span>
                </div>
                <div className="h-3 bg-[var(--beige)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--bordeaux)] to-[var(--or)] rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activities */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Activités</h2>
        <div className="space-y-3">
          {bloc.activities.map((activity, index) => (
            <Link
              key={activity.id}
              href={`/dashboard/blocs/${bloc.number}/activites/${activity.id}`}
              className="card flex items-center gap-4 hover:shadow-md transition-all group"
            >
              {/* Order number */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  activity.completed
                    ? "bg-[var(--success)] text-white"
                    : "bg-[var(--beige)] text-[var(--gris-tech)]"
                }`}
              >
                {activity.completed ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-[var(--bordeaux)] bg-opacity-10 flex items-center justify-center text-2xl shrink-0">
                {activityTypeIcons[activity.type] || "📝"}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-[var(--gris-dark)] group-hover:text-[var(--bordeaux)] transition-colors">
                    {activity.title}
                  </h3>
                  <span className="text-xs text-[var(--gris-light)] bg-[var(--beige)] px-2 py-0.5 rounded">
                    {activityTypeLabels[activity.type] || activity.type}
                  </span>
                </div>
                <p className="text-sm text-[var(--gris-tech)] line-clamp-1">
                  {activity.description}
                </p>
              </div>

              {/* Meta */}
              <div className="text-right shrink-0">
                <div className="flex items-center gap-2 text-sm text-[var(--gris-light)]">
                  {activity.duration && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {activity.duration} min
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    {activity.points} pts
                  </span>
                </div>
                {activity.score !== null && (
                  <p className="text-sm font-medium text-[var(--success)] mt-1">
                    Score: {activity.score}%
                  </p>
                )}
              </div>

              {/* Arrow */}
              <svg
                className="w-5 h-5 text-[var(--gris-light)] group-hover:text-[var(--bordeaux)] group-hover:translate-x-1 transition-all shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}

          {bloc.activities.length === 0 && (
            <div className="card text-center py-8">
              <p className="text-[var(--gris-light)]">
                Aucune activité disponible pour ce bloc.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quizzes */}
      {bloc.quizzes.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Quiz de validation</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {bloc.quizzes.map((quiz) => (
              <Link
                key={quiz.id}
                href={`/dashboard/blocs/${bloc.number}/quiz/${quiz.id}`}
                className="card hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                      quiz.passed
                        ? "bg-[var(--success)] bg-opacity-10"
                        : "bg-[var(--bordeaux)] bg-opacity-10"
                    }`}
                  >
                    {quiz.passed ? "✅" : "❓"}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-[var(--gris-dark)] group-hover:text-[var(--bordeaux)] transition-colors mb-1">
                      {quiz.title}
                    </h3>
                    <p className="text-sm text-[var(--gris-tech)] line-clamp-2 mb-2">
                      {quiz.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-[var(--gris-light)]">
                      <span>{quiz.questionCount} questions</span>
                      <span>•</span>
                      <span>Score min: {quiz.passingScore}%</span>
                    </div>
                    {quiz.attempted && (
                      <p
                        className={`text-sm font-medium mt-2 ${
                          quiz.passed
                            ? "text-[var(--success)]"
                            : "text-[var(--danger)]"
                        }`}
                      >
                        {quiz.passed
                          ? `Réussi (${quiz.lastScore}%)`
                          : `Dernier score: ${quiz.lastScore}%`}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        {bloc.number > 1 && (
          <Link
            href={`/dashboard/blocs/${bloc.number - 1}`}
            className="btn btn-secondary flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Bloc {bloc.number - 1}
          </Link>
        )}
        <div className="flex-1" />
        {bloc.number < 8 && (
          <Link
            href={`/dashboard/blocs/${bloc.number + 1}`}
            className="btn btn-primary flex items-center gap-2"
          >
            Bloc {bloc.number + 1}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </>
  );
}
