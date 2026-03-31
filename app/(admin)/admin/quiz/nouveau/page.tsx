import { AdminHeader } from "@/components/admin/layout";
import { getBlocs } from "@/actions/admin";
import QuizForm from "../QuizForm";

export default async function NewQuizPage() {
  const blocs = await getBlocs();

  // Map blocs to blocks format expected by the form
  const blocks = blocs.map((b) => ({
    id: b.id,
    number: b.number,
    title: b.title,
  }));

  return (
    <>
      <AdminHeader
        title="Nouveau quiz"
        description="Creer un nouveau quiz"
      />

      <div className="p-6">
        <div className="max-w-2xl">
          <QuizForm blocks={blocks} />
        </div>
      </div>
    </>
  );
}
