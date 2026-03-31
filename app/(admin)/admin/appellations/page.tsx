import { AdminHeader } from "@/components/admin/layout";
import { getAppellations } from "@/actions/admin";
import { Badge, ExportButton } from "@/components/admin/ui";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ search?: string; type?: string; page?: string }>;
}

const typeLabels: Record<string, { label: string; variant: "success" | "info" | "default" }> = {
  AOP: { label: "AOP", variant: "success" },
  IGP: { label: "IGP", variant: "info" },
  VDF: { label: "VDF", variant: "default" },
};

export default async function AppellationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const filters = {
    search: params.search,
    type: params.type as "AOP" | "IGP" | "VDF" | undefined,
    page,
    limit: 10,
  };

  const result = await getAppellations(filters);

  return (
    <>
      <AdminHeader
        title="Appellations"
        description={`${result.pagination.total} appellations au total`}
        actions={
          <div className="flex items-center gap-3">
            <ExportButton
              endpoint="/api/admin/export/appellations"
              params={{
                search: params.search,
                type: params.type,
              }}
              label="Exporter"
            />
            <Link href="/admin/appellations/nouvelle" className="btn btn-primary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nouvelle appellation
            </Link>
          </div>
        }
      />
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-beige-dark overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-beige-dark bg-beige/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gris-tech">Appellation</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gris-tech">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gris-tech">Region</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gris-tech">Vins</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gris-tech">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-dark">
              {result.data.map((app) => {
                const t = typeLabels[app.type];
                return (
                  <tr key={app.id} className="hover:bg-beige/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gris-dark">{app.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={t?.variant || "default"}>{t?.label || app.type}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gris-tech">{app.region}</td>
                    <td className="px-4 py-3 text-sm text-gris-tech">{app._count.wines}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/appellations/${app.id}`}
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
                    Aucune appellation trouvee
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
