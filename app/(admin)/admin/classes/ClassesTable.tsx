"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { DataTable, StatusBadge, ConfirmDialog, SearchInput, ExportButton } from "@/components/admin/ui";
import type { Column } from "@/components/admin/ui/DataTable";
import { deleteClass } from "@/actions/admin";

interface ClassGroup {
  id: string;
  name: string;
  year: string;
  level: string | null;
  isActive: boolean;
  establishment: { id: string; name: string };
  _count: { students: number; teachers: number };
}

interface Establishment {
  id: string;
  name: string;
}

interface ClassesTableProps {
  classes: ClassGroup[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  establishments: Establishment[];
  currentFilters: {
    search?: string;
    establishmentId?: string;
    year?: string;
    page: number;
  };
}

export default function ClassesTable({
  classes,
  pagination,
  establishments,
  currentFilters,
}: ClassesTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const updateFilters = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      if (!updates.page) params.delete("page");
      router.push(`/admin/classes?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteClass(deleteId);
      setDeleteId(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<ClassGroup>[] = [
    {
      key: "name",
      header: "Classe",
      render: (c) => (
        <div>
          <p className="font-medium text-gris-dark">{c.name}</p>
          <p className="text-xs text-gris-tech">{c.level || "Sans niveau"}</p>
        </div>
      ),
    },
    {
      key: "year",
      header: "Annee",
      render: (c) => <span className="text-sm text-gris-tech">{c.year}</span>,
    },
    {
      key: "establishment",
      header: "Etablissement",
      render: (c) => <span className="text-sm text-gris-tech">{c.establishment.name}</span>,
    },
    {
      key: "students",
      header: "Eleves",
      render: (c) => <span className="text-sm text-gris-tech">{c._count.students}</span>,
    },
    {
      key: "teachers",
      header: "Enseignants",
      render: (c) => <span className="text-sm text-gris-tech">{c._count.teachers}</span>,
    },
    {
      key: "isActive",
      header: "Statut",
      render: (c) => <StatusBadge isActive={c.isActive} />,
    },
  ];

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-4">
        <SearchInput
          value={currentFilters.search}
          onChange={(s) => updateFilters({ search: s || undefined })}
          placeholder="Rechercher une classe..."
          className="w-64"
        />
        <select
          value={currentFilters.establishmentId || ""}
          onChange={(e) => updateFilters({ establishmentId: e.target.value || undefined })}
          className="rounded-lg border border-beige-dark bg-white px-3 py-2 text-sm"
        >
          <option value="">Tous les etablissements</option>
          {establishments.map((est) => (
            <option key={est.id} value={est.id}>{est.name}</option>
          ))}
        </select>
        <div className="ml-auto">
          <ExportButton
            endpoint="/api/admin/export/classes"
            params={{
              search: currentFilters.search,
              establishmentId: currentFilters.establishmentId,
              year: currentFilters.year,
            }}
            label="Exporter"
          />
        </div>
      </div>

      <DataTable
        data={classes}
        columns={columns}
        keyExtractor={(c) => c.id}
        pagination={{
          currentPage: pagination.page,
          totalPages: pagination.totalPages,
          totalItems: pagination.total,
          itemsPerPage: pagination.limit,
          onPageChange: (p) => updateFilters({ page: p.toString() }),
        }}
        actions={(c) => (
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/classes/${c.id}`}
              className="p-1.5 text-gris-tech hover:text-bordeaux hover:bg-beige rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
            <button
              onClick={() => setDeleteId(c.id)}
              className="p-1.5 text-gris-tech hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
        emptyMessage="Aucune classe trouvee"
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Supprimer la classe"
        message="Etes-vous sur de vouloir supprimer cette classe ?"
        confirmText="Supprimer"
        variant="danger"
        loading={isDeleting}
      />
    </>
  );
}
