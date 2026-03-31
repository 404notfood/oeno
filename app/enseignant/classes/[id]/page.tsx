import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getClassDetails(classId: string, teacherId: string) {
  const classGroup = await prisma.classGroup.findFirst({
    where: {
      id: classId,
      teachers: {
        some: { id: teacherId },
      },
    },
    include: {
      students: {
        include: {
          progress: {
            where: { status: "COMPLETED" },
            include: {
              activity: {
                include: { block: true },
              },
            },
          },
          quizAttempts: {
            orderBy: { completedAt: "desc" },
            take: 5,
            include: {
              quiz: {
                include: { block: true },
              },
            },
          },
        },
        orderBy: { lastName: "asc" },
      },
      establishment: true,
    },
  });

  return classGroup;
}

export default async function TeacherClassDetailPage({ params }: PageProps) {
  const session = await getServerSession();
  const { id } = await params;
  const classGroup = await getClassDetails(id, session!.user.id);

  if (!classGroup) {
    notFound();
  }

  // Calculate student statistics
  const studentsWithStats = classGroup.students.map((student) => {
    const completedActivities = student.progress.length;
    const avgScore =
      student.progress.length > 0
        ? Math.round(
            student.progress.reduce((sum, p) => sum + (p.score || 0), 0) /
              student.progress.length
          )
        : 0;
    const quizzesPassed = student.quizAttempts.filter((a) => a.passed).length;
    const lastActivity = student.progress[0]?.completedAt || null;

    return {
      ...student,
      stats: {
        completedActivities,
        avgScore,
        quizzesPassed,
        lastActivity,
      },
    };
  });

  // Class average
  const classAvgScore =
    studentsWithStats.length > 0
      ? Math.round(
          studentsWithStats.reduce((sum, s) => sum + s.stats.avgScore, 0) /
            studentsWithStats.length
        )
      : 0;

  const totalCompletedActivities = studentsWithStats.reduce(
    (sum, s) => sum + s.stats.completedActivities,
    0
  );

  return (
    <>
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-[var(--gris-tech)]">
          <li>
            <Link
              href="/enseignant"
              className="hover:text-[var(--vert)]"
            >
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
            <Link
              href="/enseignant/classes"
              className="hover:text-[var(--vert)]"
            >
              Mes classes
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
          <li className="text-[var(--vert)] font-medium">{classGroup.name}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[var(--vert)] to-[var(--bordeaux)] rounded-xl flex items-center justify-center text-white text-2xl font-bold">
              {classGroup.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--gris-dark)]">
                {classGroup.name}
              </h1>
              <p className="text-[var(--gris-tech)]">
                {classGroup.year}
                {classGroup.establishment &&
                  ` • ${classGroup.establishment.name}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--vert)] font-cormorant">
                {classGroup.students.length}
              </p>
              <p className="text-xs text-[var(--gris-light)]">Élèves</p>
            </div>
          </div>
        </div>

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
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--bordeaux)] font-cormorant">
                {classAvgScore}%
              </p>
              <p className="text-xs text-[var(--gris-light)]">Score moyen</p>
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Élèves</h2>

        {studentsWithStats.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--beige-dark)]">
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--gris-light)]">
                    Élève
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-[var(--gris-light)]">
                    Activités
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-[var(--gris-light)]">
                    Quiz réussis
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-[var(--gris-light)]">
                    Score moyen
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-[var(--gris-light)]">
                    Dernière activité
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-[var(--gris-light)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {studentsWithStats.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-[var(--beige)] hover:bg-[var(--beige)] transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--bordeaux)] to-[var(--or)] flex items-center justify-center text-white text-xs font-bold">
                          {student.firstName[0]}
                          {student.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-[var(--gris-dark)]">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-xs text-[var(--gris-light)]">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-medium text-[var(--gris-dark)]">
                        {student.stats.completedActivities}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-medium text-[var(--gris-dark)]">
                        {student.stats.quizzesPassed}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`font-medium ${
                          student.stats.avgScore >= 70
                            ? "text-[var(--success)]"
                            : student.stats.avgScore >= 50
                            ? "text-[var(--or)]"
                            : "text-[var(--danger)]"
                        }`}
                      >
                        {student.stats.avgScore}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-[var(--gris-light)]">
                      {student.stats.lastActivity
                        ? new Date(
                            student.stats.lastActivity
                          ).toLocaleDateString("fr-FR")
                        : "-"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/enseignant/eleves/${student.id}`}
                        className="text-sm text-[var(--vert)] hover:underline"
                      >
                        Voir détails
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-[var(--gris-light)] py-8">
            Aucun élève dans cette classe
          </p>
        )}
      </div>
    </>
  );
}
