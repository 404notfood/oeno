"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { DataTable, StatusBadge, ConfirmDialog, SearchInput, ExportButton } from "@/components/admin/ui";
import type { Column } from "@/components/admin/ui/DataTable";
import { deleteEstablishment } from "@/actions/admin";

interface Establishment {
  id: string;
  uai: string;
  name: string;
  city: string | null;
  region: string | null;
  isActive: boolean;
  _count: { users: number; classes: number };
}

interface EstablishmentsTableProps {
  establishments: Establishment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  currentFilters: {
    search?: string;
    region?: string;
    isActive?: boolean;
    page: number;
  };
}

export default function EstablishmentsTable({
  establishments,
  pagination,
  currentFilters,
}: EstablishmentsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const updateFilters = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      if (!updates.page) {
        params.delete("page");
      }

      router.push(`/admin/etablissements?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearch = useCallback(
    (search: string) => {
      updateFilters({ search: search || undefined });
    },
    [updateFilters]
  );

  const handleStatusFilter = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateFilters({ isActive: e.target.value || undefined });
    },
    [updateFilters]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateFilters({ page: page.toString() });
    },
    [updateFilters]
  );

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await deleteEstablishment(deleteId);
      setDeleteId(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Establishment>[] = [
    {
      key: "name",
      header: "Etablissement",
      render: (est) => (
        <div>
          <p className="font-medium text-gris-dark">{est.name}</p>
          <p className="text-xs text-gris-tech">UAI: {est.uai}</p>
        </div>
      ),
    },
    {
      key: "city",
      header: "Localisation",
      render: (est) => (
        <span className="text-sm text-gris-tech">
          {est.city ? `${est.city}${est.region ? `, ${est.region}` : ""}` : "-"}
        </span>
      ),
    },
    {
      key: "users",
      header: "Utilisateurs",
      render: (est) => (
        <span className="text-sm text-gris-tech">{est._count.users}</span>
      ),
    },
    {
      key: "classes",
      header: "Classes",
      render: (est) => (
        <span className="text-sm text-gris-tech">{est._count.classes}</span>
      ),
    },
    {
      key: "isActive",
      header: "Statut",
      render: (est) => <StatusBadge isActive={est.isActive} />,
    },
  ];

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-4">
        <SearchInput
          value={currentFilters.search}
          onChange={handleSearch}
          placeholder="Rechercher un etablissement..."
          className="w-64"
        />
        <select
          value={
            currentFilters.isActive === true
              ? "true"
              : currentFilters.isActive === false
                ? "false"
                : ""
          }
          onChange={handleStatusFilter}
          className="rounded-lg border border-beige-dark bg-white px-3 py-2 text-sm focus:border-bordeaux focus:outline-none"
        >
          <option value="">Tous les statuts</option>
          <option value="true">Actifs</option>
          <option value="false">Inactifs</option>
        </select>
        <div className="ml-auto">
          <ExportButton
            endpoint="/api/admin/export/establishments"
            params={{
              search: currentFilters.search,
              region: currentFilters.region,
              isActive: currentFilters.isActive?.toString(),
            }}
            label="Exporter"
          />
        </div>
      </div>

      <DataTable
        data={establishments}
        columns={columns}
        keyExtractor={(est) => est.id}
        pagination={{
          currentPage: pagination.page,
          totalPages: pagination.totalPages,
          totalItems: pagination.total,
          itemsPerPage: pagination.limit,
          onPageChange: handlePageChange,
        }}
        actions={(est) => (
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/etablissements/${est.id}`}
              className="p-1.5 text-gris-tech hover:text-bordeaux hover:bg-beige rounded-lg transition-colors"
              title="Modifier"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </Link>
            <button
              onClick={() => setDeleteId(est.id)}
              disabled={est._count.users > 0 || est._count.classes > 0}
              className="p-1.5 text-gris-tech hover:text-danger hover:bg-danger/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={
                est._count.users > 0 || est._count.classes > 0
                  ? "Impossible de supprimer"
                  : "Supprimer"
              }
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        )}
        emptyMessage="Aucun etablissement trouve"
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Supprimer l'etablissement"
        message="Etes-vous sur de vouloir supprimer cet etablissement ? Cette action est irreversible."
        confirmText="Supprimer"
        variant="danger"
        loading={isDeleting}
      />
    </>
  );
}
