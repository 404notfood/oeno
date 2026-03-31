import { AdminHeader } from "@/components/admin/layout";
import { getEstablishments } from "@/actions/admin";
import EstablishmentsTable from "./EstablishmentsTable";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    region?: string;
    isActive?: string;
    page?: string;
  }>;
}

export default async function EstablishmentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const filters = {
    search: params.search,
    region: params.region,
    isActive: params.isActive === "true" ? true : params.isActive === "false" ? false : undefined,
    page,
    limit: 10,
  };

  const result = await getEstablishments(filters);

  return (
    <>
      <AdminHeader
        title="Etablissements"
        description={`${result.pagination.total} etablissements au total`}
        actions={
          <Link href="/admin/etablissements/nouveau" className="btn btn-primary">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nouvel etablissement
          </Link>
        }
      />

      <div className="p-6">
        <EstablishmentsTable
          establishments={result.data}
          pagination={result.pagination}
          currentFilters={filters}
        />
      </div>
    </>
  );
}
