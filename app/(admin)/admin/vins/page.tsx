import { AdminHeader } from "@/components/admin/layout";
import { getWines } from "@/actions/admin";
import WinesPageClient from "./WinesPageClient";

interface PageProps {
  searchParams: Promise<{ search?: string; type?: string; color?: string; page?: string }>;
}

export default async function WinesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const filters = {
    search: params.search,
    type: params.type as "STILL" | "SPARKLING" | "FORTIFIED" | "SWEET" | undefined,
    color: params.color as "WHITE" | "RED" | "ROSE" | "ORANGE" | undefined,
    page,
    limit: 10,
  };

  const result = await getWines(filters);

  return (
    <>
      <AdminHeader
        title="Vins"
        description={`${result.pagination.total} vins au total`}
      />
      <div className="p-6">
        <WinesPageClient
          wines={result.data}
          pagination={result.pagination}
          currentFilters={filters}
        />
      </div>
    </>
  );
}
