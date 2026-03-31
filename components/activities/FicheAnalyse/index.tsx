"use client";

import { useState } from "react";
import {
  TastingFormData,
  SensoryProfile,
  initialTastingFormData,
} from "./types";
import VisualStep from "./VisualStep";
import OlfactoryStep from "./OlfactoryStep";
import GustatoryStep from "./GustatoryStep";
import ConclusionStep from "./ConclusionStep";
import ComparisonFeedback from "./ComparisonFeedback";

interface Wine {
  id: string;
  name: string;
  color: "RED" | "WHITE" | "ROSE" | "ORANGE";
  region: string;
  sensoryProfile: SensoryProfile | null;
}

interface FicheAnalyseProps {
  wine: Wine;
  isBlindTasting?: boolean;
  onComplete?: (data: TastingFormData) => Promise<void>;
}

type Step = "visual" | "olfactory" | "gustatory" | "conclusion" | "comparison";

const steps: { id: Step; label: string; icon: string }[] = [
  { id: "visual", label: "Visuel", icon: "👁️" },
  { id: "olfactory", label: "Nez", icon: "👃" },
  { id: "gustatory", label: "Bouche", icon: "👅" },
  { id: "conclusion", label: "Conclusion", icon: "📝" },
  { id: "comparison", label: "Comparaison", icon: "📊" },
];

export default function FicheAnalyse({
  wine,
  isBlindTasting = false,
  onComplete,
}: FicheAnalyseProps) {
  const [currentStep, setCurrentStep] = useState<Step>("visual");
  const [formData, setFormData] = useState<TastingFormData>(initialTastingFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
  const isRedWine = wine.color === "RED";

  const handleNext = async () => {
    const stepIndex = steps.findIndex((s) => s.id === currentStep);
    if (stepIndex < steps.length - 1) {
      // Si on passe a la comparaison, enregistrer d'abord
      if (steps[stepIndex + 1].id === "comparison" && onComplete) {
        setIsSubmitting(true);
        try {
          await onComplete(formData);
          setIsCompleted(true);
        } catch (error) {
          console.error("Erreur lors de l'enregistrement:", error);
        } finally {
          setIsSubmitting(false);
        }
      }
      setCurrentStep(steps[stepIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    const stepIndex = steps.findIndex((s) => s.id === currentStep);
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1].id);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case "visual":
        return formData.visual.clarity && formData.visual.intensity;
      case "olfactory":
        return formData.olfactory.intensity && formData.olfactory.aromaFamilies.length > 0;
      case "gustatory":
        return formData.gustatory.acidity && formData.gustatory.body && formData.gustatory.finish;
      case "conclusion":
        return formData.conclusion.perceivedStyle;
      default:
        return true;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header avec info vin */}
      {!isBlindTasting && (
        <div className="bg-white rounded-xl shadow-sm border border-beige-dark p-6 mb-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                isRedWine
                  ? "bg-bordeaux/10 text-bordeaux"
                  : "bg-or/10 text-or"
              }`}
            >
              🍷
            </div>
            <div>
              <h2 className="text-xl font-semibold text-bordeaux font-cormorant">
                {wine.name}
              </h2>
              <p className="text-sm text-gris-tech">{wine.region}</p>
            </div>
          </div>
        </div>
      )}

      {isBlindTasting && (
        <div className="bg-gris-dark rounded-xl p-6 mb-6 text-white text-center">
          <span className="text-4xl mb-2 block">🎭</span>
          <h2 className="text-xl font-semibold font-cormorant">
            Degustation a l&apos;aveugle
          </h2>
          <p className="text-sm text-white/70">
            Identifiez ce vin grace a vos sens
          </p>
        </div>
      )}

      {/* Progress bar */}
      <div className="bg-white rounded-xl shadow-sm border border-beige-dark p-4 mb-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => {
                if (index < currentStepIndex || isCompleted) {
                  setCurrentStep(step.id);
                }
              }}
              className={`flex flex-col items-center gap-1 transition-colors ${
                index < currentStepIndex || isCompleted
                  ? "cursor-pointer"
                  : "cursor-default"
              }`}
              disabled={index > currentStepIndex && !isCompleted}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors ${
                  index === currentStepIndex
                    ? "bg-bordeaux text-white"
                    : index < currentStepIndex || isCompleted
                      ? "bg-success/20 text-success"
                      : "bg-beige text-gris-light"
                }`}
              >
                {index < currentStepIndex || (index < steps.length - 1 && isCompleted) ? "✓" : step.icon}
              </div>
              <span
                className={`text-xs hidden sm:block ${
                  index === currentStepIndex
                    ? "text-bordeaux font-medium"
                    : "text-gris-light"
                }`}
              >
                {step.label}
              </span>
            </button>
          ))}
        </div>
        {/* Progress line */}
        <div className="mt-4 h-1 bg-beige rounded-full overflow-hidden">
          <div
            className="h-full bg-bordeaux transition-all duration-300"
            style={{
              width: `${((currentStepIndex + (isCompleted ? 1 : 0)) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-xl shadow-sm border border-beige-dark p-6 mb-6">
        {currentStep === "visual" && (
          <VisualStep
            data={formData.visual}
            onChange={(visual) => setFormData({ ...formData, visual })}
            wineColor={wine.color}
          />
        )}

        {currentStep === "olfactory" && (
          <OlfactoryStep
            data={formData.olfactory}
            onChange={(olfactory) => setFormData({ ...formData, olfactory })}
          />
        )}

        {currentStep === "gustatory" && (
          <GustatoryStep
            data={formData.gustatory}
            onChange={(gustatory) => setFormData({ ...formData, gustatory })}
            isRedWine={isRedWine}
          />
        )}

        {currentStep === "conclusion" && (
          <ConclusionStep
            data={formData.conclusion}
            onChange={(conclusion) => setFormData({ ...formData, conclusion })}
            isBlindTasting={isBlindTasting}
          />
        )}

        {currentStep === "comparison" && wine.sensoryProfile && (
          <ComparisonFeedback
            userTasting={formData}
            referenceProfile={wine.sensoryProfile}
            wineName={wine.name}
          />
        )}

        {currentStep === "comparison" && !wine.sensoryProfile && (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">📝</span>
            <h3 className="text-xl font-semibold text-bordeaux font-cormorant mb-2">
              Fiche enregistree
            </h3>
            <p className="text-gris-tech">
              Votre degustation a ete sauvegardee. Ce vin n&apos;a pas de profil de
              reference pour la comparaison.
            </p>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStepIndex === 0}
          className={`btn btn-secondary ${
            currentStepIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Precedent
        </button>

        {currentStep !== "comparison" && (
          <button
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting}
            className={`btn btn-primary ${
              !canProceed() ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Enregistrement...
              </>
            ) : currentStep === "conclusion" ? (
              <>
                Terminer et comparer
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </>
            ) : (
              <>
                Suivant
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        )}

        {currentStep === "comparison" && (
          <button
            onClick={() => window.history.back()}
            className="btn btn-primary"
          >
            Terminer
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export { type TastingFormData, type SensoryProfile } from "./types";
