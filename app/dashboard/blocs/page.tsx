import Link from "next/link";
import { getServerSession } from "@/lib/auth-server";
import { getUserBlocsProgress } from "@/actions/progress";
import { prisma } from "@/lib/prisma";

async function getBlocsWithDetails() {
  const blocs = await prisma.competencyBlock.findMany({
    orderBy: { number: "asc" },
    include: {
      activities: {
        where: { isActive: true },
        orderBy: { order: "asc" },
      },
      quizzes: {
        where: { isActive: true },
      },
    },
  });

  return blocs;
}

export default async function BlocsPage() {
  const session = await getServerSession();
  const [userProgress, blocsDetails] = await Promise.all([
    getUserBlocsProgress(session!.user.id),
    getBlocsWithDetails(),
  ]);

  // Merge user progress with bloc details
  const blocs = blocsDetails.map((bloc) => {
    const progress = userProgress.find((p) => p.num === bloc.number);
    return {
      ...bloc,
      progress: progress?.progress || 0,
      status: progress?.status || "available",
      userIcon: progress?.icon || "📚",
    };
  });

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Les 8 blocs de compétences</h1>
        <p className="text-[var(--gris-tech)]">
          Parcourez les 8 blocs pour maîtriser l&apos;œnologie étape par étape.
        </p>
      </div>

      {/* Blocs Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {blocs.map((bloc) => (
          <Link
            key={bloc.id}
            href={`/dashboard/blocs/${bloc.number}`}
            className={`card group hover:shadow-lg transition-all ${
              bloc.status === "locked" ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--bordeaux)] to-[var(--or)] flex items-center justify-center text-3xl shrink-0">
                {bloc.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-[var(--bordeaux)] bg-[var(--bordeaux)] bg-opacity-10 px-2 py-1 rounded-full">
                    Bloc {bloc.number}
                  </span>
                  {bloc.status === "completed" && (
                    <span className="text-xs font-medium text-[var(--success)] bg-[var(--success)] bg-opacity-10 px-2 py-1 rounded-full">
                      Terminé
                    </span>
                  )}
                  {bloc.status === "in_progress" && (
                    <span className="text-xs font-medium text-[var(--info)] bg-[var(--info)] bg-opacity-10 px-2 py-1 rounded-full">
                      En cours
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-semibold text-[var(--gris-dark)] mb-2 group-hover:text-[var(--bordeaux)] transition-colors">
                  {bloc.title}
                </h2>

                <p className="text-sm text-[var(--gris-tech)] mb-4 line-clamp-2">
                  {bloc.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-[var(--gris-light)]">
                  <span className="flex items-center gap-1">
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    {bloc.activities.length} activités
                  </span>
                  <span className="flex items-center gap-1">
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {bloc.quizzes.length} quiz
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[var(--gris-light)]">Progression</span>
                    <span className="font-medium text-[var(--bordeaux)]">
                      {bloc.progress}%
                    </span>
                  </div>
                  <div className="h-2 bg-[var(--beige)] rounded-full overflow-hidden">
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
              </div>

              {/* Arrow */}
              <svg
                className="w-5 h-5 text-[var(--gris-light)] group-hover:text-[var(--bordeaux)] group-hover:translate-x-1 transition-all shrink-0"
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

      {/* Legend */}
      <div className="mt-8 card">
        <h3 className="font-semibold mb-4">Légende</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gradient-to-r from-[var(--bordeaux)] to-[var(--or)]" />
            <span className="text-[var(--gris-tech)]">En cours</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[var(--success)]" />
            <span className="text-[var(--gris-tech)]">Terminé</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[var(--beige-dark)]" />
            <span className="text-[var(--gris-tech)]">Non commencé</span>
          </div>
        </div>
      </div>
    </>
  );
}
