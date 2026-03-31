import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/layout";
import { getGrapeVarietyById } from "@/actions/admin";
import GrapeForm from "../GrapeForm";

interface EditGrapePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGrapePage({ params }: EditGrapePageProps) {
  const { id } = await params;
  const grape = await getGrapeVarietyById(id);

  if (!grape) {
    notFound();
  }

  return (
    <>
      <AdminHeader
        title="Modifier le cepage"
        description={`Edition de "${grape.name}"`}
      />

      <div className="p-6">
        <div className="max-w-2xl">
          <GrapeForm grape={grape} />
        </div>
      </div>
    </>
  );
}
