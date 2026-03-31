"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface Option {
  text: string;
  isCorrect: boolean;
}

interface QuestionFormProps {
  quizId: string;
  nextOrder: number;
  initialData?: {
    id: string;
    question: string;
    type: string;
    explanation: string | null;
    points: number;
    options: Array<{ id: string; text: string; isCorrect: boolean; order: number }>;
  };
}

export default function QuestionForm({
  quizId,
  nextOrder,
  initialData,
}: QuestionFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [question, setQuestion] = useState(initialData?.question || "");
  const [type, setType] = useState(initialData?.type || "SINGLE_CHOICE");
  const [explanation, setExplanation] = useState(initialData?.explanation || "");
  const [points, setPoints] = useState(initialData?.points || 1);
  const [options, setOptions] = useState<Option[]>(
    initialData?.options.map((o) => ({ text: o.text, isCorrect: o.isCorrect })) || [
      { text: "", isCorrect: true },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ]
  );

  const addOption = () => {
    setOptions([...options, { text: "", isCorrect: false }]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    const newOptions = options.filter((_, i) => i !== index);
    // Ensure at least one option is correct
    if (!newOptions.some((o) => o.isCorrect) && newOptions.length > 0) {
      newOptions[0].isCorrect = true;
    }
    setOptions(newOptions);
  };

  const updateOption = (index: number, field: keyof Option, value: string | boolean) => {
    const newOptions = [...options];
    if (field === "isCorrect" && value === true) {
      // For single choice, uncheck other options
      if (type === "SINGLE_CHOICE") {
        newOptions.forEach((o, i) => {
          o.isCorrect = i === index;
        });
      } else {
        newOptions[index].isCorrect = true;
      }
    } else if (field === "text" && typeof value === "string") {
      newOptions[index].text = value;
    } else if (field === "isCorrect" && typeof value === "boolean") {
      newOptions[index].isCorrect = value;
    }
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    if (!question.trim()) {
      setError("La question est obligatoire");
      return;
    }

    const validOptions = options.filter((o) => o.text.trim());
    if (validOptions.length < 2) {
      setError("Au moins 2 options sont requises");
      return;
    }

    if (!validOptions.some((o) => o.isCorrect)) {
      setError("Au moins une option doit etre correcte");
      return;
    }

    startTransition(async () => {
      try {
        const url = initialData
          ? `/api/admin/quiz/questions/${initialData.id}`
          : "/api/admin/quiz/questions";

        const response = await fetch(url, {
          method: initialData ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quizId,
            question,
            type,
            explanation: explanation || null,
            points,
            order: nextOrder,
            options: validOptions.map((o, i) => ({
              text: o.text,
              isCorrect: o.isCorrect,
              order: i + 1,
            })),
          }),
        });

        if (response.ok) {
          router.push(`/admin/quiz/${quizId}/questions`);
          router.refresh();
        } else {
          const data = await response.json();
          setError(data.error || "Erreur lors de la sauvegarde");
        }
      } catch (err) {
        console.error("Error saving question:", err);
        setError("Erreur lors de la sauvegarde");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      {/* Question text */}
      <div className="bg-white rounded-xl border border-[var(--beige-dark)] p-6">
        <label className="block text-sm font-medium text-[var(--gris-dark)] mb-2">
          Question *
        </label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full px-4 py-3 border border-[var(--beige-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--bordeaux)] resize-none"
          rows={3}
          placeholder="Saisissez votre question..."
        />
      </div>

      {/* Type and points */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-[var(--beige-dark)] p-6">
          <label className="block text-sm font-medium text-[var(--gris-dark)] mb-2">
            Type de question
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-3 border border-[var(--beige-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--bordeaux)]"
          >
            <option value="SINGLE_CHOICE">Choix unique</option>
            <option value="MULTIPLE_CHOICE">Choix multiples</option>
          </select>
        </div>

        <div className="bg-white rounded-xl border border-[var(--beige-dark)] p-6">
          <label className="block text-sm font-medium text-[var(--gris-dark)] mb-2">
            Points
          </label>
          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(Math.max(1, parseInt(e.target.value) || 1))}
            min={1}
            className="w-full px-4 py-3 border border-[var(--beige-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--bordeaux)]"
          />
        </div>
      </div>

      {/* Options */}
      <div className="bg-white rounded-xl border border-[var(--beige-dark)] p-6">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-medium text-[var(--gris-dark)]">
            Options de reponse *
          </label>
          <button
            type="button"
            onClick={addOption}
            className="text-sm text-[var(--bordeaux)] hover:text-[var(--bordeaux-light)] font-medium"
          >
            + Ajouter une option
          </button>
        </div>

        <div className="space-y-3">
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updateOption(index, "isCorrect", !option.isCorrect)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  option.isCorrect
                    ? "border-green-500 bg-green-500"
                    : "border-[var(--gris-light)] hover:border-green-300"
                }`}
                title={option.isCorrect ? "Reponse correcte" : "Marquer comme correcte"}
              >
                {option.isCorrect && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
              <input
                type="text"
                value={option.text}
                onChange={(e) => updateOption(index, "text", e.target.value)}
                className="flex-1 px-4 py-2 border border-[var(--beige-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--bordeaux)]"
                placeholder={`Option ${index + 1}`}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="p-2 text-[var(--gris-light)] hover:text-red-500 hover:bg-red-50 rounded-lg"
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
              )}
            </div>
          ))}
        </div>

        <p className="mt-3 text-xs text-[var(--gris-light)]">
          Cliquez sur le cercle pour marquer une option comme correcte.
          {type === "MULTIPLE_CHOICE" && " Plusieurs reponses peuvent etre correctes."}
        </p>
      </div>

      {/* Explanation */}
      <div className="bg-white rounded-xl border border-[var(--beige-dark)] p-6">
        <label className="block text-sm font-medium text-[var(--gris-dark)] mb-2">
          Explication (optionnel)
        </label>
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          className="w-full px-4 py-3 border border-[var(--beige-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--bordeaux)] resize-none"
          rows={2}
          placeholder="Explication affichee apres la reponse..."
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="btn btn-primary"
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
          ) : initialData ? (
            "Mettre a jour"
          ) : (
            "Creer la question"
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn btn-secondary"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
