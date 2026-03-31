import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/layout";
import { getQuizById } from "@/actions/admin";
import { prisma } from "@/lib/prisma";
import QuestionForm from "../nouvelle/QuestionForm";

interface EditQuestionPageProps {
  params: Promise<{ id: string; questionId: string }>;
}

export default async function EditQuestionPage({
  params,
}: EditQuestionPageProps) {
  const { id, questionId } = await params;
  const quiz = await getQuizById(id);

  if (!quiz) {
    notFound();
  }

  const question = await prisma.quizQuestion.findUnique({
    where: { id: questionId },
    include: {
      options: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!question || question.quizId !== id) {
    notFound();
  }

  return (
    <>
      <AdminHeader
        title="Modifier la question"
        description={`Quiz "${quiz.title}"`}
      />

      <div className="p-6">
        <div className="max-w-3xl">
          <QuestionForm
            quizId={quiz.id}
            nextOrder={question.order}
            initialData={{
              id: question.id,
              question: question.question,
              type: question.type,
              explanation: question.explanation,
              points: question.points,
              options: question.options,
            }}
          />
        </div>
      </div>
    </>
  );
}
