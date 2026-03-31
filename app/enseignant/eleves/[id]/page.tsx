import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getStudentDetails(studentId: string, teacherId: string) {
  // First verify teacher has access to this student
  const teacherClasses = await prisma.classGroup.findMany({
    where: {
      teachers: { some: { id: teacherId } },
      students: { some: { id: studentId } },
    },
    include: {
      establishment: true,
    },
  });

  if (teacherClasses.length === 0) {
    return null;
  }

  // Get student with all their progress
  const student = await prisma.user.findUnique({
    where: { id: studentId },
    include: {
      progress: {
        include: {
          activity: {
            include: { block: true },
          },
        },
        orderBy: { completedAt: "desc" },
      },
      quizAttempts: {
        include: {
          quiz: {
            include: { block: true },
          },
        },
        orderBy: { completedAt: "desc" },
      },
    },
  });

  if (!student) return null;

  // Get all blocks for progress calculation
  const blocks = await prisma.competencyBlock.findMany({
    include: {
      activities: { where: { isActive: true } },
      quizzes: { where: { isActive: true } },
    },
    orderBy: { number: "asc" },
  });

  // Calculate block progress
  const blocksWithProgress = blocks.map((block) => {
    const completedActivities = student.progress.filter(
      (p) => p.activity.blockId === block.id && p.status === "COMPLETED"
    ).length;
    const totalActivities = block.activities.length;
    const progress =
      totalActivities > 0
        ? Math.round((completedActivities / totalActivities) * 100)
        : 0;

    const passedQuizzes = student.quizAttempts.filter(
      (a) => a.quiz.blockId === block.id && a.passed
    ).length;
    const totalQuizzes = block.quizzes.length;

    return {
      ...block,
      completedActivities,
      totalActivities,
      progress,
      passedQuizzes,
      totalQuizzes,
    };
  });

  return {
    student,
    classes: teacherClasses,
    blocks: blocksWithProgress,
  };
}

export default async function TeacherStudentDetailPage({ params }: PageProps) {
  const session = await getServerSession();
  const { id } = await params;
  const data = await getStudentDetails(id, session!.user.id);

  if (!data) {
    notFound();
  }

  const { student, classes, blocks } = data;

  // Global stats
  const totalCompletedActivities = student.progress.filter(
    (p) => p.status === "COMPLETED"
  ).length;
  const avgScore =
    student.progress.length > 0
      ? Math.round(
          student.progress
            .filter((p) => p.score !== null)
            .reduce((sum, p) => sum + (p.score || 0), 0) /
            student.progress.filter((p) => p.score !== null).length
        )
      : 0;
  const quizzesPassed = student.quizAttempts.filter((a) => a.passed).length;
  const totalQuizAttempts = student.quizAttempts.length;

  return (
    <>
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-[var(--gris-tech)]">
          <li>
            <Link href="/enseignant" className="hover:text-[var(--vert)]">
              Tableau de bord
            </Link>
          </li>
          <li>
            <svg
              className="w-4 h-4"
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
          </li>
          <li>
            <Link href="/enseignant/eleves" className="hover:text-[var(--vert)]">
              Suivi élèves
            </Link>
          </li>
          <li>
            <svg
              className="w-4 h-4"
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
          </li>
          <li className="text-[var(--vert)] font-medium">
            {student.firstName} {student.lastName}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--bordeaux)] to-[var(--or)] flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {student.firstName[0]}
            {student.lastName[0]}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[var(--gris-dark)] mb-1">
              {student.firstName} {student.lastName}
            </h1>
            <p className="text-[var(--gris-tech)] mb-3">{student.email}</p>
            <div className="flex flex-wrap gap-2">
              {classes.map((classe) => (
                <Link
                  key={classe.id}
                  href={`/enseignant/classes/${classe.id}`}
                  className="text-xs bg-[var(--vert)] bg-opacity-10 text-[var(--vert)] px-3 py-1 rounded-full hover:bg-opacity-20 transition-colors"
                >
                  {classe.name}
                  {classe.establishment && ` • ${classe.establishment.name}`}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--success)] bg-opacity-10 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-[var(--success)]"
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
              <p className="text-2xl font-bold text-[var(--success)] font-cormorant">
                {totalCompletedActivities}
              </p>
              <p className="text-xs text-[var(--gris-light)]">Activités</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--bordeaux)] bg-opacity-10 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-[var(--bordeaux)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--bordeaux)] font-cormorant">
                {quizzesPassed}/{totalQuizAttempts}
              </p>
              <p className="text-xs text-[var(--gris-light)]">Quiz réussis</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--or)] bg-opacity-10 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-[var(--or)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--or)] font-cormorant">
                {avgScore > 0 ? `${avgScore}%` : "-"}
              </p>
              <p className="text-xs text-[var(--gris-light)]">Score moyen</p>
            </div>
          </div>
        </div>

        <div className="card">
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--vert)] font-cormorant">
                {blocks.filter((b) => b.progress === 100).length}/8
              </p>
              <p className="text-xs text-[var(--gris-light)]">Blocs complets</p>
            </div>
          </div>
        </div>
      </div>

      {/* Block Progress */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-6">Progression par bloc</h2>
        <div className="space-y-4">
          {blocks.map((block) => (
            <div key={block.id} className="bg-[var(--beige)] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{block.icon}</span>
                  <div>
                    <h3 className="font-medium text-[var(--gris-dark)]">
                      Bloc {block.number}: {block.title}
                    </h3>
                    <p className="text-xs text-[var(--gris-light)]">
                      {block.completedActivities}/{block.totalActivities}{" "}
                      activités • {block.passedQuizzes}/{block.totalQuizzes} quiz
                    </p>
                  </div>
                </div>
                <span
                  className={`font-bold ${
                    block.progress === 100
                      ? "text-[var(--success)]"
                      : block.progress >= 50
                      ? "text-[var(--or)]"
                      : "text-[var(--gris-light)]"
                  }`}
                >
                  {block.progress}%
                </span>
              </div>
              <div className="h-2 bg-white rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    block.progress === 100
                      ? "bg-[var(--success)]"
                      : "bg-gradient-to-r from-[var(--bordeaux)] to-[var(--or)]"
                  }`}
                  style={{ width: `${block.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Quiz Attempts */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Derniers quiz</h2>
          {student.quizAttempts.length > 0 ? (
            <div className="space-y-3">
              {student.quizAttempts.slice(0, 5).map((attempt) => (
                <div
                  key={attempt.id}
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    attempt.passed
                      ? "bg-[var(--success)] bg-opacity-10"
                      : "bg-[var(--beige)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      {attempt.passed ? "✅" : "❌"}
                    </span>
                    <div>
                      <p className="font-medium text-sm text-[var(--gris-dark)]">
                        {attempt.quiz.title}
                      </p>
                      <p className="text-xs text-[var(--gris-light)]">
                        Bloc {attempt.quiz.block?.number}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
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
            <p className="text-center text-[var(--gris-light)] py-6">
              Aucun quiz passé
            </p>
          )}
        </div>

        {/* Recent Activities */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Activités récentes</h2>
          {student.progress.length > 0 ? (
            <div className="space-y-3">
              {student.progress
                .filter((p) => p.status === "COMPLETED")
                .slice(0, 5)
                .map((progress) => (
                  <div
                    key={progress.id}
                    className="flex items-center justify-between p-3 bg-[var(--beige)] rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">✅</span>
                      <div>
                        <p className="font-medium text-sm text-[var(--gris-dark)]">
                          {progress.activity.title}
                        </p>
                        <p className="text-xs text-[var(--gris-light)]">
                          Bloc {progress.activity.block.number}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {progress.score !== null && (
                        <p className="font-bold text-[var(--success)]">
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
            <p className="text-center text-[var(--gris-light)] py-6">
              Aucune activité complétée
            </p>
          )}
        </div>
      </div>
    </>
  );
}
