import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/layout";
import { getUserById, getAllEstablishments } from "@/actions/admin";
import UserForm from "../UserForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({ params }: PageProps) {
  const { id } = await params;

  const [user, establishments] = await Promise.all([
    getUserById(id).catch(() => null),
    getAllEstablishments().catch(() => []),
  ]);

  if (!user) {
    notFound();
  }

  return (
    <>
      <AdminHeader
        title="Modifier l&apos;utilisateur"
        description={`${user.firstName} ${user.lastName}`}
      />

      <div className="p-6">
        <div className="max-w-2xl">
          <UserForm user={user} establishments={establishments} />
        </div>
      </div>
    </>
  );
}
