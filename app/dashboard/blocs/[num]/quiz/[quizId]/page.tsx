import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import QuizPlayer from "@/components/quiz/QuizPlayer";

interface PageProps {
  params: Promise<{ num: string; quizId: string }>;
}

async function getQuizWithQuestions(quizId: string, userId: string) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      block: true,
      questions: {
        orderBy: { order: "asc" },
        include: {
          options: {
            orderBy: { order: "asc" },
          },
        },
      },
      attempts: {
        where: { userId },
        orderBy: { completedAt: "desc" },
        take: 5,
      },
    },
  });

  return quiz;
}

export default async function QuizPage({ params }: PageProps) {
  const session = await getServerSession();
  const { num, quizId } = await params;
  const blockNumber = parseInt(num);

  if (isNaN(blockNumber) || blockNumber < 1 || blockNumber > 8) {
    notFound();
  }

  const quiz = await getQuizWithQuestions(quizId, session!.user.id);

  if (!quiz || !quiz.block || quiz.block.number !== blockNumber) {
    notFound();
  }

  const lastAttempt = quiz.attempts[0];
  const hasPassed = lastAttempt?.passed || false;

  return (
    <>
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-[var(--gris-tech)]">
          <li>
            <Link href="/dashboard" className="hover:text-[var(--bordeaux)]">
              Tableau de bord
            </Link>
          </li>
          <li>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li>
            <Link href="/dashboard/blocs" className="hover:text-[var(--bordeaux)]">
              Les 8 blocs
            </Link>
          </li>
          <li>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li>
            <Link href={`/dashboard/blocs/${blockNumber}`} className="hover:text-[var(--bordeaux)]">
              Bloc {blockNumber}
            </Link>
          </li>
          <li>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li className="text-[var(--bordeaux)] font-medium">Quiz</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="card mb-6">
        <div className="flex items-start gap-4">
          <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl shrink-0 ${
            hasPassed ? "bg-[var(--success)] bg-opacity-10" : "bg-gradient-to-br from-[var(--bordeaux)] to-[var(--or)]"
          }`}>
            {hasPassed ? "✅" : "❓"}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-[var(--bordeaux)] bg-[var(--bordeaux)] bg-opacity-10 px-2 py-1 rounded-full">
                Bloc {blockNumber}
              </span>
              <span className="text-xs text-[var(--gris-light)] bg-[var(--beige)] px-2 py-1 rounded-full">
                Quiz de validation
              </span>
              {hasPassed && (
                <span className="text-xs font-medium text-[var(--success)] bg-[var(--success)] bg-opacity-10 px-2 py-1 rounded-full flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Réussi
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-[var(--gris-dark)] mb-2">
              {quiz.title}
            </h1>
            <p className="text-[var(--gris-tech)]">{quiz.description}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-[var(--gris-light)]">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {quiz.questions.length} questions
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Score min: {quiz.passingScore}%
              </span>
              {quiz.timeLimit && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {quiz.timeLimit} min
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Previous attempts */}
      {quiz.attempts.length > 0 && (
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-[var(--gris-dark)] mb-4">
            Vos tentatives précédentes
          </h2>
          <div className="space-y-2">
            {quiz.attempts.map((attempt, index) => (
              <div
                key={attempt.id}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  attempt.passed
                    ? "bg-[var(--success)] bg-opacity-10"
                    : "bg-[var(--beige)]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      attempt.passed
                        ? "bg-[var(--success)] text-white"
                        : "bg-[var(--gris-light)] text-white"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="text-sm text-[var(--gris-tech)]">
                    {attempt.completedAt
                      ? new Date(attempt.completedAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "En cours"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold ${
                      attempt.passed
                        ? "text-[var(--success)]"
                        : "text-[var(--danger)]"
                    }`}
                  >
                    {attempt.score}%
                  </span>
                  {attempt.passed ? (
                    <span className="text-xs text-[var(--success)]">Réussi</span>
                  ) : (
                    <span className="text-xs text-[var(--danger)]">Échoué</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quiz Player */}
      <QuizPlayer
        quiz={quiz}
        userId={session!.user.id}
        blockNumber={blockNumber}
      />

      {/* Navigation */}
      <div className="mt-8">
        <Link
          href={`/dashboard/blocs/${blockNumber}`}
          className="btn btn-secondary inline-flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour au Bloc {blockNumber}
        </Link>
      </div>
    </>
  );
}
