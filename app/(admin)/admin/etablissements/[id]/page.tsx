import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/layout";
import { getEstablishmentById } from "@/actions/admin";
import EstablishmentForm from "../EstablishmentForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEstablishmentPage({ params }: PageProps) {
  const { id } = await params;

  const establishment = await getEstablishmentById(id).catch(() => null);

  if (!establishment) {
    notFound();
  }

  return (
    <>
      <AdminHeader
        title="Modifier l&apos;etablissement"
        description={establishment.name}
      />

      <div className="p-6">
        <div className="max-w-2xl">
          <EstablishmentForm establishment={establishment} />
        </div>
      </div>
    </>
  );
}
