import { notFound } from "next/navigation";
import Link from "next/link";
import { getTastingForReview } from "@/actions/tastings";
import ReviewForm from "./ReviewForm";

interface ReviewPageProps {
  params: Promise<{ id: string }>;
}

const wineColorLabels: Record<string, { label: string; color: string }> = {
  RED: { label: "Rouge", color: "#722F37" },
  WHITE: { label: "Blanc", color: "#F5E6A3" },
  ROSE: { label: "Rosé", color: "#F4C2C2" },
  ORANGE: { label: "Orange", color: "#E8A84C" },
};

export default async function ReviewTastingPage({ params }: ReviewPageProps) {
  const { id } = await params;
  const tasting = await getTastingForReview(id);

  if (!tasting) {
    notFound();
  }

  const wineColor = tasting.wine ? wineColorLabels[tasting.wine.color] : null;
  const isReviewed = tasting.status === "REVIEWED";

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/enseignant/degustations"
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
              Évaluation de dégustation
            </h1>
          </div>
          <p className="text-[var(--gris-tech)]">
            {tasting.user.firstName} {tasting.user.lastName} •{" "}
            {new Date(tasting.date).toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        {isReviewed && (
          <div className="flex items-center gap-2">
            <span className="text-sm bg-[var(--success)] bg-opacity-10 text-[var(--success)] px-4 py-2 rounded-full font-medium">
              ✓ Évaluée
            </span>
            <span className="text-2xl font-bold text-[var(--bordeaux)]">
              {tasting.teacherScore}/20
            </span>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Student's work */}
        <div className="space-y-6">
          {/* Wine Info */}
          {tasting.wine && (
            <div className="card">
              <h2 className="text-lg font-semibold text-[var(--gris-dark)] mb-4">
                Vin dégusté
              </h2>
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
                    {tasting.wine.vintage && (
                      <span>• {tasting.wine.vintage}</span>
                    )}
                    {tasting.wine.appellation && (
                      <span>• {tasting.wine.appellation.name}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Visual Analysis */}
          <div className="card">
            <h2 className="text-lg font-semibold text-[var(--gris-dark)] mb-4 flex items-center gap-2">
              <span>👁️</span> Analyse visuelle
            </h2>
            {tasting.visualAnalysis ? (
              <div className="space-y-2 text-sm">
                {tasting.visualAnalysis.clarity && (
                  <p>
                    <strong>Limpidité :</strong> {tasting.visualAnalysis.clarity}
                  </p>
                )}
                {tasting.visualAnalysis.intensity && (
                  <p>
                    <strong>Intensité :</strong>{" "}
                    {tasting.visualAnalysis.intensity}
                  </p>
                )}
                {tasting.visualAnalysis.color && (
                  <p>
                    <strong>Couleur :</strong> {tasting.visualAnalysis.color}
                  </p>
                )}
                {tasting.visualAnalysis.colorNuance && (
                  <p>
                    <strong>Nuances :</strong>{" "}
                    {tasting.visualAnalysis.colorNuance}
                  </p>
                )}
                {tasting.visualAnalysis.viscosity && (
                  <p>
                    <strong>Viscosité :</strong>{" "}
                    {tasting.visualAnalysis.viscosity}
                  </p>
                )}
                {tasting.visualAnalysis.notes && (
                  <p className="mt-2 text-[var(--gris-tech)] italic">
                    &quot;{tasting.visualAnalysis.notes}&quot;
                  </p>
                )}
              </div>
            ) : (
              <p className="text-[var(--gris-light)] italic">Non renseignée</p>
            )}
          </div>

          {/* Olfactory Analysis */}
          <div className="card">
            <h2 className="text-lg font-semibold text-[var(--gris-dark)] mb-4 flex items-center gap-2">
              <span>👃</span> Analyse olfactive
            </h2>
            {tasting.olfactoryAnalysis ? (
              <div className="space-y-2 text-sm">
                {tasting.olfactoryAnalysis.intensity && (
                  <p>
                    <strong>Intensité :</strong>{" "}
                    {tasting.olfactoryAnalysis.intensity}
                  </p>
                )}
                {tasting.olfactoryAnalysis.quality && (
                  <p>
                    <strong>Qualité :</strong>{" "}
                    {tasting.olfactoryAnalysis.quality}
                  </p>
                )}
                {tasting.olfactoryAnalysis.aromaFamilies &&
                  tasting.olfactoryAnalysis.aromaFamilies.length > 0 && (
                    <p>
                      <strong>Familles :</strong>{" "}
                      {tasting.olfactoryAnalysis.aromaFamilies.join(", ")}
                    </p>
                  )}
                {tasting.olfactoryAnalysis.primaryAromas &&
                  tasting.olfactoryAnalysis.primaryAromas.length > 0 && (
                    <p>
                      <strong>Arômes primaires :</strong>{" "}
                      {tasting.olfactoryAnalysis.primaryAromas.join(", ")}
                    </p>
                  )}
                {tasting.olfactoryAnalysis.secondaryAromas &&
                  tasting.olfactoryAnalysis.secondaryAromas.length > 0 && (
                    <p>
                      <strong>Arômes secondaires :</strong>{" "}
                      {tasting.olfactoryAnalysis.secondaryAromas.join(", ")}
                    </p>
                  )}
                {tasting.olfactoryAnalysis.tertiaryAromas &&
                  tasting.olfactoryAnalysis.tertiaryAromas.length > 0 && (
                    <p>
                      <strong>Arômes tertiaires :</strong>{" "}
                      {tasting.olfactoryAnalysis.tertiaryAromas.join(", ")}
                    </p>
                  )}
                {tasting.olfactoryAnalysis.defects &&
                  tasting.olfactoryAnalysis.defects.length > 0 && (
                    <p className="text-red-600">
                      <strong>Défauts :</strong>{" "}
                      {tasting.olfactoryAnalysis.defects.join(", ")}
                    </p>
                  )}
                {tasting.olfactoryAnalysis.notes && (
                  <p className="mt-2 text-[var(--gris-tech)] italic">
                    &quot;{tasting.olfactoryAnalysis.notes}&quot;
                  </p>
                )}
              </div>
            ) : (
              <p className="text-[var(--gris-light)] italic">Non renseignée</p>
            )}
          </div>

          {/* Gustatory Analysis */}
          <div className="card">
            <h2 className="text-lg font-semibold text-[var(--gris-dark)] mb-4 flex items-center gap-2">
              <span>👅</span> Analyse gustative
            </h2>
            {tasting.gustatoryAnalysis ? (
              <div className="space-y-2 text-sm">
                {tasting.gustatoryAnalysis.attackType && (
                  <p>
                    <strong>Attaque :</strong>{" "}
                    {tasting.gustatoryAnalysis.attackType}
                  </p>
                )}
                {tasting.gustatoryAnalysis.sweetness && (
                  <p>
                    <strong>Sucrosité :</strong>{" "}
                    {tasting.gustatoryAnalysis.sweetness}
                  </p>
                )}
                {tasting.gustatoryAnalysis.acidity && (
                  <p>
                    <strong>Acidité :</strong>{" "}
                    {tasting.gustatoryAnalysis.acidity}
                  </p>
                )}
                {tasting.gustatoryAnalysis.tannins && (
                  <p>
                    <strong>Tanins :</strong>{" "}
                    {tasting.gustatoryAnalysis.tannins}
                  </p>
                )}
                {tasting.gustatoryAnalysis.alcohol && (
                  <p>
                    <strong>Alcool :</strong>{" "}
                    {tasting.gustatoryAnalysis.alcohol}
                  </p>
                )}
                {tasting.gustatoryAnalysis.body && (
                  <p>
                    <strong>Corps :</strong> {tasting.gustatoryAnalysis.body}
                  </p>
                )}
                {tasting.gustatoryAnalysis.finish && (
                  <p>
                    <strong>Finale :</strong> {tasting.gustatoryAnalysis.finish}
                  </p>
                )}
                {tasting.gustatoryAnalysis.finishLength && (
                  <p>
                    <strong>Caudalies :</strong>{" "}
                    {tasting.gustatoryAnalysis.finishLength}s
                  </p>
                )}
                {tasting.gustatoryAnalysis.balance && (
                  <p>
                    <strong>Équilibre :</strong>{" "}
                    {tasting.gustatoryAnalysis.balance}
                  </p>
                )}
                {tasting.gustatoryAnalysis.flavors &&
                  tasting.gustatoryAnalysis.flavors.length > 0 && (
                    <p>
                      <strong>Saveurs :</strong>{" "}
                      {tasting.gustatoryAnalysis.flavors.join(", ")}
                    </p>
                  )}
                {tasting.gustatoryAnalysis.notes && (
                  <p className="mt-2 text-[var(--gris-tech)] italic">
                    &quot;{tasting.gustatoryAnalysis.notes}&quot;
                  </p>
                )}
              </div>
            ) : (
              <p className="text-[var(--gris-light)] italic">Non renseignée</p>
            )}
          </div>

          {/* Student Conclusion */}
          <div className="card">
            <h2 className="text-lg font-semibold text-[var(--gris-dark)] mb-4 flex items-center gap-2">
              <span>📝</span> Conclusion de l&apos;élève
            </h2>
            <div className="space-y-2 text-sm">
              {tasting.overallScore && (
                <p>
                  <strong>Note auto-évaluation :</strong>{" "}
                  <span className="text-lg font-bold text-[var(--bordeaux)]">
                    {tasting.overallScore}/20
                  </span>
                </p>
              )}
              {tasting.foodPairings && tasting.foodPairings.length > 0 && (
                <p>
                  <strong>Accords suggérés :</strong>{" "}
                  {tasting.foodPairings.join(", ")}
                </p>
              )}
              {tasting.agingPotential && (
                <p>
                  <strong>Potentiel de garde :</strong> {tasting.agingPotential}
                </p>
              )}
              {tasting.conclusion && (
                <p className="mt-2 text-[var(--gris-tech)] italic">
                  &quot;{tasting.conclusion}&quot;
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Review Form */}
        <div>
          <div className="card sticky top-6">
            <h2 className="text-lg font-semibold text-[var(--gris-dark)] mb-4">
              {isReviewed ? "Évaluation enregistrée" : "Évaluer cette dégustation"}
            </h2>
            <ReviewForm
              tastingId={tasting.id}
              isReviewed={isReviewed}
              initialScore={tasting.teacherScore || undefined}
              initialComment={tasting.teacherComment || undefined}
            />
          </div>

          {/* Reference: Wine Sensory Profile */}
          {tasting.wine?.sensoryProfile && (
            <div className="card mt-6 bg-[var(--beige)]">
              <h2 className="text-lg font-semibold text-[var(--gris-dark)] mb-4">
                📚 Profil de référence
              </h2>
              <p className="text-xs text-[var(--gris-light)] mb-3">
                Caractéristiques attendues pour ce type de vin
              </p>
              <div className="space-y-2 text-sm">
                {tasting.wine.sensoryProfile.acidity && (
                  <p>
                    <strong>Acidité :</strong>{" "}
                    {tasting.wine.sensoryProfile.acidity}
                  </p>
                )}
                {tasting.wine.sensoryProfile.body && (
                  <p>
                    <strong>Corps :</strong> {tasting.wine.sensoryProfile.body}
                  </p>
                )}
                {tasting.wine.sensoryProfile.tannins && (
                  <p>
                    <strong>Tanins :</strong>{" "}
                    {tasting.wine.sensoryProfile.tannins}
                  </p>
                )}
                {tasting.wine.sensoryProfile.dominantAromas &&
                  tasting.wine.sensoryProfile.dominantAromas.length > 0 && (
                    <p>
                      <strong>Arômes typiques :</strong>{" "}
                      {tasting.wine.sensoryProfile.dominantAromas.join(", ")}
                    </p>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
