import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/layout";
import { getClassById, getAllEstablishments } from "@/actions/admin";
import ClassForm from "../ClassForm";

interface EditClassPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditClassPage({ params }: EditClassPageProps) {
  const { id } = await params;
  const [classGroup, establishments] = await Promise.all([
    getClassById(id),
    getAllEstablishments(),
  ]);

  if (!classGroup) {
    notFound();
  }

  return (
    <>
      <AdminHeader
        title="Modifier la classe"
        description={`Edition de ${classGroup.name}`}
      />

      <div className="p-6">
        <div className="max-w-2xl">
          <ClassForm classGroup={classGroup} establishments={establishments} />
        </div>
      </div>
    </>
  );
}
