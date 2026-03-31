"use client";

import { useState, useTransition } from "react";
import { saveTastingConclusion, submitTasting } from "@/actions/tastings";
import { useRouter } from "next/navigation";

interface ConclusionFormProps {
  tastingId: string;
  initialData?: {
    conclusion?: string | null;
    overallScore?: number | null;
    foodPairings?: string[];
    agingPotential?: string | null;
  };
  canSubmit?: boolean;
  onSaved?: () => void;
}

const foodPairingOptions = [
  "Viandes rouges",
  "Viandes blanches",
  "Gibier",
  "Volaille",
  "Poissons",
  "Fruits de mer",
  "Fromages",
  "Charcuterie",
  "Pâtes",
  "Risotto",
  "Légumes grillés",
  "Desserts",
  "Apéritif",
];

const agingOptions = [
  "À boire maintenant",
  "1-3 ans",
  "3-5 ans",
  "5-10 ans",
  "10+ ans",
];

export default function ConclusionForm({
  tastingId,
  initialData,
  canSubmit = false,
  onSaved,
}: ConclusionFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const [conclusion, setConclusion] = useState(initialData?.conclusion || "");
  const [overallScore, setOverallScore] = useState(
    initialData?.overallScore || 0
  );
  const [foodPairings, setFoodPairings] = useState<string[]>(
    initialData?.foodPairings || []
  );
  const [agingPotential, setAgingPotential] = useState(
    initialData?.agingPotential || ""
  );

  const togglePairing = (pairing: string) => {
    if (foodPairings.includes(pairing)) {
      setFoodPairings(foodPairings.filter((p) => p !== pairing));
    } else {
      setFoodPairings([...foodPairings, pairing]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);

    startTransition(async () => {
      try {
        await saveTastingConclusion(tastingId, {
          conclusion: conclusion || undefined,
          overallScore: overallScore > 0 ? overallScore : undefined,
          foodPairings: foodPairings.length > 0 ? foodPairings : undefined,
          agingPotential: agingPotential || undefined,
        });
        setSaved(true);
        onSaved?.();
        setTimeout(() => setSaved(false), 3000);
      } catch (err) {
        console.error("Error saving conclusion:", err);
      }
    });
  };

  const handleSubmit = async () => {
    startTransition(async () => {
      try {
        // Sauvegarder d'abord
        await saveTastingConclusion(tastingId, {
          conclusion: conclusion || undefined,
          overallScore: overallScore > 0 ? overallScore : undefined,
          foodPairings: foodPairings.length > 0 ? foodPairings : undefined,
          agingPotential: agingPotential || undefined,
        });
        // Puis soumettre
        await submitTasting(tastingId);
        router.refresh();
      } catch (err) {
        console.error("Error submitting tasting:", err);
      }
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Note globale */}
      <div>
        <label className="block text-sm font-medium text-[var(--gris-dark)] mb-3">
          Note globale
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={20}
            value={overallScore}
            onChange={(e) => setOverallScore(parseInt(e.target.value))}
            className="flex-1 h-2 bg-[var(--beige-dark)] rounded-lg appearance-none cursor-pointer accent-[var(--bordeaux)]"
          />
          <div className="w-16 text-center">
            <span className="text-2xl font-bold text-[var(--bordeaux)]">
              {overallScore}
            </span>
            <span className="text-sm text-[var(--gris-light)]">/20</span>
          </div>
        </div>
      </div>

      {/* Accords mets-vins */}
      <div>
        <label className="block text-sm font-medium text-[var(--gris-dark)] mb-3">
          Accords mets-vins suggérés
        </label>
        <div className="flex flex-wrap gap-2">
          {foodPairingOptions.map((pairing) => (
            <button
              key={pairing}
              type="button"
              onClick={() => togglePairing(pairing)}
              className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                foodPairings.includes(pairing)
                  ? "bg-[var(--vert)] text-white"
                  : "bg-[var(--beige)] text-[var(--gris-dark)] hover:bg-[var(--beige-dark)]"
              }`}
            >
              {pairing}
            </button>
          ))}
        </div>
      </div>

      {/* Potentiel de garde */}
      <div>
        <label className="block text-sm font-medium text-[var(--gris-dark)] mb-3">
          Potentiel de garde
        </label>
        <div className="flex flex-wrap gap-2">
          {agingOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setAgingPotential(option)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                agingPotential === option
                  ? "bg-[var(--bordeaux)] text-white"
                  : "bg-[var(--beige)] text-[var(--gris-dark)] hover:bg-[var(--beige-dark)]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Conclusion */}
      <div>
        <label className="block text-sm font-medium text-[var(--gris-dark)] mb-2">
          Conclusion générale
        </label>
        <textarea
          value={conclusion}
          onChange={(e) => setConclusion(e.target.value)}
          className="w-full px-4 py-3 border border-[var(--beige-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--bordeaux)] resize-none"
          rows={4}
          placeholder="Votre appréciation générale du vin : qualité, typicité, rapport qualité-prix..."
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 flex-wrap">
        <button type="submit" disabled={isPending} className="btn btn-secondary">
          {isPending ? "Enregistrement..." : "Enregistrer le brouillon"}
        </button>

        {canSubmit && (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="btn btn-primary"
          >
            {isPending ? "Soumission..." : "Soumettre pour évaluation"}
          </button>
        )}

        {saved && (
          <span className="text-sm text-[var(--success)]">
            ✓ Conclusion enregistrée
          </span>
        )}
      </div>
    </form>
  );
}
