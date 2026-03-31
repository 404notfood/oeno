import Link from "next/link";
import { getSubmittedTastings } from "@/actions/tastings";

const statusLabels: Record<string, { label: string; color: string }> = {
  SUBMITTED: { label: "À évaluer", color: "var(--or)" },
  REVIEWED: { label: "Évaluée", color: "var(--success)" },
};

const wineColorLabels: Record<string, { label: string; color: string }> = {
  RED: { label: "Rouge", color: "#722F37" },
  WHITE: { label: "Blanc", color: "#F5E6A3" },
  ROSE: { label: "Rosé", color: "#F4C2C2" },
  ORANGE: { label: "Orange", color: "#E8A84C" },
};

export default async function EnseignantDegustationsPage() {
  const tastings = await getSubmittedTastings();

  const toReviewCount = tastings.filter((t) => t.status === "SUBMITTED").length;
  const reviewedCount = tastings.filter((t) => t.status === "REVIEWED").length;

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dégustations à évaluer</h1>
        <p className="text-[var(--gris-tech)]">
          Consultez et évaluez les dégustations soumises par vos élèves.
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--or)] bg-opacity-10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
            <div>
              <p className="text-sm text-[var(--gris-light)]">À évaluer</p>
              <p className="text-2xl font-bold text-[var(--or)] font-cormorant">
                {toReviewCount}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--success)] bg-opacity-10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <p className="text-sm text-[var(--gris-light)]">Évaluées</p>
              <p className="text-2xl font-bold text-[var(--success)] font-cormorant">
                {reviewedCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tastings List */}
      {tastings.length > 0 ? (
        <div className="space-y-4">
          {tastings.map((tasting) => {
            const status = statusLabels[tasting.status] || statusLabels.SUBMITTED;
            const wineColor = tasting.wine
              ? wineColorLabels[tasting.wine.color]
              : null;

            return (
              <Link
                key={tasting.id}
                href={`/enseignant/degustations/${tasting.id}`}
                className="card flex items-center gap-4 hover:shadow-md transition-all group"
              >
                {/* Wine color indicator */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: wineColor?.color || "#E8E0D0",
                  }}
                >
                  <span className="text-xl">🍷</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-[var(--gris-dark)] group-hover:text-[var(--bordeaux)] transition-colors truncate">
                      {tasting.title || tasting.wine?.name || "Dégustation"}
                    </h3>
                    {tasting.isBlindTasting && (
                      <span className="text-xs bg-[var(--bordeaux)] bg-opacity-10 text-[var(--bordeaux)] px-2 py-0.5 rounded">
                        Aveugle
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--gris-tech)]">
                    <span className="font-medium">
                      {tasting.user.firstName} {tasting.user.lastName}
                    </span>
                    {wineColor && (
                      <span className="flex items-center gap-1">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: wineColor.color }}
                        />
                        {wineColor.label}
                      </span>
                    )}
                    <span>
                      {new Date(tasting.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>

                {/* Status & Score */}
                <div className="flex items-center gap-3 shrink-0">
                  {tasting.teacherScore && (
                    <span className="text-lg font-bold text-[var(--bordeaux)]">
                      {tasting.teacherScore}/20
                    </span>
                  )}
                  <span
                    className="text-xs font-medium px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: `${status.color}20`,
                      color: status.color,
                    }}
                  >
                    {status.label}
                  </span>
                  <svg
                    className="w-5 h-5 text-[var(--gris-light)] group-hover:text-[var(--bordeaux)] group-hover:translate-x-1 transition-all"
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
            );
          })}
        </div>
      ) : (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-[var(--gris-dark)] mb-2">
            Aucune dégustation à évaluer
          </h3>
          <p className="text-[var(--gris-tech)]">
            Les dégustations soumises par vos élèves apparaîtront ici.
          </p>
        </div>
      )}
    </>
  );
}
