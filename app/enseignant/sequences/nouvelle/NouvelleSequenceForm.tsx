"use client";

import { useState, useTransition } from "react";
import { createSequence } from "@/actions/sequences";
import type { BlockWithActivities, ActivityForPicker } from "@/actions/sequences";

interface NouvelleSequenceFormProps {
  blocks: BlockWithActivities[];
}

const activityTypeLabels: Record<string, string> = {
  LESSON: "Lecon",
  QUIZ: "Quiz",
  TASTING: "Degustation",
  EXERCISE: "Exercice",
  VIDEO: "Video",
  DOCUMENT: "Document",
  INTERACTIVE: "Interactif",
};

const activityTypeIcons: Record<string, string> = {
  LESSON: "📖",
  QUIZ: "❓",
  TASTING: "🍷",
  EXERCISE: "✏️",
  VIDEO: "🎬",
  DOCUMENT: "📄",
  INTERACTIVE: "🎮",
};

interface SelectedActivity extends ActivityForPicker {
  blockNumber: number;
  blockTitle: string;
}

export default function NouvelleSequenceForm({ blocks }: NouvelleSequenceFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [objectives, setObjectives] = useState("");
  const [duration, setDuration] = useState<string>("");

  // Activity selection
  const [selectedActivities, setSelectedActivities] = useState<SelectedActivity[]>([]);
  const [expandedBlock, setExpandedBlock] = useState<number | null>(null);

  const selectedIds = new Set(selectedActivities.map((a) => a.id));

  function addActivity(activity: ActivityForPicker, block: BlockWithActivities) {
    if (selectedIds.has(activity.id)) return;
    setSelectedActivities((prev) => [
      ...prev,
      {
        ...activity,
        blockNumber: block.number,
        blockTitle: block.title,
      },
    ]);
  }

  function removeActivity(activityId: string) {
    setSelectedActivities((prev) => prev.filter((a) => a.id !== activityId));
  }

  function moveActivity(index: number, direction: "up" | "down") {
    const newList = [...selectedActivities];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newList.length) return;
    [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
    setSelectedActivities(newList);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Le titre de la sequence est requis.");
      return;
    }

    if (selectedActivities.length === 0) {
      setError("Selectionnez au moins une activite pour la sequence.");
      return;
    }

    startTransition(async () => {
      try {
        await createSequence({
          title: title.trim(),
          description: description.trim() || undefined,
          objectives: objectives.trim() || undefined,
          duration: duration ? parseInt(duration, 10) : undefined,
          activityIds: selectedActivities.map((a) => a.id),
        });
      } catch (err) {
        console.error("Error creating sequence:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors de la creation de la sequence."
        );
      }
    });
  }

  const totalDuration = selectedActivities.reduce(
    (sum, a) => sum + (a.duration || 0),
    0
  );
  const totalPoints = selectedActivities.reduce(
    (sum, a) => sum + a.points,
    0
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Informations generales */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-6 text-[var(--vert)]">
          Informations generales
        </h2>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-[var(--gris-dark)] mb-1"
            >
              Titre de la sequence <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Introduction a la degustation"
              className="w-full px-4 py-3 border border-[var(--beige-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--vert)] bg-white"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-[var(--gris-dark)] mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Decrivez brievement le contenu et les objectifs de cette sequence..."
              className="w-full px-4 py-3 border border-[var(--beige-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--vert)] bg-white resize-none"
              rows={3}
            />
          </div>

          {/* Objectives */}
          <div>
            <label
              htmlFor="objectives"
              className="block text-sm font-medium text-[var(--gris-dark)] mb-1"
            >
              Objectifs pedagogiques
            </label>
            <textarea
              id="objectives"
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              placeholder="Listez les objectifs de cette sequence (un par ligne)..."
              className="w-full px-4 py-3 border border-[var(--beige-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--vert)] bg-white resize-none"
              rows={3}
            />
          </div>

          {/* Duration */}
          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-[var(--gris-dark)] mb-1"
            >
              Duree estimee (minutes)
            </label>
            <input
              id="duration"
              type="number"
              min={1}
              max={600}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Ex: 60"
              className="w-full max-w-xs px-4 py-3 border border-[var(--beige-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--vert)] bg-white"
            />
            {totalDuration > 0 && (
              <p className="text-xs text-[var(--gris-light)] mt-1">
                Duree cumulee des activites selectionnees : {totalDuration} min
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Activity Picker */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-2 text-[var(--vert)]">
          Activites disponibles
        </h2>
        <p className="text-sm text-[var(--gris-tech)] mb-6">
          Cliquez sur une activite pour l&apos;ajouter a votre sequence.
        </p>

        {blocks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[var(--gris-light)]">
              Aucune activite disponible pour le moment.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {blocks.map((block) => (
              <div
                key={block.number}
                className="border border-[var(--beige-dark)] rounded-xl overflow-hidden"
              >
                {/* Block header */}
                <button
                  type="button"
                  onClick={() =>
                    setExpandedBlock(
                      expandedBlock === block.number ? null : block.number
                    )
                  }
                  className="w-full flex items-center justify-between px-4 py-3 bg-[var(--beige)] hover:bg-[var(--beige-dark)] transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{block.icon || "📚"}</span>
                    <div>
                      <span className="text-xs text-[var(--gris-light)]">
                        Bloc {block.number}
                      </span>
                      <p className="font-medium text-[var(--gris-dark)]">
                        {block.title}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[var(--gris-light)]">
                      {block.activities.length} activite
                      {block.activities.length > 1 ? "s" : ""}
                    </span>
                    <svg
                      className={`w-5 h-5 text-[var(--gris-light)] transition-transform ${
                        expandedBlock === block.number ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {/* Block activities */}
                {expandedBlock === block.number && (
                  <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {block.activities.length === 0 ? (
                      <p className="text-sm text-[var(--gris-light)] col-span-full py-2">
                        Aucune activite dans ce bloc.
                      </p>
                    ) : (
                      block.activities.map((activity) => {
                        const isSelected = selectedIds.has(activity.id);
                        return (
                          <button
                            key={activity.id}
                            type="button"
                            onClick={() =>
                              isSelected
                                ? removeActivity(activity.id)
                                : addActivity(activity, block)
                            }
                            className={`p-3 rounded-xl text-left transition-all border-2 ${
                              isSelected
                                ? "border-[var(--vert)] bg-[var(--vert)] bg-opacity-5"
                                : "border-transparent bg-white hover:border-[var(--beige-dark)] hover:shadow-sm"
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-lg shrink-0">
                                {activityTypeIcons[activity.type] || "📝"}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-[var(--gris-dark)] truncate">
                                  {activity.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1 text-xs text-[var(--gris-light)]">
                                  <span>
                                    {activityTypeLabels[activity.type] || activity.type}
                                  </span>
                                  {activity.duration && (
                                    <span>{activity.duration} min</span>
                                  )}
                                  <span>{activity.points} pts</span>
                                </div>
                              </div>
                              {isSelected && (
                                <svg
                                  className="w-5 h-5 text-[var(--vert)] shrink-0"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                </svg>
                              )}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Activities */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-[var(--vert)]">
              Activites selectionnees
            </h2>
            {selectedActivities.length > 0 && (
              <p className="text-sm text-[var(--gris-tech)] mt-1">
                {selectedActivities.length} activite
                {selectedActivities.length > 1 ? "s" : ""}
                {totalDuration > 0 && <> &middot; {totalDuration} min</>}
                {totalPoints > 0 && <> &middot; {totalPoints} pts</>}
              </p>
            )}
          </div>
        </div>

        {selectedActivities.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-[var(--beige-dark)] rounded-xl">
            <svg
              className="w-12 h-12 text-[var(--beige-dark)] mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <p className="text-[var(--gris-light)]">
              Aucune activite selectionnee
            </p>
            <p className="text-sm text-[var(--gris-tech)] mt-1">
              Ouvrez un bloc ci-dessus et cliquez sur les activites a ajouter.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedActivities.map((activity, index) => (
              <div
                key={activity.id}
                className="flex items-center gap-3 p-3 bg-[var(--beige)] rounded-xl"
              >
                {/* Order number */}
                <div className="w-8 h-8 bg-[var(--vert)] text-white rounded-lg flex items-center justify-center text-sm font-bold shrink-0">
                  {index + 1}
                </div>

                {/* Activity info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base">
                      {activityTypeIcons[activity.type] || "📝"}
                    </span>
                    <p className="font-medium text-sm text-[var(--gris-dark)] truncate">
                      {activity.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--gris-light)]">
                    <span>
                      Bloc {activity.blockNumber} - {activity.blockTitle}
                    </span>
                    {activity.duration && (
                      <span>&middot; {activity.duration} min</span>
                    )}
                    <span>&middot; {activity.points} pts</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Move up */}
                  <button
                    type="button"
                    onClick={() => moveActivity(index, "up")}
                    disabled={index === 0}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--beige-dark)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Monter"
                  >
                    <svg
                      className="w-4 h-4 text-[var(--gris-tech)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </button>

                  {/* Move down */}
                  <button
                    type="button"
                    onClick={() => moveActivity(index, "down")}
                    disabled={index === selectedActivities.length - 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--beige-dark)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Descendre"
                  >
                    <svg
                      className="w-4 h-4 text-[var(--gris-tech)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => removeActivity(activity.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                    title="Retirer"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between gap-4">
        <a
          href="/enseignant/sequences"
          className="px-6 py-3 text-sm font-medium text-[var(--gris-tech)] hover:text-[var(--gris-dark)] transition-colors"
        >
          Annuler
        </a>
        <button
          type="submit"
          disabled={isPending || !title.trim() || selectedActivities.length === 0}
          className="btn inline-flex items-center gap-2 px-8 py-3 bg-[var(--vert)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
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
              Creation en cours...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
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
              Creer la sequence
            </>
          )}
        </button>
      </div>
    </form>
  );
}
