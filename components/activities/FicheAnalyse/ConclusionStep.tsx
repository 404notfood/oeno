"use client";

import { TastingConclusion, styleOptions } from "./types";

interface ConclusionStepProps {
  data: TastingConclusion;
  onChange: (data: TastingConclusion) => void;
  isBlindTasting: boolean;
}

const foodPairingOptions = [
  "Viandes rouges",
  "Viandes blanches",
  "Volailles",
  "Gibier",
  "Poissons",
  "Fruits de mer",
  "Fromages",
  "Charcuterie",
  "Plats epices",
  "Cuisine asiatique",
  "Desserts",
  "Aperitif",
];

export default function ConclusionStep({
  data,
  onChange,
  isBlindTasting,
}: ConclusionStepProps) {
  const handleChange = (field: keyof TastingConclusion, value: string | string[] | null) => {
    onChange({ ...data, [field]: value });
  };

  const toggleFoodPairing = (pairing: string) => {
    const newPairings = data.foodPairings.includes(pairing)
      ? data.foodPairings.filter((p) => p !== pairing)
      : [...data.foodPairings, pairing];
    handleChange("foodPairings", newPairings);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-bordeaux/10 flex items-center justify-center">
          <span className="text-2xl">📝</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-bordeaux font-cormorant">
            Conclusion
          </h3>
          <p className="text-sm text-gris-tech">
            Synthetisez vos impressions
          </p>
        </div>
      </div>

      {/* Style percu */}
      <div>
        <label className="block text-sm font-medium text-gris-dark mb-2">
          Style percu
        </label>
        <p className="text-xs text-gris-light mb-3">
          Comment decririez-vous globalement ce vin ?
        </p>
        <div className="flex flex-wrap gap-2">
          {styleOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleChange("perceivedStyle", option.value)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                data.perceivedStyle === option.value
                  ? "bg-bordeaux text-white"
                  : "bg-beige text-gris-dark hover:bg-beige-dark"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hypothese (pour degustation a l'aveugle) */}
      {isBlindTasting && (
        <div className="bg-or/10 rounded-xl p-6 border border-or/30">
          <label className="block text-sm font-medium text-gris-dark mb-2">
            Hypothese de degustation a l&apos;aveugle
          </label>
          <p className="text-xs text-gris-light mb-3">
            Tentez d&apos;identifier le cepage, la region ou le type de vin
          </p>
          <textarea
            value={data.hypothesis}
            onChange={(e) => handleChange("hypothesis", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-beige-dark focus:ring-2 focus:ring-or focus:border-transparent"
            rows={3}
            placeholder="Ex: Je pense a un Pinot Noir de Bourgogne en raison de sa finesse et de ses aromes de cerise..."
          />
        </div>
      )}

      {/* Accords mets-vins */}
      <div>
        <label className="block text-sm font-medium text-gris-dark mb-2">
          Accords mets-vins suggeres
        </label>
        <div className="flex flex-wrap gap-2">
          {foodPairingOptions.map((pairing) => (
            <button
              key={pairing}
              type="button"
              onClick={() => toggleFoodPairing(pairing)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                data.foodPairings.includes(pairing)
                  ? "bg-vert text-white"
                  : "bg-beige text-gris-dark hover:bg-beige-dark"
              }`}
            >
              {pairing}
            </button>
          ))}
        </div>
      </div>

      {/* Impression generale */}
      <div>
        <label className="block text-sm font-medium text-gris-dark mb-2">
          Impression generale
        </label>
        <textarea
          value={data.overallImpression}
          onChange={(e) => handleChange("overallImpression", e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-beige-dark focus:ring-2 focus:ring-bordeaux focus:border-transparent"
          rows={4}
          placeholder="Resumez votre appreciation du vin : ce que vous avez aime, ce qui vous a surpris..."
        />
      </div>
    </div>
  );
}
