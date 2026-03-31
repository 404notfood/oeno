// Types pour la fiche d'analyse sensorielle

export interface VisualPerception {
  clarity: string | null;
  intensity: string | null;
  color: string | null;
  colorNuance: string | null;
  viscosity: string | null;
  notes: string;
}

export interface OlfactoryPerception {
  intensity: string | null;
  quality: string | null;
  aromaFamilies: string[];
  specificAromas: string[];
  notes: string;
}

export interface GustatoryPerception {
  attackType: string | null;
  acidity: string | null;
  alcohol: string | null;
  body: string | null;
  tannins: string | null;
  finish: string | null;
  finishLength: number | null;
  balance: string | null;
  notes: string;
}

export interface TastingConclusion {
  perceivedStyle: string | null;
  hypothesis: string;
  foodPairings: string[];
  overallImpression: string;
}

export interface TastingFormData {
  visual: VisualPerception;
  olfactory: OlfactoryPerception;
  gustatory: GustatoryPerception;
  conclusion: TastingConclusion;
}

export interface SensoryProfile {
  acidity: string;
  perceivedAlcohol: string;
  body: string;
  structure: string;
  tannins: string | null;
  finish: string;
  dominantAromas: string[];
  variability: string;
}

export interface ComparisonResult {
  parameter: string;
  userValue: string | null;
  expectedValue: string;
  match: "exact" | "close" | "different";
  explanation: string;
}

export interface PedagogicalFeedback {
  comparisons: ComparisonResult[];
  overallFeedback: string;
  suggestions: string[];
  strengths: string[];
}

// Options pour les selects
export const clarityOptions = [
  { value: "limpide", label: "Limpide" },
  { value: "voile", label: "Voile" },
  { value: "trouble", label: "Trouble" },
];

export const visualIntensityOptions = [
  { value: "pale", label: "Pale" },
  { value: "moyenne", label: "Moyenne" },
  { value: "soutenue", label: "Soutenue" },
  { value: "intense", label: "Intense" },
];

export const redColorOptions = [
  { value: "rubis", label: "Rubis" },
  { value: "grenat", label: "Grenat" },
  { value: "pourpre", label: "Pourpre" },
  { value: "tuile", label: "Tuile" },
];

export const whiteColorOptions = [
  { value: "jaune_pale", label: "Jaune pale" },
  { value: "jaune_dore", label: "Jaune dore" },
  { value: "or", label: "Or" },
  { value: "ambre", label: "Ambre" },
];

export const viscosityOptions = [
  { value: "fluide", label: "Fluide" },
  { value: "gras", label: "Gras" },
  { value: "sirupeux", label: "Sirupeux" },
];

export const olfactoryIntensityOptions = [
  { value: "faible", label: "Faible" },
  { value: "moyenne", label: "Moyenne" },
  { value: "aromatique", label: "Aromatique" },
  { value: "puissant", label: "Puissant" },
];

export const olfactoryQualityOptions = [
  { value: "simple", label: "Simple" },
  { value: "agreable", label: "Agreable" },
  { value: "fin", label: "Fin" },
  { value: "complexe", label: "Complexe" },
];

export const aromaFamilyOptions = [
  { value: "fruites", label: "Fruites" },
  { value: "floraux", label: "Floraux" },
  { value: "vegetaux", label: "Vegetaux" },
  { value: "epices", label: "Epices" },
  { value: "boise", label: "Boise" },
  { value: "grille", label: "Grille/Torrefie" },
  { value: "animal", label: "Animal" },
  { value: "mineral", label: "Mineral" },
];

export const attackTypeOptions = [
  { value: "franche", label: "Franche" },
  { value: "molle", label: "Molle" },
  { value: "agressive", label: "Agressive" },
];

export const acidityOptions = [
  { value: "plat", label: "Plat" },
  { value: "frais", label: "Frais" },
  { value: "vif", label: "Vif" },
  { value: "nerveux", label: "Nerveux" },
];

export const alcoholOptions = [
  { value: "leger", label: "Leger" },
  { value: "equilibre", label: "Equilibre" },
  { value: "chaleureux", label: "Chaleureux" },
  { value: "brulant", label: "Brulant" },
];

export const bodyOptions = [
  { value: "leger", label: "Leger" },
  { value: "moyen", label: "Moyen" },
  { value: "charpente", label: "Charpente" },
  { value: "puissant", label: "Puissant" },
];

export const tanninOptions = [
  { value: "souple", label: "Souple" },
  { value: "fondus", label: "Fondus" },
  { value: "fermes", label: "Fermes" },
  { value: "apres", label: "Apres" },
];

export const finishOptions = [
  { value: "courte", label: "Courte" },
  { value: "moyenne", label: "Moyenne" },
  { value: "longue", label: "Longue" },
  { value: "persistante", label: "Persistante" },
];

export const balanceOptions = [
  { value: "desequilibre", label: "Desequilibre" },
  { value: "correct", label: "Correct" },
  { value: "equilibre", label: "Equilibre" },
  { value: "harmonieux", label: "Harmonieux" },
];

export const styleOptions = [
  { value: "tendu", label: "Tendu / Vif" },
  { value: "ample", label: "Ample / Rond" },
  { value: "riche", label: "Riche / Genereux" },
  { value: "leger", label: "Leger / Frais" },
];

// Valeur initiale du formulaire
export const initialTastingFormData: TastingFormData = {
  visual: {
    clarity: null,
    intensity: null,
    color: null,
    colorNuance: null,
    viscosity: null,
    notes: "",
  },
  olfactory: {
    intensity: null,
    quality: null,
    aromaFamilies: [],
    specificAromas: [],
    notes: "",
  },
  gustatory: {
    attackType: null,
    acidity: null,
    alcohol: null,
    body: null,
    tannins: null,
    finish: null,
    finishLength: null,
    balance: null,
    notes: "",
  },
  conclusion: {
    perceivedStyle: null,
    hypothesis: "",
    foodPairings: [],
    overallImpression: "",
  },
};
