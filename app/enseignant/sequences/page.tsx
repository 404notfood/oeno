import Link from "next/link";
import { getTeacherSequences } from "@/actions/sequences";

export default async function TeacherSequencesPage() {
  const sequences = await getTeacherSequences();

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mes sequences</h1>
          <p className="text-[var(--gris-tech)]">
            Creez et gerez vos sequences pedagogiques personnalisees.
          </p>
        </div>
        <Link
          href="/enseignant/sequences/nouvelle"
          className="btn inline-flex items-center gap-2 px-6 py-3 bg-[var(--vert)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity shrink-0"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Creer une sequence
        </Link>
      </div>

      {sequences.length === 0 ? (
        /* Empty State */
        <div className="card text-center py-16">
          <div className="w-20 h-20 bg-[var(--vert)] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-[var(--vert)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[var(--gris-dark)] mb-3">
            Aucune sequence
          </h2>
          <p className="text-[var(--gris-tech)] max-w-md mx-auto mb-6">
            Vous n&apos;avez pas encore cree de sequence pedagogique. Commencez
            par creer votre premiere sequence en selectionnant les activites de
            votre choix.
          </p>
          <Link
            href="/enseignant/sequences/nouvelle"
            className="btn inline-flex items-center gap-2 px-6 py-3 bg-[var(--vert)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Creer ma premiere sequence
          </Link>
        </div>
      ) : (
        /* Sequences List */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sequences.map((sequence) => (
            <div key={sequence.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[var(--gris-dark)] truncate">
                    {sequence.title}
                  </h3>
                  {sequence.description && (
                    <p className="text-sm text-[var(--gris-tech)] line-clamp-2 mt-1">
                      {sequence.description}
                    </p>
                  )}
                </div>
                <span
                  className={`shrink-0 ml-3 px-2.5 py-1 text-xs font-medium rounded-full ${
                    sequence.isPublished
                      ? "bg-[var(--vert)] bg-opacity-10 text-[var(--vert)]"
                      : "bg-[var(--or)] bg-opacity-10 text-[var(--or)]"
                  }`}
                >
                  {sequence.isPublished ? "Publiee" : "Brouillon"}
                </span>
              </div>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--gris-light)] mb-4">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-3.5 h-3.5"
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
                  {sequence._count.activities} activite
                  {sequence._count.activities > 1 ? "s" : ""}
                </span>
                {sequence.duration && (
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {sequence.duration} min
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {new Date(sequence.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Objectives preview */}
              {sequence.objectives && (
                <p className="text-xs text-[var(--gris-tech)] line-clamp-2 mb-4 italic">
                  {sequence.objectives}
                </p>
              )}

              {/* Footer link - placeholder for future detail page */}
              <div className="pt-3 border-t border-[var(--beige-dark)]">
                <span className="text-sm text-[var(--vert)] font-medium">
                  Voir le detail
                  <svg
                    className="w-4 h-4 inline-block ml-1"
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
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Card */}
      <div className="card mt-8 bg-[var(--beige)]">
        <div className="flex items-start gap-4">
          <div className="text-3xl">💡</div>
          <div>
            <h3 className="font-semibold text-[var(--gris-dark)] mb-1">
              Astuce
            </h3>
            <p className="text-sm text-[var(--gris-tech)]">
              Consultez la page{" "}
              <Link
                href="/enseignant/ressources"
                className="text-[var(--vert)] hover:underline"
              >
                Ressources
              </Link>{" "}
              pour decouvrir toutes les activites disponibles par bloc de
              competences avant de creer votre sequence.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
