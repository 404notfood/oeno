import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/layout";
import { getBlocById } from "@/actions/admin";
import ActivityForm from "../ActivityForm";

interface NewActivityPageProps {
  params: Promise<{ id: string }>;
}

export default async function NewActivityPage({ params }: NewActivityPageProps) {
  const { id } = await params;
  const bloc = await getBlocById(id);

  if (!bloc) {
    notFound();
  }

  return (
    <>
      <AdminHeader
        title="Nouvelle activite"
        description={`Ajouter une activite au bloc ${bloc.number} - ${bloc.title}`}
      />

      <div className="p-6">
        <div className="max-w-2xl">
          <ActivityForm blockId={id} />
        </div>
      </div>
    </>
  );
}
