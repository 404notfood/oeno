import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/layout";
import { getGlossaryTermById } from "@/actions/admin";
import GlossaryForm from "../GlossaryForm";

interface EditGlossaryTermPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGlossaryTermPage({ params }: EditGlossaryTermPageProps) {
  const { id } = await params;
  const glossaryTerm = await getGlossaryTermById(id);

  if (!glossaryTerm) {
    notFound();
  }

  return (
    <>
      <AdminHeader
        title="Modifier le terme"
        description={`Edition de "${glossaryTerm.term}"`}
      />

      <div className="p-6">
        <div className="max-w-2xl">
          <GlossaryForm glossaryTerm={glossaryTerm} />
        </div>
      </div>
    </>
  );
}
