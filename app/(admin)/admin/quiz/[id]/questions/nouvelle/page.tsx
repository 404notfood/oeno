import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/layout";
import { getQuizById } from "@/actions/admin";
import QuestionForm from "./QuestionForm";

interface NouvelleQuestionPageProps {
  params: Promise<{ id: string }>;
}

export default async function NouvelleQuestionPage({
  params,
}: NouvelleQuestionPageProps) {
  const { id } = await params;
  const quiz = await getQuizById(id);

  if (!quiz) {
    notFound();
  }

  return (
    <>
      <AdminHeader
        title="Nouvelle question"
        description={`Ajouter une question au quiz "${quiz.title}"`}
      />

      <div className="p-6">
        <div className="max-w-3xl">
          <QuestionForm quizId={quiz.id} nextOrder={quiz.questions.length + 1} />
        </div>
      </div>
    </>
  );
}
