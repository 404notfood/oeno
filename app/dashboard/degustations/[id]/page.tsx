import { notFound } from "next/navigation";
import Link from "next/link";
import { getTastingById } from "@/actions/tastings";
import TastingTabs from "./components/TastingTabs";

interface TastingPageProps {
  params: Promise<{ id: string }>;
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
  ORANGE: { label: "Orange", color: "#E8A84C" },
};

export default async function TastingPage({ params }: TastingPageProps) {
  const { id } = await params;
  const tasting = await getTastingById(id);

  if (!tasting) {
    notFound();
  }

  const status = statusLabels[tasting.status] || statusLabels.DRAFT;
  const wineColor = tasting.wine ? wineColorLabels[tasting.wine.color] : null;

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/dashboard/degustations"
              className="text-[var(--gris-tech)] hover:text-[var(--bordeaux)] transition-colors"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold">
              {tasting.title || tasting.wine?.name || "Dégustation"}
            </h1>
            {tasting.isBlindTasting && (
              <span className="text-xs bg-[var(--bordeaux)] bg-opacity-10 text-[var(--bordeaux)] px-2 py-1 rounded-full">
                À l&apos;aveugle
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--gris-tech)]">
            {new Date(tasting.date).toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="text-sm font-medium px-4 py-2 rounded-full"
            style={{
              backgroundColor: `${status.color}20`,
              color: status.color,
            }}
          >
            {status.label}
          </span>
        </div>
      </div>

      {/* Wine Info */}
      {tasting.wine && !tasting.isBlindTasting && (
        <div className="card mb-6">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: wineColor?.color || "#E8E0D0",
              }}
            >
              <span className="text-xl">🍷</span>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--gris-dark)]">
                {tasting.wine.name}
              </h3>
              <div className="flex flex-wrap gap-2 mt-1 text-sm text-[var(--gris-tech)]">
                {wineColor && <span>{wineColor.label}</span>}
                {tasting.wine.vintage && <span>• {tasting.wine.vintage}</span>}
                {tasting.wine.appellation && (
                  <span>• {tasting.wine.appellation.name}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Feedback */}
      {tasting.status === "REVIEWED" && tasting.teacherComment && (
        <div className="card bg-[var(--beige)] mb-6">
          <h2 className="text-lg font-semibold text-[var(--gris-dark)] mb-3">
            Retour de l&apos;enseignant
          </h2>
          <p className="text-[var(--gris-tech)]">{tasting.teacherComment}</p>
          {tasting.teacherScore && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-[var(--gris-tech)]">Note :</span>
              <span className="text-xl font-bold text-[var(--bordeaux)]">
                {tasting.teacherScore}/20
              </span>
            </div>
          )}
        </div>
      )}

      {/* Analysis Tabs */}
      <TastingTabs
        tastingId={tasting.id}
        wineColor={(tasting.wine?.color as "RED" | "WHITE" | "ROSE" | "ORANGE") || "RED"}
        visualAnalysis={tasting.visualAnalysis}
        olfactoryAnalysis={tasting.olfactoryAnalysis}
        gustatoryAnalysis={tasting.gustatoryAnalysis}
        conclusion={{
          conclusion: tasting.conclusion,
          overallScore: tasting.overallScore,
          foodPairings: tasting.foodPairings,
          agingPotential: tasting.agingPotential,
        }}
        status={tasting.status}
      />
    </>
  );
}
