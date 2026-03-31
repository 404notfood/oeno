"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { DataTable, Badge, ConfirmDialog, SearchInput, ExportButton } from "@/components/admin/ui";
import type { Column } from "@/components/admin/ui/DataTable";
import { deleteWine } from "@/actions/admin";

interface Wine {
  id: string;
  name: string;
  vintage: number | null;
  type: string;
  color: string;
  region: string | null;
  appellation: { id: string; name: string; type: string } | null;
  _count: { tastings: number };
}

interface WinesTableProps {
  wines: Wine[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
  currentFilters: { search?: string; type?: string; color?: string; page: number };
}

const typeLabels: Record<string, string> = {
  STILL: "Tranquille",
  SPARKLING: "Effervescent",
  FORTIFIED: "Fortifie",
  SWEET: "Liquoreux",
};

const colorLabels: Record<string, { label: string; variant: "info" | "danger" | "or" | "warning" }> = {
  WHITE: { label: "Blanc", variant: "or" },
  RED: { label: "Rouge", variant: "danger" },
  ROSE: { label: "Rose", variant: "warning" },
  ORANGE: { label: "Orange", variant: "or" },
};

export default function WinesTable({ wines, pagination, currentFilters }: WinesTableProps) {
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
      router.push(`/admin/vins?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteWine(deleteId);
      setDeleteId(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Wine>[] = [
    {
      key: "name",
      header: "Vin",
      render: (w) => (
        <div>
          <p className="font-medium text-gris-dark">{w.name}</p>
          {w.vintage && <p className="text-xs text-gris-tech">Millesime {w.vintage}</p>}
        </div>
      ),
    },
    {
      key: "color",
      header: "Couleur",
      render: (w) => {
        const c = colorLabels[w.color];
        return <Badge variant={c?.variant || "default"}>{c?.label || w.color}</Badge>;
      },
    },
    {
      key: "type",
      header: "Type",
      render: (w) => <span className="text-sm text-gris-tech">{typeLabels[w.type] || w.type}</span>,
    },
    {
      key: "region",
      header: "Region",
      render: (w) => <span className="text-sm text-gris-tech">{w.region || "-"}</span>,
    },
    {
      key: "appellation",
      header: "Appellation",
      render: (w) => (
        <span className="text-sm text-gris-tech">
          {w.appellation ? `${w.appellation.name} (${w.appellation.type})` : "-"}
        </span>
      ),
    },
    {
      key: "tastings",
      header: "Degustations",
      render: (w) => <span className="text-sm text-gris-tech">{w._count.tastings}</span>,
    },
  ];

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-4">
        <SearchInput
          value={currentFilters.search}
          onChange={(s) => updateFilters({ search: s || undefined })}
          placeholder="Rechercher un vin..."
          className="w-64"
        />
        <select
          value={currentFilters.color || ""}
          onChange={(e) => updateFilters({ color: e.target.value || undefined })}
          className="rounded-lg border border-beige-dark bg-white px-3 py-2 text-sm"
        >
          <option value="">Toutes les couleurs</option>
          <option value="WHITE">Blanc</option>
          <option value="RED">Rouge</option>
          <option value="ROSE">Rose</option>
          <option value="ORANGE">Orange</option>
        </select>
        <select
          value={currentFilters.type || ""}
          onChange={(e) => updateFilters({ type: e.target.value || undefined })}
          className="rounded-lg border border-beige-dark bg-white px-3 py-2 text-sm"
        >
          <option value="">Tous les types</option>
          <option value="STILL">Tranquille</option>
          <option value="SPARKLING">Effervescent</option>
          <option value="FORTIFIED">Fortifie</option>
          <option value="SWEET">Liquoreux</option>
        </select>
        <div className="ml-auto">
          <ExportButton
            endpoint="/api/admin/export/wines"
            params={{
              search: currentFilters.search,
              color: currentFilters.color,
              type: currentFilters.type,
            }}
            label="Exporter"
          />
        </div>
      </div>

      <DataTable
        data={wines}
        columns={columns}
        keyExtractor={(w) => w.id}
        pagination={{
          currentPage: pagination.page,
          totalPages: pagination.totalPages,
          totalItems: pagination.total,
          itemsPerPage: pagination.limit,
          onPageChange: (p) => updateFilters({ page: p.toString() }),
        }}
        actions={(w) => (
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/vins/${w.id}`}
              className="p-1.5 text-gris-tech hover:text-bordeaux hover:bg-beige rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
            <button
              onClick={() => setDeleteId(w.id)}
              disabled={w._count.tastings > 0}
              className="p-1.5 text-gris-tech hover:text-danger hover:bg-danger/10 rounded-lg transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
        emptyMessage="Aucun vin trouve"
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Supprimer le vin"
        message="Etes-vous sur de vouloir supprimer ce vin ?"
        confirmText="Supprimer"
        variant="danger"
        loading={isDeleting}
      />
    </>
  );
}
