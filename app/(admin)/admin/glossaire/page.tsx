import { AdminHeader } from "@/components/admin/layout";
import { getGlossaryTerms } from "@/actions/admin";
import GlossaryTable from "./GlossaryTable";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ search?: string; category?: string; page?: string }>;
}

export default async function GlossairePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const filters = {
    search: params.search,
    category: params.category as "Viticulture" | "Vinification" | "Degustation" | "Cepage" | "Terroir" | "Service" | "Autre" | undefined,
    page,
    limit: 10,
  };

  const result = await getGlossaryTerms(filters);

  return (
    <>
      <AdminHeader
        title="Glossaire"
        description={`${result.pagination.total} termes au total`}
        actions={
          <Link href="/admin/glossaire/nouveau" className="btn btn-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouveau terme
          </Link>
        }
      />
      <div className="p-6">
        <GlossaryTable terms={result.data} pagination={result.pagination} currentFilters={filters} />
      </div>
    </>
  );
}
