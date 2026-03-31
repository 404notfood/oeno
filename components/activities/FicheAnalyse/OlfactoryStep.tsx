"use client";

import {
  OlfactoryPerception,
  olfactoryIntensityOptions,
  olfactoryQualityOptions,
  aromaFamilyOptions,
} from "./types";

interface OlfactoryStepProps {
  data: OlfactoryPerception;
  onChange: (data: OlfactoryPerception) => void;
}

// Aromes specifiques par famille
const aromasByFamily: Record<string, string[]> = {
  fruites: [
    "pomme", "poire", "peche", "abricot", "citron", "orange", "pamplemousse",
    "cerise", "framboise", "fraise", "cassis", "mure", "prune", "figue",
    "fruits exotiques", "banane", "ananas", "litchi", "fruit de la passion"
  ],
  floraux: [
    "fleurs blanches", "rose", "violette", "jasmin", "acacia", "tilleul",
    "fleur d'oranger", "geranium", "pivoine", "chevre-feuille"
  ],
  vegetaux: [
    "herbe coupee", "foin", "fougere", "menthe", "eucalyptus", "poivron vert",
    "asperge", "artichaut", "olive", "laurier", "thym"
  ],
  epices: [
    "poivre", "cannelle", "clou de girofle", "muscade", "reglisse", "vanille",
    "anis", "gingembre", "safran", "cardamome"
  ],
  boise: [
    "chene", "cedre", "santal", "bois frais", "bois brule", "fumee",
    "tabac", "cafe", "cacao", "toast"
  ],
  grille: [
    "cafe", "cacao", "caramel", "toast", "pain grille", "fumee",
    "goudron", "tabac blond"
  ],
  animal: [
    "cuir", "musc", "gibier", "viande", "fourrure", "ecurie"
  ],
  mineral: [
    "pierre a fusil", "silex", "craie", "ardoise", "iode", "petrole",
    "terre", "sous-bois", "champignon", "truffe"
  ],
};

export default function OlfactoryStep({ data, onChange }: OlfactoryStepProps) {
  const handleChange = (field: keyof OlfactoryPerception, value: string | string[] | null) => {
    onChange({ ...data, [field]: value });
  };

  const toggleAromaFamily = (family: string) => {
    const newFamilies = data.aromaFamilies.includes(family)
      ? data.aromaFamilies.filter((f) => f !== family)
      : [...data.aromaFamilies, family];
    handleChange("aromaFamilies", newFamilies);
  };

  const toggleSpecificAroma = (aroma: string) => {
    const newAromas = data.specificAromas.includes(aroma)
      ? data.specificAromas.filter((a) => a !== aroma)
      : [...data.specificAromas, aroma];
    handleChange("specificAromas", newAromas);
  };

  // Aromes disponibles en fonction des familles selectionnees
  const availableAromas = data.aromaFamilies.flatMap(
    (family) => aromasByFamily[family] || []
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-or/10 flex items-center justify-center">
          <span className="text-2xl">👃</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-bordeaux font-cormorant">
            Analyse Olfactive
          </h3>
          <p className="text-sm text-gris-tech">
            Sentez le vin en 2 temps: premier nez puis apres agitation
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Intensite */}
        <div>
          <label className="block text-sm font-medium text-gris-dark mb-2">
            Intensite aromatique
          </label>
          <div className="flex flex-wrap gap-2">
            {olfactoryIntensityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleChange("intensity", option.value)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  data.intensity === option.value
                    ? "bg-or text-white"
                    : "bg-beige text-gris-dark hover:bg-beige-dark"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Qualite */}
        <div>
          <label className="block text-sm font-medium text-gris-dark mb-2">
            Qualite du nez
          </label>
          <div className="flex flex-wrap gap-2">
            {olfactoryQualityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleChange("quality", option.value)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  data.quality === option.value
                    ? "bg-or text-white"
                    : "bg-beige text-gris-dark hover:bg-beige-dark"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Familles aromatiques */}
      <div>
        <label className="block text-sm font-medium text-gris-dark mb-2">
          Familles aromatiques detectees
        </label>
        <p className="text-xs text-gris-light mb-3">
          Selectionnez les familles presentes puis precisez les aromes
        </p>
        <div className="flex flex-wrap gap-2">
          {aromaFamilyOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleAromaFamily(option.value)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                data.aromaFamilies.includes(option.value)
                  ? "bg-or text-white"
                  : "bg-beige text-gris-dark hover:bg-beige-dark"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Aromes specifiques */}
      {data.aromaFamilies.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gris-dark mb-2">
            Aromes specifiques
          </label>
          <p className="text-xs text-gris-light mb-3">
            Selectionnez les aromes que vous identifiez
          </p>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 bg-beige-light rounded-lg">
            {availableAromas.map((aroma) => (
              <button
                key={aroma}
                type="button"
                onClick={() => toggleSpecificAroma(aroma)}
                className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                  data.specificAromas.includes(aroma)
                    ? "bg-bordeaux text-white"
                    : "bg-white text-gris-dark hover:bg-beige-dark border border-beige-dark"
                }`}
              >
                {aroma}
              </button>
            ))}
          </div>
          {data.specificAromas.length > 0 && (
            <p className="mt-2 text-sm text-gris-tech">
              Selection: {data.specificAromas.join(", ")}
            </p>
          )}
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gris-dark mb-2">
          Notes personnelles (optionnel)
        </label>
        <textarea
          value={data.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-beige-dark focus:ring-2 focus:ring-or focus:border-transparent"
          rows={2}
          placeholder="Vos observations sur les aromes..."
        />
      </div>
    </div>
  );
}
