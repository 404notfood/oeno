import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/layout";
import { getAppellationById } from "@/actions/admin";
import AppellationForm from "../AppellationForm";

interface EditAppellationPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAppellationPage({ params }: EditAppellationPageProps) {
  const { id } = await params;
  const appellation = await getAppellationById(id);

  if (!appellation) {
    notFound();
  }

  return (
    <>
      <AdminHeader
        title="Modifier l'appellation"
        description={`Edition de "${appellation.name}"`}
      />

      <div className="p-6">
        <div className="max-w-2xl">
          <AppellationForm appellation={appellation} />
        </div>
      </div>
    </>
  );
}
