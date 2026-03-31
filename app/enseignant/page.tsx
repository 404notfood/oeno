import Link from "next/link";
import { getServerSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

async function getTeacherDashboardData(userId: string) {
  // Get teacher's classes
  const teacherClasses = await prisma.classGroup.findMany({
    where: {
      teachers: {
        some: { id: userId },
      },
    },
    include: {
      students: true,
      establishment: true,
    },
  });

  // Get student progress for teacher's classes
  const studentIds = teacherClasses.flatMap((c) => c.students.map((s) => s.id));

  const recentProgress = await prisma.userProgress.findMany({
    where: {
      userId: { in: studentIds },
      status: "COMPLETED",
    },
    include: {
      user: true,
      activity: {
        include: {
          block: true,
        },
      },
    },
    orderBy: { completedAt: "desc" },
    take: 10,
  });

  // Get recent quiz attempts
  const recentQuizAttempts = await prisma.quizAttempt.findMany({
    where: {
      userId: { in: studentIds },
    },
    include: {
      user: true,
      quiz: {
        include: {
          block: true,
        },
      },
    },
    orderBy: { completedAt: "desc" },
    take: 10,
  });

  // Calculate stats
  const totalStudents = new Set(studentIds).size;
  const totalClasses = teacherClasses.length;
  const completedActivities = recentProgress.length;

  return {
    classes: teacherClasses,
    recentProgress,
    recentQuizAttempts,
    stats: {
      totalStudents,
      totalClasses,
      completedActivities,
    },
  };
}

export default async function TeacherDashboardPage() {
  const session = await getServerSession();
  const data = await getTeacherDashboardData(session!.user.id);

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Bonjour, {session!.user.firstName} !
        </h1>
        <p className="text-[var(--gris-tech)]">
          Bienvenue dans votre espace enseignant. Gérez vos classes et suivez la
          progression de vos élèves.
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--vert)] bg-opacity-10 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-[var(--vert)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-[var(--gris-light)]">Élèves</p>
              <p className="text-2xl font-bold text-[var(--vert)] font-cormorant">
                {data.stats.totalStudents}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--bordeaux)] bg-opacity-10 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-[var(--bordeaux)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-[var(--gris-light)]">Classes</p>
              <p className="text-2xl font-bold text-[var(--bordeaux)] font-cormorant">
                {data.stats.totalClasses}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--success)] bg-opacity-10 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-[var(--success)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-[var(--gris-light)]">
                Activités complétées
              </p>
              <p className="text-2xl font-bold text-[var(--success)] font-cormorant">
                {data.stats.completedActivities}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* My Classes */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Mes classes</h2>
          <Link
            href="/enseignant/classes"
            className="text-sm text-[var(--vert)] hover:underline"
          >
            Voir tout
          </Link>
        </div>

        {data.classes.length > 0 ? (
          <div className="space-y-3">
            {data.classes.slice(0, 4).map((classe) => (
              <Link
                key={classe.id}
                href={`/enseignant/classes/${classe.id}`}
                className="flex items-center justify-between p-3 bg-[var(--beige)] rounded-xl hover:bg-[var(--beige-dark)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--vert)] bg-opacity-10 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-[var(--vert)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--gris-dark)]">
                      {classe.name}
                    </p>
                    <p className="text-xs text-[var(--gris-light)]">
                      {classe.students.length} élève
                      {classe.students.length > 1 ? "s" : ""}
                      {classe.establishment && ` • ${classe.establishment.name}`}
                    </p>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-[var(--gris-light)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-[var(--gris-light)] mb-4">
              Aucune classe assignée
            </p>
            <p className="text-sm text-[var(--gris-tech)]">
              Contactez votre administrateur pour être ajouté à une classe.
            </p>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Quiz Attempts */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Derniers quiz</h2>
          {data.recentQuizAttempts.length > 0 ? (
            <div className="space-y-3">
              {data.recentQuizAttempts.slice(0, 5).map((attempt) => (
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
                        {attempt.user.firstName} {attempt.user.lastName}
                      </p>
                      <p className="text-xs text-[var(--gris-light)]">
                        {attempt.quiz.title}
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
                      {attempt.completedAt
                        ? new Date(attempt.completedAt).toLocaleDateString(
                            "fr-FR"
                          )
                        : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-[var(--gris-light)] py-8">
              Aucun quiz passé récemment
            </p>
          )}
        </div>

        {/* Recent Activities */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Activités récentes</h2>
          {data.recentProgress.length > 0 ? (
            <div className="space-y-3">
              {data.recentProgress.slice(0, 5).map((progress) => (
                <div
                  key={progress.id}
                  className="flex items-center justify-between p-3 bg-[var(--beige)] rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--success)] bg-opacity-10 rounded-lg flex items-center justify-center">
                      ✅
                    </div>
                    <div>
                      <p className="font-medium text-[var(--gris-dark)] text-sm">
                        {progress.user.firstName} {progress.user.lastName}
                      </p>
                      <p className="text-xs text-[var(--gris-light)]">
                        {progress.activity.title}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {progress.score !== null && (
                      <p className="font-medium text-[var(--success)]">
                        {progress.score}%
                      </p>
                    )}
                    <p className="text-xs text-[var(--gris-light)]">
                      {progress.completedAt
                        ? new Date(progress.completedAt).toLocaleDateString(
                            "fr-FR"
                          )
                        : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-[var(--gris-light)] py-8">
              Aucune activité récente
            </p>
          )}
        </div>
      </div>
    </>
  );
}
