import { AdminHeader } from "@/components/admin/layout";
import { getAllEstablishments } from "@/actions/admin";
import UserForm from "../UserForm";

export default async function NewUserPage() {
  const establishments = await getAllEstablishments();

  return (
    <>
      <AdminHeader
        title="Nouvel utilisateur"
        description="Creer un nouveau compte utilisateur"
      />

      <div className="p-6">
        <div className="max-w-2xl">
          <UserForm establishments={establishments} />
        </div>
      </div>
    </>
  );
}
