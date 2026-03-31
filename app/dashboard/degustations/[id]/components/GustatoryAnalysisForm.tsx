"use client";

import { useState, useTransition } from "react";
import { saveGustatoryAnalysis } from "@/actions/tastings";

interface GustatoryAnalysisFormProps {
  tastingId: string;
  wineColor?: "RED" | "WHITE" | "ROSE" | "ORANGE";
  initialData?: {
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
  onSaved?: () => void;
}

const attackOptions = ["Franche", "Molle", "Agressive"];
const sweetnessOptions = ["Sec", "Demi-sec", "Moelleux", "Liquoreux"];
const acidityOptions = ["Plat", "Frais", "Vif", "Nerveux"];
const tanninOptions = ["Souple", "Fondus", "Fermes", "Âpres"];
const alcoholOptions = ["Léger", "Équilibré", "Chaleureux", "Brûlant"];
const bodyOptions = ["Léger", "Moyen", "Charpenté", "Puissant"];
const finishOptions = ["Courte", "Moyenne", "Longue", "Persistante"];
const balanceOptions = ["Déséquilibré", "Correct", "Équilibré", "Harmonieux"];

const flavorOptions = [
  "Fruits rouges",
  "Fruits noirs",
  "Agrumes",
  "Fruits blancs",
  "Épices douces",
  "Épices poivrées",
  "Boisé",
  "Vanille",
  "Minéralité",
  "Amertume",
  "Réglisse",
  "Chocolat",
];

export default function GustatoryAnalysisForm({
  tastingId,
  wineColor = "RED",
  initialData,
  onSaved,
}: GustatoryAnalysisFormProps) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const [attackType, setAttackType] = useState(initialData?.attackType || "");
  const [sweetness, setSweetness] = useState(initialData?.sweetness || "");
  const [acidity, setAcidity] = useState(initialData?.acidity || "");
  const [tannins, setTannins] = useState(initialData?.tannins || "");
  const [alcohol, setAlcohol] = useState(initialData?.alcohol || "");
  const [body, setBody] = useState(initialData?.body || "");
  const [finish, setFinish] = useState(initialData?.finish || "");
  const [finishLength, setFinishLength] = useState(
    initialData?.finishLength || 0
  );
  const [balance, setBalance] = useState(initialData?.balance || "");
  const [flavors, setFlavors] = useState<string[]>(initialData?.flavors || []);
  const [notes, setNotes] = useState(initialData?.notes || "");

  const showTannins = wineColor === "RED";

  const toggleFlavor = (flavor: string) => {
    if (flavors.includes(flavor)) {
      setFlavors(flavors.filter((f) => f !== flavor));
    } else {
      setFlavors([...flavors, flavor]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);

    startTransition(async () => {
      try {
        await saveGustatoryAnalysis(tastingId, {
          attackType: attackType || undefined,
          sweetness: sweetness || undefined,
          acidity: acidity || undefined,
          tannins: showTannins && tannins ? tannins : undefined,
          alcohol: alcohol || undefined,
          body: body || undefined,
          finish: finish || undefined,
          finishLength: finishLength > 0 ? finishLength : undefined,
          balance: balance || undefined,
          flavors: flavors.length > 0 ? flavors : undefined,
          notes: notes || undefined,
        });
        setSaved(true);
        onSaved?.();
        setTimeout(() => setSaved(false), 3000);
      } catch (err) {
        console.error("Error saving gustatory analysis:", err);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Attaque */}
      <div>
        <label className="block text-sm font-medium text-[var(--gris-dark)] mb-3">
          Attaque en bouche
        </label>
        <div className="flex flex-wrap gap-2">
          {attackOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setAttackType(option)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                attackType === option
                  ? "bg-[var(--bordeaux)] text-white"
                  : "bg-[var(--beige)] text-[var(--gris-dark)] hover:bg-[var(--beige-dark)]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Sucrosité */}
      <div>
        <label className="block text-sm font-medium text-[var(--gris-dark)] mb-3">
          Sucrosité
        </label>
        <div className="flex flex-wrap gap-2">
          {sweetnessOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSweetness(option)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                sweetness === option
                  ? "bg-[var(--bordeaux)] text-white"
                  : "bg-[var(--beige)] text-[var(--gris-dark)] hover:bg-[var(--beige-dark)]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Acidité */}
      <div>
        <label className="block text-sm font-medium text-[var(--gris-dark)] mb-3">
          Acidité
        </label>
        <div className="flex flex-wrap gap-2">
          {acidityOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setAcidity(option)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                acidity === option
                  ? "bg-[var(--bordeaux)] text-white"
                  : "bg-[var(--beige)] text-[var(--gris-dark)] hover:bg-[var(--beige-dark)]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Tanins (vins rouges uniquement) */}
      {showTannins && (
        <div>
          <label className="block text-sm font-medium text-[var(--gris-dark)] mb-3">
            Tanins
          </label>
          <div className="flex flex-wrap gap-2">
            {tanninOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTannins(option)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  tannins === option
                    ? "bg-[var(--bordeaux)] text-white"
                    : "bg-[var(--beige)] text-[var(--gris-dark)] hover:bg-[var(--beige-dark)]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Alcool */}
      <div>
        <label className="block text-sm font-medium text-[var(--gris-dark)] mb-3">
          Alcool perçu
        </label>
        <div className="flex flex-wrap gap-2">
          {alcoholOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setAlcohol(option)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                alcohol === option
                  ? "bg-[var(--bordeaux)] text-white"
                  : "bg-[var(--beige)] text-[var(--gris-dark)] hover:bg-[var(--beige-dark)]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Corps */}
      <div>
        <label className="block text-sm font-medium text-[var(--gris-dark)] mb-3">
          Corps / Matière
        </label>
        <div className="flex flex-wrap gap-2">
          {bodyOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setBody(option)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                body === option
                  ? "bg-[var(--bordeaux)] text-white"
                  : "bg-[var(--beige)] text-[var(--gris-dark)] hover:bg-[var(--beige-dark)]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Finale */}
      <div>
        <label className="block text-sm font-medium text-[var(--gris-dark)] mb-3">
          Longueur en bouche (finale)
        </label>
        <div className="flex flex-wrap gap-2">
          {finishOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFinish(option)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                finish === option
                  ? "bg-[var(--bordeaux)] text-white"
                  : "bg-[var(--beige)] text-[var(--gris-dark)] hover:bg-[var(--beige-dark)]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Caudalies */}
        <div className="mt-4">
          <label className="block text-xs text-[var(--gris-light)] mb-2">
            Durée en caudalies (secondes)
          </label>
          <input
            type="number"
            value={finishLength || ""}
            onChange={(e) => setFinishLength(parseInt(e.target.value) || 0)}
            min={0}
            max={30}
            className="w-24 px-3 py-2 border border-[var(--beige-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--bordeaux)] text-center"
            placeholder="0"
          />
        </div>
      </div>

      {/* Équilibre */}
      <div>
        <label className="block text-sm font-medium text-[var(--gris-dark)] mb-3">
          Équilibre général
        </label>
        <div className="flex flex-wrap gap-2">
          {balanceOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setBalance(option)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                balance === option
                  ? "bg-[var(--bordeaux)] text-white"
                  : "bg-[var(--beige)] text-[var(--gris-dark)] hover:bg-[var(--beige-dark)]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Saveurs */}
      <div>
        <label className="block text-sm font-medium text-[var(--gris-dark)] mb-3">
          Saveurs retrouvées en bouche
        </label>
        <div className="flex flex-wrap gap-2">
          {flavorOptions.map((flavor) => (
            <button
              key={flavor}
              type="button"
              onClick={() => toggleFlavor(flavor)}
              className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                flavors.includes(flavor)
                  ? "bg-[var(--vert)] text-white"
                  : "bg-[var(--beige)] text-[var(--gris-dark)] hover:bg-[var(--beige-dark)]"
              }`}
            >
              {flavor}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-[var(--gris-dark)] mb-2">
          Notes / Observations
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-3 border border-[var(--beige-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--bordeaux)] resize-none"
          rows={3}
          placeholder="Vos observations sur la dégustation en bouche..."
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button type="submit" disabled={isPending} className="btn btn-primary">
          {isPending ? "Enregistrement..." : "Enregistrer"}
        </button>
        {saved && (
          <span className="text-sm text-[var(--success)]">
            ✓ Analyse gustative enregistrée
          </span>
        )}
      </div>
    </form>
  );
}
