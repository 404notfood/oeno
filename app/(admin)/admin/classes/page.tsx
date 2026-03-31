import { AdminHeader } from "@/components/admin/layout";
import { getClasses, getAllEstablishments } from "@/actions/admin";
import ClassesPageClient from "./ClassesPageClient";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    establishmentId?: string;
    year?: string;
    page?: string;
  }>;
}

export default async function ClassesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const filters = {
    search: params.search,
    establishmentId: params.establishmentId,
    year: params.year,
    page,
    limit: 10,
  };

  const [result, establishments] = await Promise.all([
    getClasses(filters),
    getAllEstablishments(),
  ]);

  return (
    <>
      <AdminHeader
        title="Classes"
        description={`${result.pagination.total} classes au total`}
      />

      <div className="p-6">
        <ClassesPageClient
          classes={result.data}
          pagination={result.pagination}
          establishments={establishments}
          currentFilters={filters}
        />
      </div>
    </>
  );
}
