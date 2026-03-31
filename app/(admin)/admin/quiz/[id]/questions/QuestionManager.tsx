"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
  order: number;
}

interface Question {
  id: string;
  question: string;
  type: string;
  explanation: string | null;
  points: number;
  order: number;
  options: Option[];
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

interface QuestionManagerProps {
  quiz: Quiz;
}

export default function QuestionManager({ quiz }: QuestionManagerProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleDelete = async (questionId: string) => {
    if (!confirm("Supprimer cette question ?")) return;

    setDeletingId(questionId);
    try {
      const response = await fetch(`/api/admin/quiz/questions/${questionId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

  if (quiz.questions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[var(--beige-dark)] p-12 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-lg font-semibold text-[var(--gris-dark)] mb-2">
          Aucune question
        </h3>
        <p className="text-[var(--gris-tech)] mb-4">
          Ce quiz ne contient pas encore de questions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {quiz.questions.map((question, index) => (
        <div
          key={question.id}
          className="bg-white rounded-xl border border-[var(--beige-dark)] overflow-hidden"
        >
          {/* Question header */}
          <div
            className="p-4 flex items-start gap-4 cursor-pointer hover:bg-[var(--beige)]"
            onClick={() =>
              setExpandedId(expandedId === question.id ? null : question.id)
            }
          >
            <div className="w-8 h-8 bg-[var(--bordeaux)] text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    question.type === "MULTIPLE_CHOICE"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {question.type === "MULTIPLE_CHOICE"
                    ? "Choix multiples"
                    : "Choix unique"}
                </span>
                <span className="text-xs text-[var(--gris-light)]">
                  {question.points} point{question.points > 1 ? "s" : ""}
                </span>
              </div>
              <p className="text-[var(--gris-dark)] font-medium truncate">
                {question.question}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(
                    `/admin/quiz/${quiz.id}/questions/${question.id}`
                  );
                }}
                className="p-2 text-[var(--gris-tech)] hover:text-[var(--bordeaux)] hover:bg-[var(--beige)] rounded-lg"
                title="Modifier"
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(question.id);
                }}
                disabled={deletingId === question.id}
                className="p-2 text-[var(--gris-tech)] hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                title="Supprimer"
              >
                {deletingId === question.id ? (
                  <svg
                    className="w-4 h-4 animate-spin"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                ) : (
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                )}
              </button>
              <svg
                className={`w-5 h-5 text-[var(--gris-light)] transition-transform ${
                  expandedId === question.id ? "rotate-180" : ""
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
          </div>

          {/* Expanded content */}
          {expandedId === question.id && (
            <div className="px-4 pb-4 pt-2 border-t border-[var(--beige-dark)]">
              <div className="ml-12 space-y-2">
                {question.options.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      option.isCorrect
                        ? "bg-green-50 border border-green-200"
                        : "bg-[var(--beige)]"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        option.isCorrect
                          ? "border-green-500 bg-green-500"
                          : "border-[var(--gris-light)]"
                      }`}
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
                    </div>
                    <span
                      className={
                        option.isCorrect
                          ? "text-green-700 font-medium"
                          : "text-[var(--gris-tech)]"
                      }
                    >
                      {option.text}
                    </span>
                  </div>
                ))}

                {question.explanation && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="text-xs font-medium text-blue-700 mb-1">
                      Explication
                    </div>
                    <p className="text-sm text-blue-800">
                      {question.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
