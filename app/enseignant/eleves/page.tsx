import Link from "next/link";
import { getServerSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

async function getTeacherStudents(userId: string) {
  // Get all students from teacher's classes
  const teacherClasses = await prisma.classGroup.findMany({
    where: {
      teachers: {
        some: { id: userId },
      },
    },
    include: {
      students: {
        include: {
          progress: {
            where: { status: "COMPLETED" },
          },
          quizAttempts: true,
        },
      },
      establishment: true,
    },
  });

  // Flatten students with their class info
  const studentsMap = new Map<
    string,
    {
      student: (typeof teacherClasses)[0]["students"][0];
      classes: { id: string; name: string }[];
    }
  >();

  teacherClasses.forEach((classe) => {
    classe.students.forEach((student) => {
      const existing = studentsMap.get(student.id);
      if (existing) {
        existing.classes.push({ id: classe.id, name: classe.name });
      } else {
        studentsMap.set(student.id, {
          student,
          classes: [{ id: classe.id, name: classe.name }],
        });
      }
    });
  });

  // Convert to array and calculate stats
  const students = Array.from(studentsMap.values()).map(
    ({ student, classes }) => {
      const completedActivities = student.progress.length;
      const avgScore =
        student.progress.length > 0
          ? Math.round(
              student.progress.reduce((sum, p) => sum + (p.score || 0), 0) /
                student.progress.length
            )
          : 0;
      const quizzesPassed = student.quizAttempts.filter((a) => a.passed).length;
      const totalQuizzes = student.quizAttempts.length;

      return {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        classes,
        stats: {
          completedActivities,
          avgScore,
          quizzesPassed,
          totalQuizzes,
        },
      };
    }
  );

  // Sort by last name
  students.sort((a, b) => a.lastName.localeCompare(b.lastName));

  return {
    students,
    totalClasses: teacherClasses.length,
  };
}

export default async function TeacherStudentsPage() {
  const session = await getServerSession();
  const { students, totalClasses } = await getTeacherStudents(session!.user.id);

  // Calculate global stats
  const totalStudents = students.length;
  const avgClassScore =
    students.length > 0
      ? Math.round(
          students.reduce((sum, s) => sum + s.stats.avgScore, 0) /
            students.length
        )
      : 0;

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Suivi des élèves</h1>
        <p className="text-[var(--gris-tech)]">
          Suivez la progression de tous vos élèves en un coup d&apos;œil.
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4 mb-8">
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
                {totalStudents}
              </p>
              <p className="text-xs text-[var(--gris-light)]">Élèves</p>
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--bordeaux)] font-cormorant">
                {totalClasses}
              </p>
              <p className="text-xs text-[var(--gris-light)]">Classes</p>
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
                {avgClassScore}%
              </p>
              <p className="text-xs text-[var(--gris-light)]">Score moyen</p>
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
                {students.reduce((sum, s) => sum + s.stats.completedActivities, 0)}
              </p>
              <p className="text-xs text-[var(--gris-light)]">Activités faites</p>
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Tous les élèves</h2>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gris-light)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="search"
              placeholder="Rechercher..."
              className="pl-9 pr-4 py-2 text-sm rounded-lg bg-[var(--beige)] border-none focus:outline-none focus:ring-2 focus:ring-[var(--vert)]"
            />
          </div>
        </div>

        {students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--beige-dark)]">
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--gris-light)]">
                    Élève
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--gris-light)]">
                    Classes
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-[var(--gris-light)]">
                    Activités
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-[var(--gris-light)]">
                    Quiz
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-[var(--gris-light)]">
                    Score moyen
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-[var(--gris-light)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
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
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {student.classes.map((classe) => (
                          <Link
                            key={classe.id}
                            href={`/enseignant/classes/${classe.id}`}
                            className="text-xs bg-[var(--vert)] bg-opacity-10 text-[var(--vert)] px-2 py-0.5 rounded hover:bg-opacity-20 transition-colors"
                          >
                            {classe.name}
                          </Link>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-medium text-[var(--gris-dark)]">
                        {student.stats.completedActivities}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-medium text-[var(--gris-dark)]">
                        {student.stats.quizzesPassed}/{student.stats.totalQuizzes}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`font-medium ${
                          student.stats.avgScore >= 70
                            ? "text-[var(--success)]"
                            : student.stats.avgScore >= 50
                            ? "text-[var(--or)]"
                            : student.stats.avgScore > 0
                            ? "text-[var(--danger)]"
                            : "text-[var(--gris-light)]"
                        }`}
                      >
                        {student.stats.avgScore > 0
                          ? `${student.stats.avgScore}%`
                          : "-"}
                      </span>
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
            Aucun élève dans vos classes
          </p>
        )}
      </div>
    </>
  );
}
