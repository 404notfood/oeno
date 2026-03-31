import Link from "next/link";
import { getServerSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

async function getTeacherClasses(userId: string) {
  const classes = await prisma.classGroup.findMany({
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
        },
      },
      establishment: true,
    },
    orderBy: { name: "asc" },
  });

  return classes.map((classe) => {
    // Calculate average progress for this class
    const studentCount = classe.students.length;
    const totalCompletedActivities = classe.students.reduce(
      (sum, student) => sum + student.progress.length,
      0
    );
    const avgActivities =
      studentCount > 0
        ? Math.round(totalCompletedActivities / studentCount)
        : 0;

    return {
      ...classe,
      studentCount,
      avgActivities,
    };
  });
}

export default async function TeacherClassesPage() {
  const session = await getServerSession();
  const classes = await getTeacherClasses(session!.user.id);

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mes classes</h1>
          <p className="text-[var(--gris-tech)]">
            Gérez vos classes et suivez la progression de vos élèves.
          </p>
        </div>
      </div>

      {/* Classes Grid */}
      {classes.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classe) => (
            <Link
              key={classe.id}
              href={`/enseignant/classes/${classe.id}`}
              className="card hover:shadow-lg transition-all group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[var(--vert)] to-[var(--bordeaux)] rounded-xl flex items-center justify-center text-white text-xl font-bold">
                  {classe.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-[var(--gris-dark)] group-hover:text-[var(--vert)] transition-colors">
                    {classe.name}
                  </h3>
                  <p className="text-sm text-[var(--gris-light)]">
                    {classe.year}
                    {classe.establishment && ` • ${classe.establishment.name}`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-[var(--beige)] rounded-xl p-3">
                  <p className="text-2xl font-bold text-[var(--vert)] font-cormorant">
                    {classe.studentCount}
                  </p>
                  <p className="text-xs text-[var(--gris-light)]">Élèves</p>
                </div>
                <div className="bg-[var(--beige)] rounded-xl p-3">
                  <p className="text-2xl font-bold text-[var(--bordeaux)] font-cormorant">
                    {classe.avgActivities}
                  </p>
                  <p className="text-xs text-[var(--gris-light)]">Moy. activités</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-[var(--gris-tech)]">Voir les détails</span>
                <svg
                  className="w-5 h-5 text-[var(--gris-light)] group-hover:text-[var(--vert)] group-hover:translate-x-1 transition-all"
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
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <div className="w-16 h-16 bg-[var(--beige)] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-[var(--gris-light)]"
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
          <h3 className="text-xl font-semibold text-[var(--gris-dark)] mb-2">
            Aucune classe assignée
          </h3>
          <p className="text-[var(--gris-tech)] max-w-md mx-auto">
            Vous n&apos;êtes encore assigné à aucune classe. Contactez votre
            administrateur pour être ajouté à une ou plusieurs classes.
          </p>
        </div>
      )}
    </>
  );
}
