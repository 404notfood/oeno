import { AdminHeader } from "@/components/admin/layout";
import GrapeForm from "../GrapeForm";

export default function NewGrapePage() {
  return (
    <>
      <AdminHeader
        title="Nouveau cepage"
        description="Ajouter un cepage au referentiel"
      />

      <div className="p-6">
        <div className="max-w-2xl">
          <GrapeForm />
        </div>
      </div>
    </>
  );
}
