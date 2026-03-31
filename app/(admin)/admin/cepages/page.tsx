import { AdminHeader } from "@/components/admin/layout";
import { getGrapeVarieties } from "@/actions/admin";
import { Badge, ExportButton } from "@/components/admin/ui";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ search?: string; color?: string; page?: string }>;
}

const colorLabels: Record<string, { label: string; variant: "info" | "danger" | "or" | "warning" }> = {
  WHITE: { label: "Blanc", variant: "or" },
  RED: { label: "Rouge", variant: "danger" },
  ROSE: { label: "Rose", variant: "warning" },
  ORANGE: { label: "Orange", variant: "or" },
};

export default async function CepagesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const filters = {
    search: params.search,
    color: params.color as "WHITE" | "RED" | "ROSE" | "ORANGE" | undefined,
    page,
    limit: 10,
  };

  const result = await getGrapeVarieties(filters);

  return (
    <>
      <AdminHeader
        title="Cepages"
        description={`${result.pagination.total} cepages au total`}
        actions={
          <div className="flex items-center gap-3">
            <ExportButton
              endpoint="/api/admin/export/grapes"
              params={{
                search: params.search,
                color: params.color,
              }}
              label="Exporter"
            />
            <Link href="/admin/cepages/nouveau" className="btn btn-primary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nouveau cepage
            </Link>
          </div>
        }
      />
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-beige-dark overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-beige-dark bg-beige/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gris-tech">Cepage</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gris-tech">Couleur</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gris-tech">Origine</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gris-tech">Vins</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gris-tech">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-dark">
              {result.data.map((grape) => {
                const c = colorLabels[grape.color];
                return (
                  <tr key={grape.id} className="hover:bg-beige/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gris-dark">{grape.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={c?.variant || "default"}>{c?.label || grape.color}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gris-tech">{grape.origin || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gris-tech">{grape._count.wines}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/cepages/${grape.id}`}
                        className="p-1.5 text-gris-tech hover:text-bordeaux hover:bg-beige rounded-lg transition-colors inline-flex"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {result.data.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-gris-tech">
                    Aucun cepage trouve
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
