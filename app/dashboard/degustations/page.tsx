import Link from "next/link";
import { getServerSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

async function getUserTastings(userId: string) {
  const tastings = await prisma.tasting.findMany({
    where: { userId },
    include: {
      wine: {
        include: {
          appellation: true,
        },
      },
    },
    orderBy: { date: "desc" },
  });

  return tastings;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Brouillon", color: "var(--gris-light)" },
  SUBMITTED: { label: "Soumise", color: "var(--or)" },
  REVIEWED: { label: "Évaluée", color: "var(--success)" },
};

const wineColorLabels: Record<string, { label: string; color: string }> = {
  RED: { label: "Rouge", color: "#722F37" },
  WHITE: { label: "Blanc", color: "#F5E6A3" },
  ROSE: { label: "Rosé", color: "#F4C2C2" },
};

export default async function DegustationsPage() {
  const session = await getServerSession();
  const tastings = await getUserTastings(session!.user.id);

  const completedCount = tastings.filter((t) => t.status === "REVIEWED").length;
  const inProgressCount = tastings.filter(
    (t) => t.status === "SUBMITTED"
  ).length;

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mes dégustations</h1>
          <p className="text-[var(--gris-tech)]">
            Gérez vos fiches de dégustation et suivez votre progression.
          </p>
        </div>
        <Link href="/dashboard/degustations/nouvelle" className="btn btn-primary">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Nouvelle dégustation
        </Link>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--bordeaux)] bg-opacity-10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🍷</span>
            </div>
            <div>
              <p className="text-sm text-[var(--gris-light)]">Total</p>
              <p className="text-2xl font-bold text-[var(--bordeaux)] font-cormorant">
                {tastings.length}
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
                {completedCount}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--or)] bg-opacity-10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
            <div>
              <p className="text-sm text-[var(--gris-light)]">Soumises</p>
              <p className="text-2xl font-bold text-[var(--or)] font-cormorant">
                {inProgressCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tastings List */}
      {tastings.length > 0 ? (
        <div className="space-y-4">
          {tastings.map((tasting) => {
            const status = statusLabels[tasting.status] || statusLabels.DRAFT;
            const wineColor = tasting.wine
              ? wineColorLabels[tasting.wine.color]
              : null;

            return (
              <Link
                key={tasting.id}
                href={`/dashboard/degustations/${tasting.id}`}
                className="card flex items-center gap-4 hover:shadow-md transition-all group"
              >
                {/* Wine color indicator */}
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: wineColor?.color || "#E8E0D0",
                  }}
                >
                  <span className="text-2xl">🍷</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-[var(--gris-dark)] group-hover:text-[var(--bordeaux)] transition-colors truncate">
                      {tasting.title ||
                        tasting.wine?.name ||
                        "Dégustation sans titre"}
                    </h3>
                    {tasting.isBlindTasting && (
                      <span className="text-xs bg-[var(--bordeaux)] bg-opacity-10 text-[var(--bordeaux)] px-2 py-0.5 rounded">
                        À l&apos;aveugle
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--gris-tech)]">
                    {tasting.wine && (
                      <>
                        <span className="flex items-center gap-1">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: wineColor?.color }}
                          />
                          {wineColor?.label}
                        </span>
                        {tasting.wine.vintage && (
                          <span>{tasting.wine.vintage}</span>
                        )}
                        {tasting.wine.appellation && (
                          <span>{tasting.wine.appellation.name}</span>
                        )}
                      </>
                    )}
                    <span>
                      {new Date(tasting.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-3 shrink-0">
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
          <div className="text-6xl mb-4">🍷</div>
          <h3 className="text-xl font-semibold text-[var(--gris-dark)] mb-2">
            Aucune dégustation
          </h3>
          <p className="text-[var(--gris-tech)] mb-6">
            Commencez votre carnet de dégustation en créant votre première fiche.
          </p>
          <Link href="/dashboard/degustations/nouvelle" className="btn btn-primary">
            Créer ma première dégustation
          </Link>
        </div>
      )}

      {/* Tips */}
      {tastings.length > 0 && tastings.length < 5 && (
        <div className="card mt-8 bg-[var(--beige)]">
          <div className="flex items-start gap-4">
            <div className="text-3xl">💡</div>
            <div>
              <h3 className="font-semibold text-[var(--gris-dark)] mb-1">
                Conseil
              </h3>
              <p className="text-sm text-[var(--gris-tech)]">
                Pour progresser en dégustation, essayez de varier les types de
                vins et de comparer vos notes entre différentes dégustations.
                L&apos;exercice de la dégustation à l&apos;aveugle est
                particulièrement formateur !
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
