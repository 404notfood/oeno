"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { reviewTasting } from "@/actions/tastings";

interface ReviewFormProps {
  tastingId: string;
  isReviewed: boolean;
  initialScore?: number;
  initialComment?: string;
}

export default function ReviewForm({
  tastingId,
  isReviewed,
  initialScore,
  initialComment,
}: ReviewFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [score, setScore] = useState(initialScore || 10);
  const [comment, setComment] = useState(initialComment || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!comment.trim()) {
      setError("Veuillez ajouter un commentaire pour l'élève");
      return;
    }

    startTransition(async () => {
      try {
        await reviewTasting(tastingId, {
          teacherScore: score,
          teacherComment: comment.trim(),
        });
        router.push("/enseignant/degustations");
      } catch (err) {
        console.error("Error reviewing tasting:", err);
        setError("Erreur lors de l'enregistrement de l'évaluation");
      }
    });
  };

  if (isReviewed) {
    return (
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-[var(--gris-dark)] mb-2">
            Note attribuée
          </p>
          <p className="text-3xl font-bold text-[var(--bordeaux)]">
            {initialScore}/20
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--gris-dark)] mb-2">
            Commentaire
          </p>
          <p className="text-[var(--gris-tech)] bg-[var(--beige)] p-4 rounded-lg">
            {initialComment}
          </p>
        </div>
        <div className="pt-4 border-t border-[var(--beige-dark)]">
          <p className="text-xs text-[var(--gris-light)]">
            Cette dégustation a déjà été évaluée. L&apos;élève a reçu votre retour.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Score */}
      <div>
        <label className="block text-sm font-medium text-[var(--gris-dark)] mb-3">
          Note
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={20}
            step={0.5}
            value={score}
            onChange={(e) => setScore(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-[var(--beige-dark)] rounded-lg appearance-none cursor-pointer accent-[var(--bordeaux)]"
          />
          <div className="w-20 text-center">
            <span className="text-3xl font-bold text-[var(--bordeaux)]">
              {score}
            </span>
            <span className="text-sm text-[var(--gris-light)]">/20</span>
          </div>
        </div>
        <div className="flex justify-between text-xs text-[var(--gris-light)] mt-2">
          <span>Insuffisant</span>
          <span>Passable</span>
          <span>Bien</span>
          <span>Très bien</span>
          <span>Excellent</span>
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium text-[var(--gris-dark)] mb-2">
          Commentaire pour l&apos;élève
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-4 py-3 border border-[var(--beige-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--bordeaux)] resize-none"
          rows={5}
          placeholder="Points forts, points à améliorer, conseils..."
          required
        />
      </div>

      {/* Quick comments */}
      <div>
        <p className="text-xs text-[var(--gris-light)] mb-2">
          Suggestions rapides :
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            "Bonne analyse visuelle",
            "Vocabulaire précis",
            "Manque de détails",
            "Très bonne identification des arômes",
            "Travaillez l'équilibre",
            "Excellente conclusion",
          ].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() =>
                setComment((prev) =>
                  prev ? `${prev} ${suggestion}.` : `${suggestion}.`
                )
              }
              className="px-2 py-1 text-xs bg-[var(--beige)] text-[var(--gris-dark)] rounded hover:bg-[var(--beige-dark)] transition-colors"
            >
              + {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full btn btn-primary"
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
            Valider l&apos;évaluation
          </>
        )}
      </button>
    </form>
  );
}
