import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/layout";
import { getQuizById } from "@/actions/admin";
import { getBlocs } from "@/actions/admin";
import QuizForm from "../QuizForm";

interface EditQuizPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditQuizPage({ params }: EditQuizPageProps) {
  const { id } = await params;
  const [quiz, blocs] = await Promise.all([
    getQuizById(id),
    getBlocs(),
  ]);

  if (!quiz) {
    notFound();
  }

  // Map quiz to match expected interface
  const quizData = {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    blockId: quiz.blockId,
    timeLimit: quiz.timeLimit,
    passingScore: quiz.passingScore,
    shuffleQuestions: quiz.shuffleQuestions,
    showCorrection: quiz.showCorrection,
    maxAttempts: quiz.maxAttempts,
    isActive: quiz.isActive,
  };

  // Map blocs to blocks format expected by the form
  const blocks = blocs.map((b) => ({
    id: b.id,
    number: b.number,
    title: b.title,
  }));

  return (
    <>
      <AdminHeader
        title="Modifier le quiz"
        description={`Edition de "${quiz.title}"`}
      />

      <div className="p-6">
        <div className="max-w-2xl">
          <QuizForm quiz={quizData} blocks={blocks} />
        </div>
      </div>
    </>
  );
}
