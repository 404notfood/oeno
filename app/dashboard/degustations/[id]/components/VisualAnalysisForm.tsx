"use client";

import { useState, useTransition } from "react";
import { saveVisualAnalysis } from "@/actions/tastings";

interface VisualAnalysisFormProps {
  tastingId: string;
  wineColor?: "RED" | "WHITE" | "ROSE" | "ORANGE";
  initialData?: {
    clarity?: string | null;
    intensity?: string | null;
    color?: string | null;
    colorNuance?: string | null;
    viscosity?: string | null;
    effervescence?: string | null;
    notes?: string | null;
  } | null;
  onSaved?: () => void;
}

const clarityOptions = ["Limpide", "Voilé", "Trouble"];
const intensityOptions = ["Pâle", "Moyenne", "Soutenue", "Intense"];
const viscosityOptions = ["Fluide", "Gras", "Sirupeux"];

const colorOptionsRed = ["Pourpre", "Rubis", "Grenat", "Tuilé", "Acajou"];
const colorOptionsWhite = ["Vert pâle", "Jaune paille", "Doré", "Ambré"];
const colorOptionsRose = ["Rose pâle", "Saumon", "Framboise", "Orangé"];

const nuanceOptionsRed = ["Violacés", "Orangés", "Bruns"];
const nuanceOptionsWhite = ["Verts", "Dorés", "Cuivrés"];
const nuanceOptionsRose = ["Orangés", "Violacés"];

export default function VisualAnalysisForm({
  tastingId,
  wineColor = "RED",
  initialData,
  onSaved,
}: VisualAnalysisFormProps) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const [clarity, setClarity] = useState(initialData?.clarity || "");
  const [intensity, setIntensity] = useState(initialData?.intensity || "");
  const [color, setColor] = useState(initialData?.color || "");
  const [colorNuance, setColorNuance] = useState(initialData?.colorNuance || "");
  const [viscosity, setViscosity] = useState(initialData?.viscosity || "");
  const [notes, setNotes] = useState(initialData?.notes || "");

  const colorOptions =
    wineColor === "RED"
      ? colorOptionsRed
      : wineColor === "WHITE"
        ? colorOptionsWhite
        : colorOptionsRose;

  const nuanceOptions =
    wineColor === "RED"
      ? nuanceOptionsRed
      : wineColor === "WHITE"
        ? nuanceOptionsWhite
        : nuanceOptionsRose;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);

    startTransition(async () => {
      try {
        await saveVisualAnalysis(tastingId, {
          clarity: clarity || undefined,
          intensity: intensity || undefined,
          color: color || undefined,
          colorNuance: colorNuance || undefined,
          viscosity: viscosity || undefined,
          notes: notes || undefined,
        });
        setSaved(true);
        onSaved?.();
        setTimeout(() => setSaved(false), 3000);
      } catch (err) {
        console.error("Error saving visual analysis:", err);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Limpidité */}
      <div>
        <label className="block text-sm font-medium text-[var(--gris-dark)] mb-3">
          Limpidité
        </label>
        <div className="flex flex-wrap gap-2">
          {clarityOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setClarity(option)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                clarity === option
                  ? "bg-[var(--bordeaux)] text-white"
                  : "bg-[var(--beige)] text-[var(--gris-dark)] hover:bg-[var(--beige-dark)]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Intensité colorante */}
      <div>
        <label className="block text-sm font-medium text-[var(--gris-dark)] mb-3">
          Intensité colorante
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

      {/* Couleur */}
      <div>
        <label className="block text-sm font-medium text-[var(--gris-dark)] mb-3">
          Couleur
        </label>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setColor(option)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                color === option
                  ? "bg-[var(--bordeaux)] text-white"
                  : "bg-[var(--beige)] text-[var(--gris-dark)] hover:bg-[var(--beige-dark)]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Nuances */}
      <div>
        <label className="block text-sm font-medium text-[var(--gris-dark)] mb-3">
          Reflets / Nuances
        </label>
        <div className="flex flex-wrap gap-2">
          {nuanceOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setColorNuance(option)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                colorNuance === option
                  ? "bg-[var(--bordeaux)] text-white"
                  : "bg-[var(--beige)] text-[var(--gris-dark)] hover:bg-[var(--beige-dark)]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Viscosité */}
      <div>
        <label className="block text-sm font-medium text-[var(--gris-dark)] mb-3">
          Viscosité (larmes/jambes)
        </label>
        <div className="flex flex-wrap gap-2">
          {viscosityOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setViscosity(option)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                viscosity === option
                  ? "bg-[var(--bordeaux)] text-white"
                  : "bg-[var(--beige)] text-[var(--gris-dark)] hover:bg-[var(--beige-dark)]"
              }`}
            >
              {option}
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
          placeholder="Vos observations sur l'aspect visuel du vin..."
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="btn btn-primary"
        >
          {isPending ? "Enregistrement..." : "Enregistrer"}
        </button>
        {saved && (
          <span className="text-sm text-[var(--success)]">
            ✓ Analyse visuelle enregistrée
          </span>
        )}
      </div>
    </form>
  );
}
