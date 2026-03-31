import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/layout";
import { getActivityById, getBlocById } from "@/actions/admin";
import ActivityForm from "../ActivityForm";

interface EditActivityPageProps {
  params: Promise<{ id: string; activityId: string }>;
}

export default async function EditActivityPage({ params }: EditActivityPageProps) {
  const { id, activityId } = await params;
  const [bloc, activity] = await Promise.all([
    getBlocById(id),
    getActivityById(activityId),
  ]);

  if (!bloc || !activity) {
    notFound();
  }

  return (
    <>
      <AdminHeader
        title="Modifier l'activite"
        description={`Edition de "${activity.title}"`}
      />

      <div className="p-6">
        <div className="max-w-2xl">
          <ActivityForm activity={activity} blockId={id} />
        </div>
      </div>
    </>
  );
}
