import { AdminHeader } from "@/components/admin/layout";
import AppellationForm from "../AppellationForm";

export default function NewAppellationPage() {
  return (
    <>
      <AdminHeader
        title="Nouvelle appellation"
        description="Ajouter une appellation au referentiel"
      />

      <div className="p-6">
        <div className="max-w-2xl">
          <AppellationForm />
        </div>
      </div>
    </>
  );
}
