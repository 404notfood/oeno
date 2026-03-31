"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { DataTable, Badge, ConfirmDialog, SearchInput, ExportButton } from "@/components/admin/ui";
import type { Column } from "@/components/admin/ui/DataTable";
import { deleteGlossaryTerm } from "@/actions/admin";

interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: string | null;
  relatedTerms: string[];
}

interface GlossaryTableProps {
  terms: GlossaryTerm[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
  currentFilters: { search?: string; category?: string; page: number };
}

const categories = [
  "Viticulture",
  "Vinification",
  "Degustation",
  "Cepage",
  "Terroir",
  "Service",
  "Autre",
];

export default function GlossaryTable({ terms, pagination, currentFilters }: GlossaryTableProps) {
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
      router.push(`/admin/glossaire?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteGlossaryTerm(deleteId);
      setDeleteId(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<GlossaryTerm>[] = [
    {
      key: "term",
      header: "Terme",
      render: (t) => <span className="font-medium text-gris-dark">{t.term}</span>,
    },
    {
      key: "definition",
      header: "Definition",
      render: (t) => (
        <span className="text-sm text-gris-tech line-clamp-2">{t.definition}</span>
      ),
    },
    {
      key: "category",
      header: "Categorie",
      render: (t) => (
        t.category ? <Badge variant="info">{t.category}</Badge> : <span className="text-gris-light">-</span>
      ),
    },
    {
      key: "relatedTerms",
      header: "Termes lies",
      render: (t) => (
        <span className="text-sm text-gris-tech">{t.relatedTerms.length || 0}</span>
      ),
    },
  ];

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-4">
        <SearchInput
          value={currentFilters.search}
          onChange={(s) => updateFilters({ search: s || undefined })}
          placeholder="Rechercher un terme..."
          className="w-64"
        />
        <select
          value={currentFilters.category || ""}
          onChange={(e) => updateFilters({ category: e.target.value || undefined })}
          className="rounded-lg border border-beige-dark bg-white px-3 py-2 text-sm"
        >
          <option value="">Toutes les categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <div className="ml-auto">
          <ExportButton
            endpoint="/api/admin/export/glossary"
            params={{
              search: currentFilters.search,
              category: currentFilters.category,
            }}
            label="Exporter"
          />
        </div>
      </div>

      <DataTable
        data={terms}
        columns={columns}
        keyExtractor={(t) => t.id}
        pagination={{
          currentPage: pagination.page,
          totalPages: pagination.totalPages,
          totalItems: pagination.total,
          itemsPerPage: pagination.limit,
          onPageChange: (p) => updateFilters({ page: p.toString() }),
        }}
        actions={(t) => (
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/glossaire/${t.id}`}
              className="p-1.5 text-gris-tech hover:text-bordeaux hover:bg-beige rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
            <button
              onClick={() => setDeleteId(t.id)}
              className="p-1.5 text-gris-tech hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
        emptyMessage="Aucun terme trouve"
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Supprimer le terme"
        message="Etes-vous sur de vouloir supprimer ce terme ?"
        confirmText="Supprimer"
        variant="danger"
        loading={isDeleting}
      />
    </>
  );
}
