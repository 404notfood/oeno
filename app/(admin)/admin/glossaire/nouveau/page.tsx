import { AdminHeader } from "@/components/admin/layout";
import GlossaryForm from "../GlossaryForm";

export default function NewGlossaryTermPage() {
  return (
    <>
      <AdminHeader
        title="Nouveau terme"
        description="Ajouter un terme au glossaire"
      />

      <div className="p-6">
        <div className="max-w-2xl">
          <GlossaryForm />
        </div>
      </div>
    </>
  );
}
