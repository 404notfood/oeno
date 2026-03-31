"use client";

import {
  VisualPerception,
  clarityOptions,
  visualIntensityOptions,
  redColorOptions,
  whiteColorOptions,
  viscosityOptions,
} from "./types";

interface VisualStepProps {
  data: VisualPerception;
  onChange: (data: VisualPerception) => void;
  wineColor: "RED" | "WHITE" | "ROSE" | "ORANGE";
}

export default function VisualStep({ data, onChange, wineColor }: VisualStepProps) {
  // Orange wines share visual characteristics with white wines
  const colorOptions = wineColor === "RED" ? redColorOptions : whiteColorOptions;

  const handleChange = (field: keyof VisualPerception, value: string | null) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-bordeaux/10 flex items-center justify-center">
          <span className="text-2xl">👁️</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-bordeaux font-cormorant">
            Analyse Visuelle
          </h3>
          <p className="text-sm text-gris-tech">
            Observez le vin a la lumiere naturelle
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Limpidite */}
        <div>
          <label className="block text-sm font-medium text-gris-dark mb-2">
            Limpidite
          </label>
          <div className="flex flex-wrap gap-2">
            {clarityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleChange("clarity", option.value)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  data.clarity === option.value
                    ? "bg-bordeaux text-white"
                    : "bg-beige text-gris-dark hover:bg-beige-dark"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Intensite */}
        <div>
          <label className="block text-sm font-medium text-gris-dark mb-2">
            Intensite colorante
          </label>
          <div className="flex flex-wrap gap-2">
            {visualIntensityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleChange("intensity", option.value)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  data.intensity === option.value
                    ? "bg-bordeaux text-white"
                    : "bg-beige text-gris-dark hover:bg-beige-dark"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Couleur */}
        <div>
          <label className="block text-sm font-medium text-gris-dark mb-2">
            Couleur principale
          </label>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleChange("color", option.value)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  data.color === option.value
                    ? "bg-bordeaux text-white"
                    : "bg-beige text-gris-dark hover:bg-beige-dark"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Viscosite */}
        <div>
          <label className="block text-sm font-medium text-gris-dark mb-2">
            Viscosite (jambes/larmes)
          </label>
          <div className="flex flex-wrap gap-2">
            {viscosityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleChange("viscosity", option.value)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  data.viscosity === option.value
                    ? "bg-bordeaux text-white"
                    : "bg-beige text-gris-dark hover:bg-beige-dark"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gris-dark mb-2">
          Notes personnelles (optionnel)
        </label>
        <textarea
          value={data.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-beige-dark focus:ring-2 focus:ring-bordeaux focus:border-transparent"
          rows={2}
          placeholder="Vos observations sur l'aspect visuel..."
        />
      </div>
    </div>
  );
}
