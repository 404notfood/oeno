import Link from "next/link";
import { getServerSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import {
  getUserProgressData,
  getUserBlocsProgress,
} from "@/actions/progress";

async function getUserDetailedProgress(userId: string) {
  // Get all quiz attempts
  const quizAttempts = await prisma.quizAttempt.findMany({
    where: { userId },
    include: {
      quiz: {
        include: {
          block: true,
        },
      },
    },
    orderBy: { completedAt: "desc" },
  });

  // Get all activity results
  const userProgressRecords = await prisma.userProgress.findMany({
    where: { userId },
    include: {
      activity: {
        include: {
          block: true,
        },
      },
    },
    orderBy: { completedAt: "desc" },
  });

  // Calculate stats
  const totalQuizAttempts = quizAttempts.length;
  const passedQuizzes = quizAttempts.filter((a) => a.passed).length;
  const averageQuizScore =
    totalQuizAttempts > 0
      ? Math.round(
          quizAttempts.reduce((acc, a) => acc + (a.score || 0), 0) / totalQuizAttempts
        )
      : 0;

  const completedActivities = userProgressRecords.filter((r) => r.status === "COMPLETED").length;
  const totalPoints = userProgressRecords.reduce(
    (acc, r) => acc + (r.status === "COMPLETED" ? r.activity.points : 0),
    0
  );

  return {
    quizAttempts: quizAttempts.slice(0, 10),
    activityProgress: userProgressRecords.slice(0, 10),
    stats: {
      totalQuizAttempts,
      passedQuizzes,
      averageQuizScore,
      completedActivities,
      totalPoints,
    },
  };
}

export default async function ProgressionPage() {
  const session = await getServerSession();
  const [progressData, blocsProgress, detailedProgress] = await Promise.all([
    getUserProgressData(session!.user.id),
    getUserBlocsProgress(session!.user.id),
    getUserDetailedProgress(session!.user.id),
  ]);

  const overallProgress =
    progressData.totalBlocks > 0
      ? Math.round(
          (progressData.completedBlocks / progressData.totalBlocks) * 100
        )
      : 0;

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Ma progression</h1>
        <p className="text-[var(--gris-tech)]">
          Suivez votre avancement dans le programme d&apos;œnologie.
        </p>
      </div>

      {/* Overall Progress Card */}
      <div className="card mb-8 bg-gradient-to-br from-[var(--bordeaux)] to-[var(--or)] text-white">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Progression globale</h2>
            <p className="text-white/80 mb-4">
              Vous avez complété {progressData.completedBlocks} bloc
              {progressData.completedBlocks > 1 ? "s" : ""} sur{" "}
              {progressData.totalBlocks}.
            </p>
            <div className="h-4 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <p className="text-right text-sm mt-1 text-white/80">
              {overallProgress}%
            </p>
          </div>
          <div className="text-6xl font-bold font-cormorant">
            {overallProgress}%
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--bordeaux)] bg-opacity-10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <div>
              <p className="text-sm text-[var(--gris-light)]">Blocs complétés</p>
              <p className="text-2xl font-bold text-[var(--bordeaux)] font-cormorant">
                {progressData.completedBlocks}/{progressData.totalBlocks}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--vert)] bg-opacity-10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <p className="text-sm text-[var(--gris-light)]">Activités</p>
              <p className="text-2xl font-bold text-[var(--vert)] font-cormorant">
                {detailedProgress.stats.completedActivities}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--or)] bg-opacity-10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <div>
              <p className="text-sm text-[var(--gris-light)]">Quiz réussis</p>
              <p className="text-2xl font-bold text-[var(--or)] font-cormorant">
                {detailedProgress.stats.passedQuizzes}/
                {detailedProgress.stats.totalQuizAttempts}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--info)] bg-opacity-10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
            <div>
              <p className="text-sm text-[var(--gris-light)]">Points gagnés</p>
              <p className="text-2xl font-bold text-[var(--info)] font-cormorant">
                {detailedProgress.stats.totalPoints}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Blocs Progress */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-6">Progression par bloc</h2>
        <div className="space-y-4">
          {blocsProgress.map((bloc) => (
            <Link
              key={bloc.num}
              href={`/dashboard/blocs/${bloc.num}`}
              className="flex items-center gap-4 p-4 bg-[var(--beige)] rounded-xl hover:bg-[var(--beige-dark)] transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shrink-0">
                {bloc.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-[var(--gris-dark)] group-hover:text-[var(--bordeaux)] transition-colors">
                    Bloc {bloc.num} - {bloc.title}
                  </h3>
                  <span
                    className={`text-sm font-medium ${
                      bloc.status === "completed"
                        ? "text-[var(--success)]"
                        : bloc.status === "in_progress"
                        ? "text-[var(--bordeaux)]"
                        : "text-[var(--gris-light)]"
                    }`}
                  >
                    {bloc.progress}%
                  </span>
                </div>
                <div className="h-2 bg-white rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      bloc.status === "completed"
                        ? "bg-[var(--success)]"
                        : "bg-gradient-to-r from-[var(--bordeaux)] to-[var(--or)]"
                    }`}
                    style={{ width: `${bloc.progress}%` }}
                  />
                </div>
              </div>
              {bloc.status === "completed" && (
                <div className="w-8 h-8 rounded-full bg-[var(--success)] flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Quiz Attempts */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Derniers quiz</h2>
          {detailedProgress.quizAttempts.length > 0 ? (
            <div className="space-y-3">
              {detailedProgress.quizAttempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex items-center justify-between p-3 bg-[var(--beige)] rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        attempt.passed
                          ? "bg-[var(--success)] bg-opacity-10"
                          : "bg-[var(--danger)] bg-opacity-10"
                      }`}
                    >
                      {attempt.passed ? "✅" : "❌"}
                    </div>
                    <div>
                      <p className="font-medium text-[var(--gris-dark)] text-sm">
                        {attempt.quiz.title}
                      </p>
                      <p className="text-xs text-[var(--gris-light)]">
                        Bloc {attempt.quiz.block?.number}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-medium ${
                        attempt.passed
                          ? "text-[var(--success)]"
                          : "text-[var(--danger)]"
                      }`}
                    >
                      {attempt.score}%
                    </p>
                    <p className="text-xs text-[var(--gris-light)]">
                      {new Date(attempt.completedAt!).toLocaleDateString(
                        "fr-FR"
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--gris-light)] text-center py-8">
              Aucun quiz passé pour le moment.
            </p>
          )}
        </div>

        {/* Recent Activities */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Dernières activités</h2>
          {detailedProgress.activityProgress.length > 0 ? (
            <div className="space-y-3">
              {detailedProgress.activityProgress.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center justify-between p-3 bg-[var(--beige)] rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        result.status === "COMPLETED"
                          ? "bg-[var(--success)] bg-opacity-10"
                          : "bg-[var(--or)] bg-opacity-10"
                      }`}
                    >
                      {result.status === "COMPLETED" ? "✅" : "📝"}
                    </div>
                    <div>
                      <p className="font-medium text-[var(--gris-dark)] text-sm">
                        {result.activity.title}
                      </p>
                      <p className="text-xs text-[var(--gris-light)]">
                        Bloc {result.activity.block?.number}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {result.score !== null && (
                      <p className="font-medium text-[var(--success)]">
                        {result.score}%
                      </p>
                    )}
                    <p className="text-xs text-[var(--gris-light)]">
                      {result.completedAt
                        ? new Date(result.completedAt).toLocaleDateString(
                            "fr-FR"
                          )
                        : "En cours"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--gris-light)] text-center py-8">
              Aucune activité complétée pour le moment.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
