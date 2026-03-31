"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import FicheAnalyse from "./FicheAnalyse";

interface Activity {
  id: string;
  title: string;
  type: string;
  content: unknown;
  points: number;
  progress: {
    status: string;
    score: number | null;
  } | null;
}

interface ActivityContentProps {
  activity: Activity;
  userId: string;
  isCompleted: boolean;
}

export default function ActivityContent({
  activity,
  userId,
  isCompleted,
}: ActivityContentProps) {
  const [isMarking, setIsMarking] = useState(false);
  const [marked, setMarked] = useState(isCompleted);

  const handleMarkComplete = async () => {
    setIsMarking(true);
    try {
      const response = await fetch("/api/activities/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityId: activity.id,
          userId,
          score: 100,
        }),
      });

      if (response.ok) {
        setMarked(true);
      }
    } catch (error) {
      console.error("Error marking activity complete:", error);
    } finally {
      setIsMarking(false);
    }
  };

  // Parse content if it's a JSON string
  const content = (() => {
    if (!activity.content) return {};
    if (typeof activity.content === "string") {
      try {
        return JSON.parse(activity.content) || {};
      } catch {
        return { text: activity.content };
      }
    }
    return activity.content || {};
  })();

  // Render based on activity type
  const renderContent = () => {
    switch (activity.type) {
      case "LESSON":
        return <LessonContent content={content} />;

      case "FRISE":
        return <FriseContent content={content} />;

      case "ROUE_AROMES":
        return <RoueAromesContent content={content} />;

      case "SCHEMA":
        return <SchemaContent content={content} />;

      case "FICHE_ANALYSE":
        return <FicheAnalyseActivity content={content} activityId={activity.id} onActivityComplete={() => setMarked(true)} />;

      case "ETUDE_CAS":
        return <EtudeCasContent content={content} />;

      case "ARBRE_DIAGNOSTIC":
        return <ArbreDiagnosticContent content={content} />;

      case "APPARIEMENT":
        return <AppariementContent content={content} />;

      case "INTERACTIVE":
        return <InteractiveContent content={content} />;

      default:
        return <GenericContent content={content} />;
    }
  };

  return (
    <div className="card">
      {renderContent()}

      {/* Mark as complete button for lesson-type activities */}
      {activity.type === "LESSON" && !marked && (
        <div className="mt-8 pt-6 border-t border-[var(--beige-dark)]">
          <button
            onClick={handleMarkComplete}
            disabled={isMarking}
            className="btn btn-primary w-full sm:w-auto"
          >
            {isMarking ? (
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
                Enregistrement...
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Marquer comme terminée
              </>
            )}
          </button>
        </div>
      )}

      {marked && (
        <div className="mt-8 pt-6 border-t border-[var(--beige-dark)]">
          <div className="flex items-center gap-3 text-[var(--success)] bg-[var(--success)] bg-opacity-10 p-4 rounded-xl">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">
              Activité complétée ! +{activity.points} points
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Lesson content renderer
function LessonContent({ content }: { content: { sections?: Array<{ title: string; content: string }>; text?: string } | null }) {
  if (!content) {
    return (
      <div className="text-center py-8 text-[var(--gris-light)]">
        <p>Contenu de la leçon non disponible.</p>
      </div>
    );
  }

  if (content.sections && content.sections.length > 0) {
    return (
      <div className="prose max-w-none">
        {content.sections.map((section, index) => (
          <div key={index} className="mb-8 last:mb-0">
            <h2 className="text-xl font-semibold text-[var(--gris-dark)] mb-4">
              {section.title}
            </h2>
            <div
              className="text-[var(--gris-tech)] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (content.text) {
    return (
      <div
        className="prose max-w-none text-[var(--gris-tech)] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content.text }}
      />
    );
  }

  return (
    <div className="text-center py-8 text-[var(--gris-light)]">
      <p>Cette leçon sera bientôt disponible.</p>
    </div>
  );
}

// Timeline content renderer
function FriseContent({ content }: { content: { events?: Array<{ year: string; title: string; description: string }> } | null }) {
  const events = content?.events || [];

  return (
    <div className="relative">
      <h2 className="text-xl font-semibold text-[var(--gris-dark)] mb-6">
        Frise chronologique
      </h2>
      <div className="relative pl-8 border-l-2 border-[var(--bordeaux)] space-y-8">
        {events.map((event, index) => (
          <div key={index} className="relative">
            <div className="absolute -left-[25px] w-4 h-4 bg-[var(--bordeaux)] rounded-full border-4 border-white" />
            <div className="bg-[var(--beige)] rounded-xl p-4">
              <span className="text-sm font-bold text-[var(--bordeaux)]">
                {event.year}
              </span>
              <h3 className="font-semibold text-[var(--gris-dark)] mt-1">
                {event.title}
              </h3>
              <p className="text-sm text-[var(--gris-tech)] mt-2">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Aroma wheel content renderer
function RoueAromesContent({ content }: { content: { categories?: Array<{ name: string; aromas: string[] }> } | null }) {
  const categories = content?.categories || [];

  return (
    <div>
      <h2 className="text-xl font-semibold text-[var(--gris-dark)] mb-6">
        Roue des arômes
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category, index) => (
          <div
            key={index}
            className="bg-[var(--beige)] rounded-xl p-4"
          >
            <h3 className="font-semibold text-[var(--bordeaux)] mb-3">
              {category.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.aromas.map((aroma, aromaIndex) => (
                <span
                  key={aromaIndex}
                  className="text-sm bg-white px-3 py-1 rounded-full text-[var(--gris-tech)]"
                >
                  {aroma}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Schema content renderer
function SchemaContent({ content }: { content: { title?: string; imageUrl?: string; description?: string } | null }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-[var(--gris-dark)] mb-6">
        {content?.title || "Schéma interactif"}
      </h2>
      {content?.imageUrl && (
        <div className="mb-6 relative w-full aspect-video">
          <Image
            src={content.imageUrl}
            alt={content.title || "Schéma"}
            fill
            className="rounded-xl object-contain"
          />
        </div>
      )}
      {content?.description && (
        <p className="text-[var(--gris-tech)]">{content.description}</p>
      )}
      {!content?.imageUrl && !content?.description && (
        <div className="text-center py-8 text-[var(--gris-light)]">
          <p>Schéma à venir.</p>
        </div>
      )}
    </div>
  );
}

// Fiche d'analyse sensorielle - uses the full FicheAnalyse component
interface FicheAnalyseWineData {
  id?: string;
  name?: string;
  color?: "RED" | "WHITE" | "ROSE" | "ORANGE";
  region?: string;
  sensoryProfile?: {
    acidity: string;
    perceivedAlcohol: string;
    body: string;
    structure: string;
    tannins: string | null;
    finish: string;
    dominantAromas: string[];
    variability: string;
  } | null;
}

interface FicheAnalyseContentData {
  wine?: FicheAnalyseWineData;
  isBlindTasting?: boolean;
  [key: string]: unknown;
}

function FicheAnalyseActivity({
  content,
  activityId,
  onActivityComplete,
}: {
  content: FicheAnalyseContentData | null;
  activityId: string;
  onActivityComplete: () => void;
}) {
  const [completionError, setCompletionError] = useState<string | null>(null);

  const wine = {
    id: content?.wine?.id || activityId,
    name: content?.wine?.name || "Vin d'exercice",
    color: content?.wine?.color || ("RED" as const),
    region: content?.wine?.region || "France",
    sensoryProfile: content?.wine?.sensoryProfile || null,
  };

  const isBlindTasting = content?.isBlindTasting ?? false;

  const handleComplete = useCallback(async () => {
    setCompletionError(null);
    try {
      const response = await fetch("/api/activities/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityId,
          score: 100,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'enregistrement de l'activite");
      }

      onActivityComplete();
    } catch (error) {
      console.error("Error completing fiche analyse activity:", error);
      setCompletionError(
        error instanceof Error ? error.message : "Erreur inconnue"
      );
      throw error;
    }
  }, [activityId, onActivityComplete]);

  return (
    <div>
      {completionError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {completionError}
        </div>
      )}
      <FicheAnalyse
        wine={wine}
        isBlindTasting={isBlindTasting}
        onComplete={handleComplete}
      />
    </div>
  );
}

// Case study content renderer
function EtudeCasContent({ content }: { content: { scenario?: string; questions?: Array<{ question: string }> } | null }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-[var(--gris-dark)] mb-6">
        Étude de cas
      </h2>
      {content?.scenario && (
        <div className="bg-[var(--beige)] rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-[var(--bordeaux)] mb-3">Scénario</h3>
          <p className="text-[var(--gris-tech)] whitespace-pre-line">
            {content.scenario}
          </p>
        </div>
      )}
      {content?.questions && content.questions.length > 0 && (
        <div className="space-y-4">
          {content.questions.map((q, index) => (
            <div key={index} className="bg-white border border-[var(--beige-dark)] rounded-xl p-4">
              <p className="font-medium text-[var(--gris-dark)] mb-3">
                {index + 1}. {q.question}
              </p>
              <textarea
                className="w-full px-4 py-2 border border-[var(--beige-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--bordeaux)]"
                rows={3}
                placeholder="Votre réponse..."
              />
            </div>
          ))}
        </div>
      )}
      {!content?.scenario && !content?.questions && (
        <div className="text-center py-8 text-[var(--gris-light)]">
          <p>Étude de cas à venir.</p>
        </div>
      )}
    </div>
  );
}

// Diagnostic tree content renderer
function ArbreDiagnosticContent({ content }: { content: { title?: string; description?: string } | null }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-[var(--gris-dark)] mb-6">
        Arbre de diagnostic
      </h2>
      <div className="bg-[var(--beige)] rounded-xl p-6 text-center">
        <p className="text-[var(--gris-tech)]">
          {content?.description || "Contenu de l'arbre de diagnostic à venir."}
        </p>
      </div>
    </div>
  );
}

// Matching content renderer
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function AppariementContent({ content }: { content: { pairs?: Array<{ left: string; right: string }> } | null }) {
  const pairs = content?.pairs || [];

  const [shuffledPairs] = useState(() => shuffleArray(pairs));

  return (
    <div>
      <h2 className="text-xl font-semibold text-[var(--gris-dark)] mb-6">
        Appariement
      </h2>
      <p className="text-[var(--gris-tech)] mb-6">
        Associez les éléments de gauche avec ceux de droite.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          {pairs.map((pair, index) => (
            <div
              key={index}
              className="bg-[var(--beige)] rounded-xl p-4 cursor-pointer hover:shadow-md transition-all"
            >
              {pair.left}
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {shuffledPairs.map((pair, index) => (
            <div
              key={index}
              className="bg-[var(--bordeaux)] bg-opacity-10 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all"
            >
              {pair.right}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Interactive content renderer
function InteractiveContent({ content }: { content: { description?: string } | null }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-[var(--gris-dark)] mb-6">
        Activité interactive
      </h2>
      <div className="bg-[var(--beige)] rounded-xl p-6 text-center">
        <p className="text-[var(--gris-tech)]">
          {content?.description || "Contenu interactif à venir."}
        </p>
      </div>
    </div>
  );
}

// Generic content renderer for unknown types
function GenericContent({ content }: { content: unknown }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-[var(--gris-dark)] mb-6">
        Contenu de l&apos;activité
      </h2>
      <div className="bg-[var(--beige)] rounded-xl p-6">
        <pre className="text-sm text-[var(--gris-tech)] whitespace-pre-wrap">
          {JSON.stringify(content, null, 2)}
        </pre>
      </div>
    </div>
  );
}
