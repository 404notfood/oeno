import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/layout";
import { getQuizById } from "@/actions/admin";
import QuestionManager from "./QuestionManager";

interface QuestionsPageProps {
  params: Promise<{ id: string }>;
}

export default async function QuestionsPage({ params }: QuestionsPageProps) {
  const { id } = await params;
  const quiz = await getQuizById(id);

  if (!quiz) {
    notFound();
  }

  return (
    <>
      <AdminHeader
        title={`Questions - ${quiz.title}`}
        description={`Gerez les ${quiz.questions.length} questions de ce quiz`}
      />

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-[var(--beige-dark)]">
            <div className="text-sm text-[var(--gris-light)]">Questions</div>
            <div className="text-2xl font-bold text-[var(--gris-dark)]">
              {quiz.questions.length}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[var(--beige-dark)]">
            <div className="text-sm text-[var(--gris-light)]">Points total</div>
            <div className="text-2xl font-bold text-[var(--gris-dark)]">
              {quiz.questions.reduce((sum, q) => sum + q.points, 0)}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[var(--beige-dark)]">
            <div className="text-sm text-[var(--gris-light)]">Score minimum</div>
            <div className="text-2xl font-bold text-[var(--bordeaux)]">
              {quiz.passingScore}%
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[var(--beige-dark)]">
            <div className="text-sm text-[var(--gris-light)]">Tentatives</div>
            <div className="text-2xl font-bold text-[var(--gris-dark)]">
              {quiz._count.attempts}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/admin/quiz/${quiz.id}`}
            className="btn btn-secondary"
          >
            Retour aux parametres
          </Link>
          <Link
            href={`/admin/quiz/${quiz.id}/questions/nouvelle`}
            className="btn btn-primary"
          >
            Ajouter une question
          </Link>
        </div>

        {/* Questions list */}
        <QuestionManager quiz={quiz} />
      </div>
    </>
  );
}
