"use client";

import { TastingFormData, SensoryProfile, ComparisonResult, PedagogicalFeedback } from "./types";

interface ComparisonFeedbackProps {
  userTasting: TastingFormData;
  referenceProfile: SensoryProfile;
  wineName: string;
}

// Mappings pour la comparaison
const acidityMapping: Record<string, string[]> = {
  LOW: ["plat"],
  MEDIUM: ["frais", "plat"],
  HIGH: ["vif", "nerveux", "frais"],
};

const alcoholMapping: Record<string, string[]> = {
  LOW: ["leger"],
  MODERATE: ["leger", "equilibre"],
  HIGH: ["chaleureux", "brulant", "equilibre"],
};

const bodyMapping: Record<string, string[]> = {
  LIGHT: ["leger"],
  MEDIUM: ["moyen", "leger"],
  FULL: ["moyen", "charpente"],
  POWERFUL: ["charpente", "puissant"],
};

const tanninMapping: Record<string, string[]> = {
  FINE: ["souple", "fondus"],
  SOFT: ["souple", "fondus"],
  FIRM: ["fermes", "fondus"],
  PRONOUNCED: ["fermes", "apres"],
};

const finishMapping: Record<string, string[]> = {
  SHORT: ["courte"],
  MEDIUM: ["moyenne", "courte"],
  MEDIUM_LONG: ["moyenne", "longue"],
  LONG: ["longue", "persistante"],
};

// Fonction de comparaison
function compareValues(
  userValue: string | null,
  expectedValue: string,
  mapping: Record<string, string[]>
): "exact" | "close" | "different" {
  if (!userValue) return "different";

  const acceptableValues = mapping[expectedValue] || [];
  if (acceptableValues.includes(userValue)) {
    return acceptableValues[0] === userValue ? "exact" : "close";
  }
  return "different";
}

// Generateur de feedback pedagogique
function generateFeedback(
  userTasting: TastingFormData,
  referenceProfile: SensoryProfile
): PedagogicalFeedback {
  const comparisons: ComparisonResult[] = [];

  // Acidite
  const acidityMatch = compareValues(
    userTasting.gustatory.acidity,
    referenceProfile.acidity,
    acidityMapping
  );
  comparisons.push({
    parameter: "Acidite",
    userValue: userTasting.gustatory.acidity,
    expectedValue: referenceProfile.acidity,
    match: acidityMatch,
    explanation: getAcidityExplanation(acidityMatch, referenceProfile.acidity),
  });

  // Alcool percu
  const alcoholMatch = compareValues(
    userTasting.gustatory.alcohol,
    referenceProfile.perceivedAlcohol,
    alcoholMapping
  );
  comparisons.push({
    parameter: "Alcool percu",
    userValue: userTasting.gustatory.alcohol,
    expectedValue: referenceProfile.perceivedAlcohol,
    match: alcoholMatch,
    explanation: getAlcoholExplanation(alcoholMatch, referenceProfile.perceivedAlcohol),
  });

  // Corps/Matiere
  const bodyMatch = compareValues(
    userTasting.gustatory.body,
    referenceProfile.body,
    bodyMapping
  );
  comparisons.push({
    parameter: "Corps / Matiere",
    userValue: userTasting.gustatory.body,
    expectedValue: referenceProfile.body,
    match: bodyMatch,
    explanation: getBodyExplanation(bodyMatch, referenceProfile.body),
  });

  // Tanins (si applicable)
  if (referenceProfile.tannins) {
    const tanninMatch = compareValues(
      userTasting.gustatory.tannins,
      referenceProfile.tannins,
      tanninMapping
    );
    comparisons.push({
      parameter: "Tanins",
      userValue: userTasting.gustatory.tannins,
      expectedValue: referenceProfile.tannins,
      match: tanninMatch,
      explanation: getTanninExplanation(tanninMatch, referenceProfile.tannins),
    });
  }

  // Finale
  const finishMatch = compareValues(
    userTasting.gustatory.finish,
    referenceProfile.finish,
    finishMapping
  );
  comparisons.push({
    parameter: "Finale",
    userValue: userTasting.gustatory.finish,
    expectedValue: referenceProfile.finish,
    match: finishMatch,
    explanation: getFinishExplanation(finishMatch, referenceProfile.finish),
  });

  // Aromes
  const aromaMatch = compareAromas(
    userTasting.olfactory.specificAromas,
    referenceProfile.dominantAromas
  );
  comparisons.push({
    parameter: "Aromes dominants",
    userValue: userTasting.olfactory.specificAromas.join(", ") || null,
    expectedValue: referenceProfile.dominantAromas.join(", "),
    match: aromaMatch.match,
    explanation: aromaMatch.explanation,
  });

  // Calculer le feedback global
  const exactMatches = comparisons.filter((c) => c.match === "exact").length;
  const closeMatches = comparisons.filter((c) => c.match === "close").length;
  const total = comparisons.length;

  const overallFeedback = generateOverallFeedback(exactMatches, closeMatches, total);
  const suggestions = generateSuggestions(comparisons);
  const strengths = generateStrengths(comparisons);

  return {
    comparisons,
    overallFeedback,
    suggestions,
    strengths,
  };
}

function compareAromas(
  userAromas: string[],
  expectedAromas: string[]
): { match: "exact" | "close" | "different"; explanation: string } {
  if (userAromas.length === 0) {
    return {
      match: "different",
      explanation: "Vous n'avez pas identifie d'aromes specifiques.",
    };
  }

  const normalizedUser = userAromas.map((a) => a.toLowerCase());
  const normalizedExpected = expectedAromas.map((a) => a.toLowerCase());

  const matches = normalizedUser.filter((a) =>
    normalizedExpected.some((e) => a.includes(e) || e.includes(a))
  ).length;

  const matchRatio = matches / normalizedExpected.length;

  if (matchRatio >= 0.5) {
    return {
      match: "exact",
      explanation: `Vous avez bien identifie les aromes typiques de ce vin.`,
    };
  } else if (matchRatio > 0) {
    return {
      match: "close",
      explanation: `Vous avez identifie certains aromes attendus. Les aromes typiques incluent: ${expectedAromas.join(", ")}.`,
    };
  }

  return {
    match: "different",
    explanation: `Les aromes attendus pour ce type de vin sont: ${expectedAromas.join(", ")}. Cela peut varier selon la temperature de service ou le vieillissement.`,
  };
}

function getAcidityExplanation(match: string, expected: string): string {
  const explanations: Record<string, Record<string, string>> = {
    exact: {
      LOW: "Vous avez correctement percu la faible acidite de ce vin.",
      MEDIUM: "Vous avez bien identifie l'acidite moderee.",
      HIGH: "Vous avez correctement percu la vivacite de ce vin.",
    },
    close: {
      LOW: "Votre perception est proche. Ce vin a une acidite naturellement basse.",
      MEDIUM: "Votre perception est proche de l'acidite attendue.",
      HIGH: "Votre perception est proche. Ce vin est naturellement vif.",
    },
    different: {
      LOW: "Ce vin a une acidite faible. La temperature de service peut influencer la perception.",
      MEDIUM: "Ce vin a une acidite moderee, equilibree.",
      HIGH: "Ce vin est caracterise par une acidite elevee, typique de son terroir frais.",
    },
  };
  return explanations[match]?.[expected] || "";
}

function getAlcoholExplanation(match: string, expected: string): string {
  const explanations: Record<string, Record<string, string>> = {
    exact: {
      LOW: "Vous avez bien percu la legerete alcoolique de ce vin.",
      MODERATE: "Vous avez correctement identifie l'equilibre alcoolique.",
      HIGH: "Vous avez bien percu la chaleur de ce vin genereux.",
    },
    close: {
      LOW: "Votre perception est proche. Ce vin a un faible degre d'alcool.",
      MODERATE: "Votre perception est proche de l'equilibre attendu.",
      HIGH: "Votre perception est proche. Ce vin provient d'un climat chaud.",
    },
    different: {
      LOW: "Ce vin a un degre d'alcool modere. Le climat frais de la region explique cette legerete.",
      MODERATE: "Ce vin presente un equilibre alcoolique typique.",
      HIGH: "Ce vin provient d'une region chaude, ce qui explique sa chaleur en bouche.",
    },
  };
  return explanations[match]?.[expected] || "";
}

function getBodyExplanation(match: string, expected: string): string {
  const explanations: Record<string, Record<string, string>> = {
    exact: {
      LIGHT: "Vous avez bien identifie la legerete de ce vin.",
      MEDIUM: "Vous avez correctement percu le corps moyen.",
      FULL: "Vous avez bien identifie l'ampleur de ce vin.",
      POWERFUL: "Vous avez correctement percu la puissance de ce vin.",
    },
    close: {
      LIGHT: "Votre perception est proche. Ce vin est naturellement leger.",
      MEDIUM: "Votre perception est proche du corps attendu.",
      FULL: "Votre perception est proche de l'ampleur attendue.",
      POWERFUL: "Votre perception est proche de la puissance attendue.",
    },
    different: {
      LIGHT: "Ce vin a un corps leger, typique de son cepage et de sa region.",
      MEDIUM: "Ce vin a un corps moyen, bien equilibre.",
      FULL: "Ce vin presente une belle ampleur en bouche.",
      POWERFUL: "Ce vin est puissant, avec une belle concentration.",
    },
  };
  return explanations[match]?.[expected] || "";
}

function getTanninExplanation(match: string, expected: string): string {
  const explanations: Record<string, Record<string, string>> = {
    exact: {
      FINE: "Vous avez bien identifie la finesse des tanins.",
      SOFT: "Vous avez correctement percu la souplesse des tanins.",
      FIRM: "Vous avez bien identifie la structure tannique.",
      PRONOUNCED: "Vous avez correctement percu les tanins marques.",
    },
    close: {
      FINE: "Votre perception est proche. Les tanins de ce vin sont fins et delicats.",
      SOFT: "Votre perception est proche de la souplesse attendue.",
      FIRM: "Votre perception est proche de la structure tannique.",
      PRONOUNCED: "Votre perception est proche des tanins attendus.",
    },
    different: {
      FINE: "Ce vin a des tanins fins, caracteristiques du cepage.",
      SOFT: "Les tanins de ce vin sont souples et arrondis.",
      FIRM: "Ce vin a une structure tannique affirmee, propice au vieillissement.",
      PRONOUNCED: "Les tanins marques de ce vin sont typiques du cepage et de la vinification.",
    },
  };
  return explanations[match]?.[expected] || "";
}

function getFinishExplanation(match: string, expected: string): string {
  const explanations: Record<string, Record<string, string>> = {
    exact: {
      SHORT: "Vous avez bien percu la finale courte de ce vin.",
      MEDIUM: "Vous avez correctement identifie la longueur en bouche.",
      MEDIUM_LONG: "Vous avez bien percu la belle persistance.",
      LONG: "Vous avez correctement identifie la longue finale.",
    },
    close: {
      SHORT: "Votre perception est proche de la finale attendue.",
      MEDIUM: "Votre perception est proche de la longueur attendue.",
      MEDIUM_LONG: "Votre perception est proche de la persistance attendue.",
      LONG: "Votre perception est proche de la longue finale.",
    },
    different: {
      SHORT: "Ce vin a une finale courte mais agreable.",
      MEDIUM: "Ce vin offre une persistance moderee en bouche.",
      MEDIUM_LONG: "Ce vin presente une belle longueur en bouche.",
      LONG: "La longue finale de ce vin temoigne de sa qualite.",
    },
  };
  return explanations[match]?.[expected] || "";
}

function generateOverallFeedback(exact: number, close: number, total: number): string {
  const score = (exact * 2 + close) / (total * 2);

  if (score >= 0.8) {
    return "Excellent ! Votre perception est tres proche du profil attendu. Vous avez une bonne comprehension de ce type de vin.";
  } else if (score >= 0.6) {
    return "Tres bien ! La plupart de vos perceptions correspondent au profil de reference. Continuez a vous exercer sur les points ou vous divergez.";
  } else if (score >= 0.4) {
    return "Bien ! Vous avez identifie plusieurs caracteristiques correctement. Les ecarts peuvent s'expliquer par les conditions de degustation ou la variabilite naturelle du vin.";
  } else {
    return "Continuez a vous exercer ! Les ecarts entre votre perception et le profil attendu sont normaux pour un debutant. Chaque degustation est une occasion d'apprentissage.";
  }
}

function generateSuggestions(comparisons: ComparisonResult[]): string[] {
  const suggestions: string[] = [];
  const differentComparisons = comparisons.filter((c) => c.match === "different");

  if (differentComparisons.some((c) => c.parameter === "Acidite")) {
    suggestions.push("Pour mieux percevoir l'acidite, concentrez-vous sur la salivation et la fraicheur en bouche.");
  }
  if (differentComparisons.some((c) => c.parameter === "Alcool percu")) {
    suggestions.push("L'alcool se ressent comme une sensation de chaleur. Comparez des vins de degres differents.");
  }
  if (differentComparisons.some((c) => c.parameter === "Tanins")) {
    suggestions.push("Les tanins creent une sensation d'astringence (seche) sur les gencives et la langue.");
  }
  if (differentComparisons.some((c) => c.parameter === "Aromes dominants")) {
    suggestions.push("Entraiez votre nez avec un kit d'aromes ou en sentant des ingredients frais.");
  }

  return suggestions;
}

function generateStrengths(comparisons: ComparisonResult[]): string[] {
  const strengths: string[] = [];
  const exactComparisons = comparisons.filter((c) => c.match === "exact");

  exactComparisons.forEach((c) => {
    strengths.push(`Bonne perception: ${c.parameter}`);
  });

  return strengths;
}

export default function ComparisonFeedback({
  userTasting,
  referenceProfile,
  wineName,
}: ComparisonFeedbackProps) {
  const feedback = generateFeedback(userTasting, referenceProfile);

  const getMatchColor = (match: string) => {
    switch (match) {
      case "exact":
        return "bg-success/10 border-success/30 text-success";
      case "close":
        return "bg-info/10 border-info/30 text-info";
      default:
        return "bg-warning/10 border-warning/30 text-warning";
    }
  };

  const getMatchIcon = (match: string) => {
    switch (match) {
      case "exact":
        return "✓";
      case "close":
        return "≈";
      default:
        return "→";
    }
  };

  const getMatchLabel = (match: string) => {
    switch (match) {
      case "exact":
        return "Correspondance exacte";
      case "close":
        return "Perception proche";
      default:
        return "Ecart pedagogique";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-bordeaux/10 flex items-center justify-center">
          <span className="text-2xl">📊</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-bordeaux font-cormorant">
            Comparaison avec le profil de reference
          </h3>
          <p className="text-sm text-gris-tech">{wineName}</p>
        </div>
      </div>

      {/* Feedback global */}
      <div className="bg-beige-light rounded-xl p-6 border border-beige-dark">
        <p className="text-gris-dark">{feedback.overallFeedback}</p>
      </div>

      {/* Comparaisons detaillees */}
      <div className="space-y-4">
        {feedback.comparisons.map((comparison, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${getMatchColor(comparison.match)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{getMatchIcon(comparison.match)}</span>
                <span className="font-medium">{comparison.parameter}</span>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-white/50">
                {getMatchLabel(comparison.match)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mb-2">
              <div>
                <span className="text-gris-light">Votre perception:</span>
                <p className="font-medium">{comparison.userValue || "Non renseigne"}</p>
              </div>
              <div>
                <span className="text-gris-light">Profil attendu:</span>
                <p className="font-medium">{comparison.expectedValue}</p>
              </div>
            </div>
            <p className="text-sm">{comparison.explanation}</p>
          </div>
        ))}
      </div>

      {/* Points forts */}
      {feedback.strengths.length > 0 && (
        <div className="bg-success/10 rounded-xl p-6 border border-success/30">
          <h4 className="font-semibold text-success mb-3">Vos points forts</h4>
          <ul className="space-y-1">
            {feedback.strengths.map((strength, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-success">
                <span>✓</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {feedback.suggestions.length > 0 && (
        <div className="bg-info/10 rounded-xl p-6 border border-info/30">
          <h4 className="font-semibold text-info mb-3">Suggestions pour progresser</h4>
          <ul className="space-y-2">
            {feedback.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-info">
                <span className="mt-0.5">💡</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Note pedagogique */}
      <div className="bg-beige rounded-xl p-6 border border-beige-dark">
        <h4 className="font-semibold text-gris-dark mb-2">Note pedagogique</h4>
        <p className="text-sm text-gris-tech">
          Rappelez-vous que la degustation est subjective et que de nombreux facteurs
          peuvent influencer votre perception : temperature du vin, conditions de
          service, votre etat de fatigue, etc. L&apos;important n&apos;est pas d&apos;avoir &quot;juste&quot;
          mais de developper votre vocabulaire et votre capacite a analyser un vin.
        </p>
      </div>
    </div>
  );
}
