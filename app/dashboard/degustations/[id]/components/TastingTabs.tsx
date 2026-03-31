"use client";

import { useState } from "react";
import VisualAnalysisForm from "./VisualAnalysisForm";
import OlfactoryAnalysisForm from "./OlfactoryAnalysisForm";
import GustatoryAnalysisForm from "./GustatoryAnalysisForm";
import ConclusionForm from "./ConclusionForm";

type TabId = "visual" | "olfactory" | "gustatory" | "conclusion";

interface TastingTabsProps {
  tastingId: string;
  wineColor?: "RED" | "WHITE" | "ROSE" | "ORANGE";
  visualAnalysis?: {
    clarity?: string | null;
    intensity?: string | null;
    color?: string | null;
    colorNuance?: string | null;
    viscosity?: string | null;
    effervescence?: string | null;
    notes?: string | null;
  } | null;
  olfactoryAnalysis?: {
    intensity?: string | null;
    quality?: string | null;
    aromaFamilies?: string[];
    primaryAromas?: string[];
    secondaryAromas?: string[];
    tertiaryAromas?: string[];
    defects?: string[];
    notes?: string | null;
  } | null;
  gustatoryAnalysis?: {
    attackType?: string | null;
    sweetness?: string | null;
    acidity?: string | null;
    tannins?: string | null;
    alcohol?: string | null;
    body?: string | null;
    finish?: string | null;
    finishLength?: number | null;
    balance?: string | null;
    flavors?: string[];
    notes?: string | null;
  } | null;
  conclusion?: {
    conclusion?: string | null;
    overallScore?: number | null;
    foodPairings?: string[];
    agingPotential?: string | null;
  };
  status: string;
}

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: "visual", label: "Visuelle", icon: "👁️" },
  { id: "olfactory", label: "Olfactive", icon: "👃" },
  { id: "gustatory", label: "Gustative", icon: "👅" },
  { id: "conclusion", label: "Conclusion", icon: "📝" },
];

export default function TastingTabs({
  tastingId,
  wineColor = "RED",
  visualAnalysis,
  olfactoryAnalysis,
  gustatoryAnalysis,
  conclusion,
  status,
}: TastingTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("visual");
  const [completedTabs, setCompletedTabs] = useState<Set<TabId>>(() => {
    const completed = new Set<TabId>();
    if (visualAnalysis) completed.add("visual");
    if (olfactoryAnalysis) completed.add("olfactory");
    if (gustatoryAnalysis) completed.add("gustatory");
    if (conclusion?.conclusion || conclusion?.overallScore) completed.add("conclusion");
    return completed;
  });

  const markCompleted = (tab: TabId) => {
    setCompletedTabs((prev) => new Set([...prev, tab]));
  };

  const canSubmit =
    completedTabs.has("visual") &&
    completedTabs.has("olfactory") &&
    completedTabs.has("gustatory");

  const isReadOnly = status !== "DRAFT";

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-[var(--beige-dark)] pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-[var(--bordeaux)] text-white"
                : "bg-[var(--beige)] text-[var(--gris-dark)] hover:bg-[var(--beige-dark)]"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {completedTabs.has(tab.id) && (
              <span
                className={`w-2 h-2 rounded-full ${
                  activeTab === tab.id ? "bg-white" : "bg-[var(--success)]"
                }`}
              />
            )}
          </button>
        ))}
      </div>

      {/* Read-only notice */}
      {isReadOnly && (
        <div className="mb-6 p-4 bg-[var(--beige)] rounded-xl">
          <p className="text-sm text-[var(--gris-tech)]">
            {status === "SUBMITTED"
              ? "Cette dégustation a été soumise pour évaluation. Vous ne pouvez plus la modifier."
              : "Cette dégustation a été évaluée."}
          </p>
        </div>
      )}

      {/* Tab content */}
      <div className="card">
        {activeTab === "visual" && (
          <div>
            <h2 className="text-xl font-semibold text-[var(--gris-dark)] mb-4 flex items-center gap-2">
              <span>👁️</span> Analyse visuelle
            </h2>
            <p className="text-sm text-[var(--gris-tech)] mb-6">
              Observez le vin dans votre verre incliné sur fond blanc.
            </p>
            {isReadOnly ? (
              <VisualAnalysisSummary data={visualAnalysis} />
            ) : (
              <VisualAnalysisForm
                tastingId={tastingId}
                wineColor={wineColor}
                initialData={visualAnalysis}
                onSaved={() => markCompleted("visual")}
              />
            )}
          </div>
        )}

        {activeTab === "olfactory" && (
          <div>
            <h2 className="text-xl font-semibold text-[var(--gris-dark)] mb-4 flex items-center gap-2">
              <span>👃</span> Analyse olfactive
            </h2>
            <p className="text-sm text-[var(--gris-tech)] mb-6">
              Sentez le vin au repos, puis après agitation du verre.
            </p>
            {isReadOnly ? (
              <OlfactoryAnalysisSummary data={olfactoryAnalysis} />
            ) : (
              <OlfactoryAnalysisForm
                tastingId={tastingId}
                initialData={olfactoryAnalysis}
                onSaved={() => markCompleted("olfactory")}
              />
            )}
          </div>
        )}

        {activeTab === "gustatory" && (
          <div>
            <h2 className="text-xl font-semibold text-[var(--gris-dark)] mb-4 flex items-center gap-2">
              <span>👅</span> Analyse gustative
            </h2>
            <p className="text-sm text-[var(--gris-tech)] mb-6">
              Prenez une petite gorgée et faites circuler le vin en bouche.
            </p>
            {isReadOnly ? (
              <GustatoryAnalysisSummary data={gustatoryAnalysis} wineColor={wineColor} />
            ) : (
              <GustatoryAnalysisForm
                tastingId={tastingId}
                wineColor={wineColor}
                initialData={gustatoryAnalysis}
                onSaved={() => markCompleted("gustatory")}
              />
            )}
          </div>
        )}

        {activeTab === "conclusion" && (
          <div>
            <h2 className="text-xl font-semibold text-[var(--gris-dark)] mb-4 flex items-center gap-2">
              <span>📝</span> Conclusion
            </h2>
            <p className="text-sm text-[var(--gris-tech)] mb-6">
              Synthétisez vos impressions et évaluez le vin.
            </p>
            {isReadOnly ? (
              <ConclusionSummary data={conclusion} />
            ) : (
              <ConclusionForm
                tastingId={tastingId}
                initialData={conclusion}
                canSubmit={canSubmit}
                onSaved={() => markCompleted("conclusion")}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Summary components for read-only mode
function VisualAnalysisSummary({ data }: { data: TastingTabsProps["visualAnalysis"] }) {
  if (!data) return <p className="text-[var(--gris-light)] italic">Non renseignée</p>;
  return (
    <div className="space-y-2 text-sm">
      {data.clarity && <p><strong>Limpidité :</strong> {data.clarity}</p>}
      {data.intensity && <p><strong>Intensité :</strong> {data.intensity}</p>}
      {data.color && <p><strong>Couleur :</strong> {data.color}</p>}
      {data.colorNuance && <p><strong>Nuances :</strong> {data.colorNuance}</p>}
      {data.viscosity && <p><strong>Viscosité :</strong> {data.viscosity}</p>}
      {data.notes && <p><strong>Notes :</strong> {data.notes}</p>}
    </div>
  );
}

function OlfactoryAnalysisSummary({ data }: { data: TastingTabsProps["olfactoryAnalysis"] }) {
  if (!data) return <p className="text-[var(--gris-light)] italic">Non renseignée</p>;
  return (
    <div className="space-y-2 text-sm">
      {data.intensity && <p><strong>Intensité :</strong> {data.intensity}</p>}
      {data.quality && <p><strong>Qualité :</strong> {data.quality}</p>}
      {data.aromaFamilies && data.aromaFamilies.length > 0 && (
        <p><strong>Familles :</strong> {data.aromaFamilies.join(", ")}</p>
      )}
      {data.primaryAromas && data.primaryAromas.length > 0 && (
        <p><strong>Arômes primaires :</strong> {data.primaryAromas.join(", ")}</p>
      )}
      {data.secondaryAromas && data.secondaryAromas.length > 0 && (
        <p><strong>Arômes secondaires :</strong> {data.secondaryAromas.join(", ")}</p>
      )}
      {data.tertiaryAromas && data.tertiaryAromas.length > 0 && (
        <p><strong>Arômes tertiaires :</strong> {data.tertiaryAromas.join(", ")}</p>
      )}
      {data.defects && data.defects.length > 0 && (
        <p className="text-red-600"><strong>Défauts :</strong> {data.defects.join(", ")}</p>
      )}
      {data.notes && <p><strong>Notes :</strong> {data.notes}</p>}
    </div>
  );
}

function GustatoryAnalysisSummary({ data, wineColor }: { data: TastingTabsProps["gustatoryAnalysis"]; wineColor: string }) {
  if (!data) return <p className="text-[var(--gris-light)] italic">Non renseignée</p>;
  return (
    <div className="space-y-2 text-sm">
      {data.attackType && <p><strong>Attaque :</strong> {data.attackType}</p>}
      {data.sweetness && <p><strong>Sucrosité :</strong> {data.sweetness}</p>}
      {data.acidity && <p><strong>Acidité :</strong> {data.acidity}</p>}
      {wineColor === "RED" && data.tannins && <p><strong>Tanins :</strong> {data.tannins}</p>}
      {data.alcohol && <p><strong>Alcool :</strong> {data.alcohol}</p>}
      {data.body && <p><strong>Corps :</strong> {data.body}</p>}
      {data.finish && <p><strong>Finale :</strong> {data.finish}</p>}
      {data.finishLength && <p><strong>Caudalies :</strong> {data.finishLength}s</p>}
      {data.balance && <p><strong>Équilibre :</strong> {data.balance}</p>}
      {data.flavors && data.flavors.length > 0 && (
        <p><strong>Saveurs :</strong> {data.flavors.join(", ")}</p>
      )}
      {data.notes && <p><strong>Notes :</strong> {data.notes}</p>}
    </div>
  );
}

function ConclusionSummary({ data }: { data: TastingTabsProps["conclusion"] }) {
  if (!data) return <p className="text-[var(--gris-light)] italic">Non renseignée</p>;
  return (
    <div className="space-y-2 text-sm">
      {data.overallScore !== undefined && data.overallScore !== null && (
        <p><strong>Note :</strong> <span className="text-xl font-bold text-[var(--bordeaux)]">{data.overallScore}/20</span></p>
      )}
      {data.foodPairings && data.foodPairings.length > 0 && (
        <p><strong>Accords :</strong> {data.foodPairings.join(", ")}</p>
      )}
      {data.agingPotential && <p><strong>Garde :</strong> {data.agingPotential}</p>}
      {data.conclusion && <p><strong>Conclusion :</strong> {data.conclusion}</p>}
    </div>
  );
}
