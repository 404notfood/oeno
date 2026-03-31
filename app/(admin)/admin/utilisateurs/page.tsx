import { AdminHeader } from "@/components/admin/layout";
import { getUsers, getAllEstablishments } from "@/actions/admin";
import UsersPageClient from "./UsersPageClient";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    role?: string;
    establishmentId?: string;
    page?: string;
  }>;
}

export default async function UsersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const filters = {
    search: params.search,
    role: params.role as "STUDENT" | "TEACHER" | "ADMIN" | "SUPER_ADMIN" | undefined,
    establishmentId: params.establishmentId,
    page,
    limit: 10,
  };

  const [usersResult, establishments] = await Promise.all([
    getUsers(filters),
    getAllEstablishments(),
  ]);

  return (
    <>
      <AdminHeader
        title="Utilisateurs"
        description={`${usersResult.pagination.total} utilisateurs au total`}
      />

      <div className="p-6">
        <UsersPageClient
          users={usersResult.data}
          pagination={usersResult.pagination}
          establishments={establishments}
          currentFilters={filters}
        />
      </div>
    </>
  );
}
