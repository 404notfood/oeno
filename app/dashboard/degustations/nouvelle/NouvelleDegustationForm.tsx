"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { createTastingAndRedirect } from "@/actions/tastings";

interface Wine {
  id: string;
  name: string;
  type: string;
  color: string;
  vintage: number | null;
  region: string | null;
  appellation: { name: string } | null;
}

interface NouvelleDegustationFormProps {
  wines: Wine[];
}

const wineColorLabels: Record<string, { label: string; color: string }> = {
  RED: { label: "Rouge", color: "#722F37" },
  WHITE: { label: "Blanc", color: "#F5E6A3" },
  ROSE: { label: "Rosé", color: "#F4C2C2" },
  ORANGE: { label: "Orange", color: "#E8A84C" },
};

export default function NouvelleDegustationForm({
  wines,
}: NouvelleDegustationFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [wineId, setWineId] = useState("");
  const [isBlindTasting, setIsBlindTasting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        await createTastingAndRedirect({
          title: title || undefined,
          wineId: wineId || undefined,
          isBlindTasting,
        });
      } catch (err) {
        console.error("Error creating tasting:", err);
        setError("Erreur lors de la création de la dégustation");
      }
    });
  };

  const selectedWine = wines.find((w) => w.id === wineId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      {/* Titre */}
      <div className="card">
        <label className="block text-sm font-medium text-[var(--gris-dark)] mb-2">
          Titre de la dégustation (optionnel)
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 border border-[var(--beige-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--bordeaux)]"
          placeholder="Ex: Dégustation comparative Bordeaux 2020"
        />
        <p className="mt-2 text-sm text-[var(--gris-light)]">
          Si vide, le nom du vin sera utilisé
        </p>
      </div>

      {/* Type de dégustation */}
      <div className="card">
        <label className="block text-sm font-medium text-[var(--gris-dark)] mb-4">
          Type de dégustation
        </label>
        <div className="grid sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setIsBlindTasting(false)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              !isBlindTasting
                ? "border-[var(--bordeaux)] bg-[var(--bordeaux)] bg-opacity-5"
                : "border-[var(--beige-dark)] hover:border-[var(--bordeaux-light)]"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🍷</span>
              <span className="font-semibold text-[var(--gris-dark)]">
                Dégustation classique
              </span>
            </div>
            <p className="text-sm text-[var(--gris-tech)]">
              Vous connaissez le vin que vous dégustez
            </p>
          </button>

          <button
            type="button"
            onClick={() => setIsBlindTasting(true)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              isBlindTasting
                ? "border-[var(--bordeaux)] bg-[var(--bordeaux)] bg-opacity-5"
                : "border-[var(--beige-dark)] hover:border-[var(--bordeaux-light)]"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🎭</span>
              <span className="font-semibold text-[var(--gris-dark)]">
                Dégustation à l&apos;aveugle
              </span>
            </div>
            <p className="text-sm text-[var(--gris-tech)]">
              Identifiez le vin par vos analyses sensorielles
            </p>
          </button>
        </div>
      </div>

      {/* Sélection du vin */}
      {!isBlindTasting && (
        <div className="card">
          <label className="block text-sm font-medium text-[var(--gris-dark)] mb-2">
            Vin à déguster
          </label>
          <select
            value={wineId}
            onChange={(e) => setWineId(e.target.value)}
            className="w-full px-4 py-3 border border-[var(--beige-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--bordeaux)]"
          >
            <option value="">Sélectionnez un vin (optionnel)</option>
            {wines.map((wine) => {
              const colorInfo = wineColorLabels[wine.color];
              return (
                <option key={wine.id} value={wine.id}>
                  {wine.name}
                  {wine.vintage ? ` (${wine.vintage})` : ""} -{" "}
                  {colorInfo?.label || wine.color}
                  {wine.appellation ? ` - ${wine.appellation.name}` : ""}
                </option>
              );
            })}
          </select>

          {/* Aperçu du vin sélectionné */}
          {selectedWine && (
            <div className="mt-4 p-4 bg-[var(--beige)] rounded-lg">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor:
                      wineColorLabels[selectedWine.color]?.color || "#E8E0D0",
                  }}
                >
                  <span>🍷</span>
                </div>
                <div>
                  <p className="font-medium text-[var(--gris-dark)]">
                    {selectedWine.name}
                  </p>
                  <p className="text-sm text-[var(--gris-tech)]">
                    {wineColorLabels[selectedWine.color]?.label}
                    {selectedWine.vintage && ` • ${selectedWine.vintage}`}
                    {selectedWine.region && ` • ${selectedWine.region}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {wines.length === 0 && (
            <p className="mt-2 text-sm text-[var(--or)]">
              Aucun vin disponible. Vous pourrez ajouter le vin plus tard.
            </p>
          )}
        </div>
      )}

      {/* Info dégustation à l'aveugle */}
      {isBlindTasting && (
        <div className="card bg-[var(--beige)]">
          <div className="flex items-start gap-4">
            <div className="text-3xl">💡</div>
            <div>
              <h3 className="font-semibold text-[var(--gris-dark)] mb-1">
                Dégustation à l&apos;aveugle
              </h3>
              <p className="text-sm text-[var(--gris-tech)]">
                Le vin sera révélé une fois votre analyse terminée. Utilisez vos
                sens pour identifier les caractéristiques du vin : couleur,
                arômes, structure...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="btn btn-primary"
        >
          {isPending ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Création...
            </>
          ) : (
            <>
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
              Créer la dégustation
            </>
          )}
        </button>
        <Link href="/dashboard/degustations" className="btn btn-secondary">
          Annuler
        </Link>
      </div>
    </form>
  );
}
