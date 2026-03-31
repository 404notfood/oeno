"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTable, Badge, SearchInput, ExportButton } from "@/components/admin/ui";
import type { Column } from "@/components/admin/ui/DataTable";
import type { JsonValue } from "@prisma/client/runtime/library";

interface AuditLog {
  id: string;
  action: string;
  entityType: string | null;
  entityId: string | null;
  oldValues: JsonValue;
  newValues: JsonValue;
  ipAddress: string | null;
  createdAt: Date;
  user: { id: string; email: string; firstName: string; lastName: string } | null;
}

interface LogsTableProps {
  logs: AuditLog[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
  actions: string[];
  entityTypes: string[];
  currentFilters: { search?: string; action?: string; entityType?: string; page: number };
}

const actionColors: Record<string, "success" | "danger" | "info" | "warning" | "default"> = {
  CREATE: "success",
  UPDATE: "info",
  DELETE: "danger",
  LOGIN: "success",
  LOGOUT: "default",
  ASSIGN_TEACHER: "info",
  REMOVE_TEACHER: "warning",
  ASSIGN_STUDENTS: "info",
  REMOVE_STUDENT: "warning",
  UPDATE_ROLE: "warning",
  REORDER: "info",
};

export default function LogsTable({ logs, pagination, actions, entityTypes, currentFilters }: LogsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilters = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      if (!updates.page) params.delete("page");
      router.push(`/admin/logs?${params.toString()}`);
    },
    [router, searchParams]
  );

  const columns: Column<AuditLog>[] = [
    {
      key: "createdAt",
      header: "Date",
      render: (log) => (
        <span className="text-sm text-gris-tech">
          {new Date(log.createdAt).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      key: "user",
      header: "Utilisateur",
      render: (log) => (
        <div>
          {log.user ? (
            <>
              <p className="text-sm font-medium text-gris-dark">
                {log.user.firstName} {log.user.lastName}
              </p>
              <p className="text-xs text-gris-tech">{log.user.email}</p>
            </>
          ) : (
            <span className="text-sm text-gris-light italic">Systeme</span>
          )}
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      render: (log) => (
        <Badge variant={actionColors[log.action] || "default"}>{log.action}</Badge>
      ),
    },
    {
      key: "entityType",
      header: "Entite",
      render: (log) => (
        <div>
          <span className="text-sm text-gris-tech">{log.entityType || "-"}</span>
          {log.entityId && (
            <p className="text-xs text-gris-light font-mono">{log.entityId.slice(0, 8)}...</p>
          )}
        </div>
      ),
    },
    {
      key: "details",
      header: "Details",
      render: (log) => (
        <div className="max-w-xs">
          {log.newValues && (
            <p className="text-xs text-gris-tech truncate">
              {JSON.stringify(log.newValues).slice(0, 50)}...
            </p>
          )}
        </div>
      ),
    },
    {
      key: "ipAddress",
      header: "IP",
      render: (log) => (
        <span className="text-xs text-gris-light font-mono">
          {log.ipAddress || "-"}
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-4">
        <SearchInput
          value={currentFilters.search}
          onChange={(s) => updateFilters({ search: s || undefined })}
          placeholder="Rechercher..."
          className="w-64"
        />
        <select
          value={currentFilters.action || ""}
          onChange={(e) => updateFilters({ action: e.target.value || undefined })}
          className="rounded-lg border border-beige-dark bg-white px-3 py-2 text-sm"
        >
          <option value="">Toutes les actions</option>
          {actions.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <select
          value={currentFilters.entityType || ""}
          onChange={(e) => updateFilters({ entityType: e.target.value || undefined })}
          className="rounded-lg border border-beige-dark bg-white px-3 py-2 text-sm"
        >
          <option value="">Tous les types</option>
          {entityTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <div className="ml-auto">
          <ExportButton
            endpoint="/api/admin/export/logs"
            params={{
              search: currentFilters.search,
              action: currentFilters.action,
              entityType: currentFilters.entityType,
            }}
            label="Exporter"
          />
        </div>
      </div>

      <DataTable
        data={logs}
        columns={columns}
        keyExtractor={(log) => log.id}
        pagination={{
          currentPage: pagination.page,
          totalPages: pagination.totalPages,
          totalItems: pagination.total,
          itemsPerPage: pagination.limit,
          onPageChange: (p) => updateFilters({ page: p.toString() }),
        }}
        emptyMessage="Aucun log trouve"
      />
    </>
  );
}
