import { AdminHeader } from "@/components/admin/layout";
import { getAllEstablishments } from "@/actions/admin";
import ClassForm from "../ClassForm";

export default async function NewClassPage() {
  const establishments = await getAllEstablishments();

  return (
    <>
      <AdminHeader
        title="Nouvelle classe"
        description="Creer une nouvelle classe"
      />

      <div className="p-6">
        <div className="max-w-2xl">
          <ClassForm establishments={establishments} />
        </div>
      </div>
    </>
  );
}
