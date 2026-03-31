import { AdminHeader } from "@/components/admin/layout";
import { getAuditLogs, getAuditLogActions, getAuditLogEntityTypes } from "@/actions/admin";
import LogsTable from "./LogsTable";

interface PageProps {
  searchParams: Promise<{ search?: string; action?: string; entityType?: string; page?: string }>;
}

export default async function LogsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const filters = {
    search: params.search,
    action: params.action,
    entityType: params.entityType,
    page,
    limit: 20,
  };

  const [result, actions, entityTypes] = await Promise.all([
    getAuditLogs(filters),
    getAuditLogActions(),
    getAuditLogEntityTypes(),
  ]);

  return (
    <>
      <AdminHeader
        title="Logs d'audit"
        description={`${result.pagination.total} entrees au total`}
      />
      <div className="p-6">
        <LogsTable
          logs={result.data}
          pagination={result.pagination}
          actions={actions}
          entityTypes={entityTypes}
          currentFilters={filters}
        />
      </div>
    </>
  );
}
