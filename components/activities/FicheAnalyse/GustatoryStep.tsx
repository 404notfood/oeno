"use client";

import {
  GustatoryPerception,
  attackTypeOptions,
  acidityOptions,
  alcoholOptions,
  bodyOptions,
  tanninOptions,
  finishOptions,
  balanceOptions,
} from "./types";

interface GustatoryStepProps {
  data: GustatoryPerception;
  onChange: (data: GustatoryPerception) => void;
  isRedWine: boolean;
}

export default function GustatoryStep({ data, onChange, isRedWine }: GustatoryStepProps) {
  const handleChange = (field: keyof GustatoryPerception, value: string | number | null) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-vert/10 flex items-center justify-center">
          <span className="text-2xl">👅</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-bordeaux font-cormorant">
            Analyse Gustative
          </h3>
          <p className="text-sm text-gris-tech">
            Goutez le vin en prenant une petite gorgee
          </p>
        </div>
      </div>

      {/* Attaque */}
      <div>
        <label className="block text-sm font-medium text-gris-dark mb-2">
          Attaque (premiere impression)
        </label>
        <div className="flex flex-wrap gap-2">
          {attackTypeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleChange("attackType", option.value)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                data.attackType === option.value
                  ? "bg-vert text-white"
                  : "bg-beige text-gris-dark hover:bg-beige-dark"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Acidite */}
        <div>
          <label className="block text-sm font-medium text-gris-dark mb-2">
            Acidite
          </label>
          <div className="flex flex-wrap gap-2">
            {acidityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleChange("acidity", option.value)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  data.acidity === option.value
                    ? "bg-vert text-white"
                    : "bg-beige text-gris-dark hover:bg-beige-dark"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Alcool */}
        <div>
          <label className="block text-sm font-medium text-gris-dark mb-2">
            Alcool percu
          </label>
          <div className="flex flex-wrap gap-2">
            {alcoholOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleChange("alcohol", option.value)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  data.alcohol === option.value
                    ? "bg-vert text-white"
                    : "bg-beige text-gris-dark hover:bg-beige-dark"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Corps/Matiere */}
        <div>
          <label className="block text-sm font-medium text-gris-dark mb-2">
            Corps / Matiere
          </label>
          <div className="flex flex-wrap gap-2">
            {bodyOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleChange("body", option.value)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  data.body === option.value
                    ? "bg-vert text-white"
                    : "bg-beige text-gris-dark hover:bg-beige-dark"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tanins (uniquement pour les rouges) */}
        {isRedWine && (
          <div>
            <label className="block text-sm font-medium text-gris-dark mb-2">
              Tanins
            </label>
            <div className="flex flex-wrap gap-2">
              {tanninOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleChange("tannins", option.value)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    data.tannins === option.value
                      ? "bg-vert text-white"
                      : "bg-beige text-gris-dark hover:bg-beige-dark"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Finale */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gris-dark mb-2">
            Finale (longueur en bouche)
          </label>
          <div className="flex flex-wrap gap-2">
            {finishOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleChange("finish", option.value)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  data.finish === option.value
                    ? "bg-vert text-white"
                    : "bg-beige text-gris-dark hover:bg-beige-dark"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Caudalies */}
        <div>
          <label className="block text-sm font-medium text-gris-dark mb-2">
            Caudalies (secondes de persistance)
          </label>
          <input
            type="number"
            min={0}
            max={30}
            value={data.finishLength || ""}
            onChange={(e) =>
              handleChange(
                "finishLength",
                e.target.value ? parseInt(e.target.value) : null
              )
            }
            className="w-full px-4 py-2 rounded-lg border border-beige-dark focus:ring-2 focus:ring-vert focus:border-transparent"
            placeholder="Ex: 8"
          />
          <p className="text-xs text-gris-light mt-1">
            1 caudalie = 1 seconde de persistance aromatique
          </p>
        </div>
      </div>

      {/* Equilibre */}
      <div>
        <label className="block text-sm font-medium text-gris-dark mb-2">
          Equilibre general
        </label>
        <div className="flex flex-wrap gap-2">
          {balanceOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleChange("balance", option.value)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                data.balance === option.value
                  ? "bg-vert text-white"
                  : "bg-beige text-gris-dark hover:bg-beige-dark"
              }`}
            >
              {option.label}
            </button>
          ))}
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
          className="w-full px-4 py-3 rounded-lg border border-beige-dark focus:ring-2 focus:ring-vert focus:border-transparent"
          rows={2}
          placeholder="Vos observations sur les sensations en bouche..."
        />
      </div>
    </div>
  );
}
