"use client";

import { useState, useTransition } from "react";
import { saveOlfactoryAnalysis } from "@/actions/tastings";

interface OlfactoryAnalysisFormProps {
  tastingId: string;
  initialData?: {
    intensity?: string | null;
    quality?: string | null;
    aromaFamilies?: string[];
    primaryAromas?: string[];
    secondaryAromas?: string[];
    tertiaryAromas?: string[];
    defects?: string[];
    notes?: string | null;
  } | null;
  onSaved?: () => void;
}

const intensityOptions = ["Faible", "Moyenne", "Aromatique", "Puissant"];
const qualityOptions = ["Simple", "Agréable", "Fin", "Complexe"];

const aromaFamilies = [
  "Fruité",
  "Floral",
  "Végétal",
  "Épicé",
  "Boisé",
  "Minéral",
  "Empyreumatique",
  "Animal",
];

const primaryAromaOptions = [
  "Fruits rouges",
  "Fruits noirs",
  "Agrumes",
  "Fruits blancs",
  "Fruits exotiques",
  "Fleurs blanches",
  "Rose",
  "Violette",
  "Herbe fraîche",
  "Bourgeon de cassis",
];

const secondaryAromaOptions = [
  "Beurre",
  "Brioche",
  "Levure",
  "Miel",
  "Amande",
  "Noisette",
  "Pain grillé",
];

const tertiaryAromaOptions = [
  "Vanille",
  "Cèdre",
  "Tabac",
  "Cuir",
  "Sous-bois",
  "Champignon",
  "Truffe",
  "Café",
  "Cacao",
  "Fruits confits",
];

const defectOptions = [
  "Bouchonné (TCA)",
  "Oxydé",
  "Réduit",
  "Volatile",
  "Brett",
  "Soufré",
];

export default function OlfactoryAnalysisForm({
  tastingId,
  initialData,
  onSaved,
}: OlfactoryAnalysisFormProps) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const [intensity, setIntensity] = useState(initialData?.intensity || "");
  const [quality, setQuality] = useState(initialData?.quality || "");
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>(
    initialData?.aromaFamilies || []
  );
  const [primaryAromas, setPrimaryAromas] = useState<string[]>(
    initialData?.primaryAromas || []
  );
  const [secondaryAromas, setSecondaryAromas] = useState<string[]>(
    initialData?.secondaryAromas || []
  );
  const [tertiaryAromas, setTertiaryAromas] = useState<string[]>(
    initialData?.tertiaryAromas || []
  );
  const [defects, setDefects] = useState<string[]>(initialData?.defects || []);
  const [notes, setNotes] = useState(initialData?.notes || "");

  const toggleItem = (
    item: string,
    list: string[],
    setList: (items: string[]) => void
  ) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);

    startTransition(async () => {
      try {
        await saveOlfactoryAnalysis(tastingId, {
          intensity: intensity || undefined,
          quality: quality || undefined,
          aromaFamilies: selectedFamilies.length > 0 ? selectedFamilies : undefined,
          primaryAromas: primaryAromas.length > 0 ? primaryAromas : undefined,
          secondaryAromas: secondaryAromas.length > 0 ? secondaryAromas : undefined,
          tertiaryAromas: tertiaryAromas.length > 0 ? tertiaryAromas : undefined,
          defects: defects.length > 0 ? defects : undefined,
          notes: notes || undefined,
        });
        setSaved(true);
        onSaved?.();
        setTimeout(() => setSaved(false), 3000);
      } catch (err) {
        console.error("Error saving olfactory analysis:", err);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Intensité */}
      <div>
        <label className="block text-sm font-medium text-[var(--gris-dark)] mb-3">
          Intensité aromatique
        </label>
        <div className="flex flex-wrap gap-2">
          {intensityOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setIntensity(option)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                intensity === option
                  ? "bg-[var(--bordeaux)] text-white"
                  : "bg-[var(--beige)] text-[var(--gris-dark)] hover:bg-[var(--beige-dark)]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Qualité */}
      <div>
        <label className="block text-sm font-medium text-[var(--gris-dark)] mb-3">
          Qualité du nez
        </label>
        <div className="flex flex-wrap gap-2">
          {qualityOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setQuality(option)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                quality === option
                  ? "bg-[var(--bordeaux)] text-white"
                  : "bg-[var(--beige)] text-[var(--gris-dark)] hover:bg-[var(--beige-dark)]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Familles aromatiques */}
      <div>
        <label className="block text-sm font-medium text-[var(--gris-dark)] mb-3">
          Familles aromatiques dominantes
        </label>
        <div className="flex flex-wrap gap-2">
          {aromaFamilies.map((family) => (
            <button
              key={family}
              type="button"
              onClick={() =>
                toggleItem(family, selectedFamilies, setSelectedFamilies)
              }
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                selectedFamilies.includes(family)
                  ? "bg-[var(--bordeaux)] text-white"
                  : "bg-[var(--beige)] text-[var(--gris-dark)] hover:bg-[var(--beige-dark)]"
              }`}
            >
              {family}
            </button>
          ))}
        </div>
      </div>

      {/* Arômes primaires */}
      <div>
        <label className="block text-sm font-medium text-[var(--gris-dark)] mb-2">
          Arômes primaires (cépage)
        </label>
        <p className="text-xs text-[var(--gris-light)] mb-3">
          Arômes issus du raisin et du cépage
        </p>
        <div className="flex flex-wrap gap-2">
          {primaryAromaOptions.map((aroma) => (
            <button
              key={aroma}
              type="button"
              onClick={() => toggleItem(aroma, primaryAromas, setPrimaryAromas)}
              className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                primaryAromas.includes(aroma)
                  ? "bg-[var(--vert)] text-white"
                  : "bg-[var(--beige)] text-[var(--gris-dark)] hover:bg-[var(--beige-dark)]"
              }`}
            >
              {aroma}
            </button>
          ))}
        </div>
      </div>

      {/* Arômes secondaires */}
      <div>
        <label className="block text-sm font-medium text-[var(--gris-dark)] mb-2">
          Arômes secondaires (fermentation)
        </label>
        <p className="text-xs text-[var(--gris-light)] mb-3">
          Arômes issus de la fermentation alcoolique et malolactique
        </p>
        <div className="flex flex-wrap gap-2">
          {secondaryAromaOptions.map((aroma) => (
            <button
              key={aroma}
              type="button"
              onClick={() =>
                toggleItem(aroma, secondaryAromas, setSecondaryAromas)
              }
              className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                secondaryAromas.includes(aroma)
                  ? "bg-[var(--or)] text-white"
                  : "bg-[var(--beige)] text-[var(--gris-dark)] hover:bg-[var(--beige-dark)]"
              }`}
            >
              {aroma}
            </button>
          ))}
        </div>
      </div>

      {/* Arômes tertiaires */}
      <div>
        <label className="block text-sm font-medium text-[var(--gris-dark)] mb-2">
          Arômes tertiaires (élevage/vieillissement)
        </label>
        <p className="text-xs text-[var(--gris-light)] mb-3">
          Arômes issus de l&apos;élevage en fût ou du vieillissement en bouteille
        </p>
        <div className="flex flex-wrap gap-2">
          {tertiaryAromaOptions.map((aroma) => (
            <button
              key={aroma}
              type="button"
              onClick={() =>
                toggleItem(aroma, tertiaryAromas, setTertiaryAromas)
              }
              className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                tertiaryAromas.includes(aroma)
                  ? "bg-[var(--bordeaux-light)] text-white"
                  : "bg-[var(--beige)] text-[var(--gris-dark)] hover:bg-[var(--beige-dark)]"
              }`}
            >
              {aroma}
            </button>
          ))}
        </div>
      </div>

      {/* Défauts */}
      <div>
        <label className="block text-sm font-medium text-[var(--gris-dark)] mb-3">
          Défauts éventuels
        </label>
        <div className="flex flex-wrap gap-2">
          {defectOptions.map((defect) => (
            <button
              key={defect}
              type="button"
              onClick={() => toggleItem(defect, defects, setDefects)}
              className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                defects.includes(defect)
                  ? "bg-red-500 text-white"
                  : "bg-[var(--beige)] text-[var(--gris-dark)] hover:bg-[var(--beige-dark)]"
              }`}
            >
              {defect}
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
          placeholder="Vos observations sur le nez du vin..."
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button type="submit" disabled={isPending} className="btn btn-primary">
          {isPending ? "Enregistrement..." : "Enregistrer"}
        </button>
        {saved && (
          <span className="text-sm text-[var(--success)]">
            ✓ Analyse olfactive enregistrée
          </span>
        )}
      </div>
    </form>
  );
}
