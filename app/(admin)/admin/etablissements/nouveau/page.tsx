import { AdminHeader } from "@/components/admin/layout";
import EstablishmentForm from "../EstablishmentForm";

export default function NewEstablishmentPage() {
  return (
    <>
      <AdminHeader
        title="Nouvel etablissement"
        description="Creer un nouveau etablissement"
      />

      <div className="p-6">
        <div className="max-w-2xl">
          <EstablishmentForm />
        </div>
      </div>
    </>
  );
}
