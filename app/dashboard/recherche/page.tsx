import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "@/lib/auth-server";
import prisma from "@/lib/prisma";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

const wineColorLabels: Record<string, string> = {
  WHITE: "Blanc",
  RED: "Rouge",
  ROSE: "Rose",
  ORANGE: "Orange",
};

export default async function RecherchePage({ searchParams }: SearchPageProps) {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  if (!query) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1
          className="text-2xl font-bold mb-6"
          style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--bordeaux)" }}
        >
          Recherche
        </h1>
        <div className="bg-white rounded-2xl border border-[var(--beige-dark)] p-12 text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-[var(--gris-light)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p className="text-[var(--gris-tech)] text-lg">
            Entrez un terme de recherche
          </p>
          <p className="text-[var(--gris-light)] text-sm mt-2">
            Recherchez dans le glossaire, les activites ou les vins
          </p>
        </div>
      </div>
    );
  }

  // Search across all three tables in parallel
  const [glossaryResults, activityResults, wineResults] = await Promise.all([
    prisma.glossaryTerm.findMany({
      where: {
        OR: [
          { term: { contains: query, mode: "insensitive" } },
          { definition: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { term: "asc" },
      take: 20,
    }),
    prisma.activity.findMany({
      where: {
        isActive: true,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        block: {
          select: {
            id: true,
            number: true,
            title: true,
            color: true,
          },
        },
      },
      orderBy: { title: "asc" },
      take: 20,
    }),
    prisma.wine.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { region: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { name: "asc" },
      take: 20,
    }),
  ]);

  const totalResults =
    glossaryResults.length + activityResults.length + wineResults.length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1
        className="text-2xl font-bold mb-2"
        style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--bordeaux)" }}
      >
        Recherche
      </h1>
      <p className="text-[var(--gris-tech)] mb-6">
        {totalResults} resultat{totalResults !== 1 ? "s" : ""} pour &laquo;{" "}
        <span className="font-semibold text-[var(--gris-dark)]">{query}</span>{" "}
        &raquo;
      </p>

      {totalResults === 0 && (
        <div className="bg-white rounded-2xl border border-[var(--beige-dark)] p-12 text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-[var(--gris-light)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-[var(--gris-tech)] text-lg">
            Aucun resultat trouve
          </p>
          <p className="text-[var(--gris-light)] text-sm mt-2">
            Essayez avec d&apos;autres termes de recherche
          </p>
        </div>
      )}

      <div className="space-y-8">
        {/* Glossaire Results */}
        {glossaryResults.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[var(--bordeaux)] flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
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
              <h2
                className="text-lg font-bold"
                style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gris-dark)" }}
              >
                Glossaire
              </h2>
              <span className="text-sm text-[var(--gris-light)] bg-[var(--beige)] px-2 py-0.5 rounded-full">
                {glossaryResults.length}
              </span>
            </div>
            <div className="grid gap-3">
              {glossaryResults.map((term) => (
                <div
                  key={term.id}
                  className="bg-white rounded-xl border border-[var(--beige-dark)] p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-[var(--gris-dark)]">
                        {term.term}
                      </h3>
                      <p className="text-sm text-[var(--gris-tech)] mt-1 line-clamp-2">
                        {term.definition}
                      </p>
                    </div>
                    {term.category && (
                      <span className="text-xs text-[var(--bordeaux)] bg-[var(--beige)] px-2 py-1 rounded-full whitespace-nowrap">
                        {term.category}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Activites Results */}
        {activityResults.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[var(--vert)] flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h2
                className="text-lg font-bold"
                style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gris-dark)" }}
              >
                Activites
              </h2>
              <span className="text-sm text-[var(--gris-light)] bg-[var(--beige)] px-2 py-0.5 rounded-full">
                {activityResults.length}
              </span>
            </div>
            <div className="grid gap-3">
              {activityResults.map((activity) => (
                <Link
                  key={activity.id}
                  href={`/dashboard/blocs/${activity.block.number}/activites/${activity.id}`}
                  className="block bg-white rounded-xl border border-[var(--beige-dark)] p-4 hover:shadow-md hover:border-[var(--vert)] transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-[var(--gris-dark)] group-hover:text-[var(--vert)] transition-colors">
                        {activity.title}
                      </h3>
                      {activity.description && (
                        <p className="text-sm text-[var(--gris-tech)] mt-1 line-clamp-2">
                          {activity.description}
                        </p>
                      )}
                      <p className="text-xs text-[var(--gris-light)] mt-2">
                        Bloc {activity.block.number} — {activity.block.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: activity.block.color
                            ? `${activity.block.color}20`
                            : "var(--beige)",
                          color: activity.block.color ?? "var(--gris-tech)",
                        }}
                      >
                        {activity.type}
                      </span>
                      <svg
                        className="w-5 h-5 text-[var(--gris-light)] group-hover:text-[var(--vert)] transition-colors"
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
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Vins Results */}
        {wineResults.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[var(--or)] flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <h2
                className="text-lg font-bold"
                style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gris-dark)" }}
              >
                Vins
              </h2>
              <span className="text-sm text-[var(--gris-light)] bg-[var(--beige)] px-2 py-0.5 rounded-full">
                {wineResults.length}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {wineResults.map((wine) => (
                <div
                  key={wine.id}
                  className="bg-white rounded-xl border border-[var(--beige-dark)] p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold"
                      style={{
                        backgroundColor:
                          wine.color === "RED"
                            ? "var(--bordeaux)"
                            : wine.color === "ROSE"
                              ? "#E8A0BF"
                              : wine.color === "ORANGE"
                                ? "#D4874D"
                                : "#D4C97A",
                      }}
                    >
                      {wineColorLabels[wine.color]?.[0] ?? "?"}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-[var(--gris-dark)]">
                        {wine.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {wine.region && (
                          <span className="text-xs text-[var(--gris-tech)]">
                            {wine.region}
                          </span>
                        )}
                        <span className="text-xs text-[var(--bordeaux)] bg-[var(--beige)] px-2 py-0.5 rounded-full">
                          {wineColorLabels[wine.color] ?? wine.color}
                        </span>
                        {wine.vintage && (
                          <span className="text-xs text-[var(--gris-light)]">
                            {wine.vintage}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
