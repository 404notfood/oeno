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
  options: Option[];
}

interface Quiz {
  id: string;
  title: string;
  passingScore: number;
  timeLimit: number | null;
  questions: Question[];
}

interface QuizPlayerProps {
  quiz: Quiz;
  userId: string;
  blockNumber: number;
}

export default function QuizPlayer({ quiz, userId, blockNumber }: QuizPlayerProps) {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;

  const handleStartQuiz = () => {
    setStarted(true);
    setAnswers({});
    setShowResults(false);
    setCurrentQuestionIndex(0);
  };

  const handleSelectAnswer = (optionId: string) => {
    const questionId = currentQuestion.id;
    const isMultipleChoice = currentQuestion.type === "MULTIPLE_CHOICE";

    if (isMultipleChoice) {
      // Multiple selection
      const currentAnswers = answers[questionId] || [];
      if (currentAnswers.includes(optionId)) {
        setAnswers({
          ...answers,
          [questionId]: currentAnswers.filter((a) => a !== optionId),
        });
      } else {
        setAnswers({
          ...answers,
          [questionId]: [...currentAnswers, optionId],
        });
      }
    } else {
      // Single selection
      setAnswers({
        ...answers,
        [questionId]: [optionId],
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);

    // Calculate score
    let totalPoints = 0;
    let earnedPoints = 0;

    quiz.questions.forEach((question) => {
      const userAnswerIds = answers[question.id] || [];
      const correctOptionIds = question.options
        .filter((opt) => opt.isCorrect)
        .map((opt) => opt.id);

      totalPoints += question.points;

      // Check if user selected exactly the correct options
      const isCorrect =
        userAnswerIds.length === correctOptionIds.length &&
        userAnswerIds.every((id) => correctOptionIds.includes(id));

      if (isCorrect) {
        earnedPoints += question.points;
      }
    });

    const calculatedScore = totalPoints > 0
      ? Math.round((earnedPoints / totalPoints) * 100)
      : 0;
    const hasPassed = calculatedScore >= quiz.passingScore;

    setScore(calculatedScore);
    setPassed(hasPassed);

    // Submit to API
    try {
      await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: quiz.id,
          userId,
          answers,
          score: calculatedScore,
          passed: hasPassed,
        }),
      });
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }

    setIsSubmitting(false);
    setShowResults(true);
  };

  const handleRetry = () => {
    setStarted(false);
    setShowResults(false);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setScore(0);
    setPassed(false);
  };

  // Start screen
  if (!started) {
    return (
      <div className="card text-center py-12">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[var(--bordeaux)] to-[var(--or)] rounded-2xl flex items-center justify-center text-4xl">
          ❓
        </div>
        <h2 className="text-2xl font-bold text-[var(--gris-dark)] mb-4">
          Prêt à commencer ?
        </h2>
        <p className="text-[var(--gris-tech)] mb-6 max-w-md mx-auto">
          Ce quiz contient {totalQuestions} questions. Vous devez obtenir au
          moins {quiz.passingScore}% pour valider ce bloc.
        </p>
        <button onClick={handleStartQuiz} className="btn btn-primary">
          Commencer le quiz
        </button>
      </div>
    );
  }

  // Results screen
  if (showResults) {
    return (
      <div className="card text-center py-12">
        <div
          className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center text-5xl ${
            passed
              ? "bg-[var(--success)] bg-opacity-10"
              : "bg-[var(--danger)] bg-opacity-10"
          }`}
        >
          {passed ? "🎉" : "😔"}
        </div>
        <h2 className="text-2xl font-bold text-[var(--gris-dark)] mb-2">
          {passed ? "Félicitations !" : "Dommage..."}
        </h2>
        <p className="text-[var(--gris-tech)] mb-6">
          {passed
            ? "Vous avez réussi le quiz !"
            : "Vous n'avez pas atteint le score minimum."}
        </p>

        <div
          className={`text-6xl font-bold font-cormorant mb-2 ${
            passed ? "text-[var(--success)]" : "text-[var(--danger)]"
          }`}
        >
          {score}%
        </div>
        <p className="text-sm text-[var(--gris-light)] mb-8">
          Score minimum requis: {quiz.passingScore}%
        </p>

        <div className="flex justify-center gap-4">
          {!passed && (
            <button onClick={handleRetry} className="btn btn-primary">
              Réessayer
            </button>
          )}
          <button
            onClick={() => router.push(`/dashboard/blocs/${blockNumber}`)}
            className="btn btn-secondary"
          >
            Retour au bloc
          </button>
        </div>
      </div>
    );
  }

  // Quiz player
  const currentAnswers = answers[currentQuestion.id] || [];
  const isAnswered = currentAnswers.length > 0;
  const isMultipleChoice = currentQuestion.type === "MULTIPLE_CHOICE";

  return (
    <div className="card">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-[var(--gris-light)]">
            Question {currentQuestionIndex + 1} sur {totalQuestions}
          </span>
          <span className="font-medium text-[var(--bordeaux)]">
            {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-[var(--beige)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--bordeaux)] to-[var(--or)] rounded-full transition-all"
            style={{
              width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <div className="flex items-start gap-3 mb-6">
          <span className="w-8 h-8 bg-[var(--bordeaux)] text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
            {currentQuestionIndex + 1}
          </span>
          <h3 className="text-lg font-medium text-[var(--gris-dark)]">
            {currentQuestion.question}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option) => {
            const isSelected = currentAnswers.includes(option.id);

            return (
              <button
                key={option.id}
                onClick={() => handleSelectAnswer(option.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? "border-[var(--bordeaux)] bg-[var(--bordeaux)] bg-opacity-5"
                    : "border-[var(--beige-dark)] hover:border-[var(--bordeaux)] hover:bg-[var(--beige)]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 ${isMultipleChoice ? "rounded" : "rounded-full"} border-2 flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "border-[var(--bordeaux)] bg-[var(--bordeaux)]"
                        : "border-[var(--gris-light)]"
                    }`}
                  >
                    {isSelected && (
                      <svg
                        className="w-4 h-4 text-white"
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
                  <span className="text-[var(--gris-dark)]">{option.text}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Question type hint */}
        {isMultipleChoice && (
          <p className="text-sm text-[var(--gris-light)] mt-4">
            Plusieurs réponses possibles
          </p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-[var(--beige-dark)]">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="btn btn-secondary disabled:opacity-50"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Précédent
        </button>

        {currentQuestionIndex === totalQuestions - 1 ? (
          <button
            onClick={handleSubmitQuiz}
            disabled={!isAnswered || isSubmitting}
            className="btn btn-primary disabled:opacity-50"
          >
            {isSubmitting ? (
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
                Envoi...
              </>
            ) : (
              <>
                Terminer le quiz
                <svg
                  className="w-4 h-4 ml-2"
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
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            disabled={!isAnswered}
            className="btn btn-primary disabled:opacity-50"
          >
            Suivant
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Question dots */}
      <div className="mt-6 flex justify-center gap-2 flex-wrap">
        {quiz.questions.map((q, index) => (
          <button
            key={q.id}
            onClick={() => setCurrentQuestionIndex(index)}
            className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${
              index === currentQuestionIndex
                ? "bg-[var(--bordeaux)] text-white"
                : answers[q.id]?.length > 0
                ? "bg-[var(--success)] text-white"
                : "bg-[var(--beige)] text-[var(--gris-light)] hover:bg-[var(--beige-dark)]"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
