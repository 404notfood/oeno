"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { DataTable, StatusBadge, ConfirmDialog, SearchInput } from "@/components/admin/ui";
import type { Column } from "@/components/admin/ui/DataTable";
import { deleteQuiz } from "@/actions/admin";

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  passingScore: number;
  isActive: boolean;
  block: { id: string; number: number; title: string } | null;
  _count: { questions: number; attempts: number };
}

interface Bloc {
  id: string;
  number: number;
  title: string;
}

interface QuizTableProps {
  quizzes: Quiz[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
  blocs: Bloc[];
  currentFilters: { search?: string; blockId?: string; page: number };
}

export default function QuizTable({ quizzes, pagination, blocs, currentFilters }: QuizTableProps) {
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
      router.push(`/admin/quiz?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteQuiz(deleteId);
      setDeleteId(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Quiz>[] = [
    {
      key: "title",
      header: "Quiz",
      render: (q) => (
        <div>
          <p className="font-medium text-gris-dark">{q.title}</p>
          {q.block && <p className="text-xs text-gris-tech">Bloc {q.block.number}</p>}
        </div>
      ),
    },
    {
      key: "questions",
      header: "Questions",
      render: (q) => <span className="text-sm text-gris-tech">{q._count.questions}</span>,
    },
    {
      key: "attempts",
      header: "Tentatives",
      render: (q) => <span className="text-sm text-gris-tech">{q._count.attempts}</span>,
    },
    {
      key: "passingScore",
      header: "Score min.",
      render: (q) => <span className="text-sm text-gris-tech">{q.passingScore}%</span>,
    },
    {
      key: "isActive",
      header: "Statut",
      render: (q) => <StatusBadge isActive={q.isActive} />,
    },
  ];

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-4">
        <SearchInput
          value={currentFilters.search}
          onChange={(s) => updateFilters({ search: s || undefined })}
          placeholder="Rechercher un quiz..."
          className="w-64"
        />
        <select
          value={currentFilters.blockId || ""}
          onChange={(e) => updateFilters({ blockId: e.target.value || undefined })}
          className="rounded-lg border border-beige-dark bg-white px-3 py-2 text-sm"
        >
          <option value="">Tous les blocs</option>
          {blocs.map((b) => (
            <option key={b.id} value={b.id}>Bloc {b.number} - {b.title}</option>
          ))}
        </select>
      </div>

      <DataTable
        data={quizzes}
        columns={columns}
        keyExtractor={(q) => q.id}
        pagination={{
          currentPage: pagination.page,
          totalPages: pagination.totalPages,
          totalItems: pagination.total,
          itemsPerPage: pagination.limit,
          onPageChange: (p) => updateFilters({ page: p.toString() }),
        }}
        actions={(q) => (
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/quiz/${q.id}`}
              className="p-1.5 text-gris-tech hover:text-bordeaux hover:bg-beige rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
            <button
              onClick={() => setDeleteId(q.id)}
              disabled={q._count.attempts > 0}
              className="p-1.5 text-gris-tech hover:text-danger hover:bg-danger/10 rounded-lg transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
        emptyMessage="Aucun quiz trouve"
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Supprimer le quiz"
        message="Etes-vous sur de vouloir supprimer ce quiz ?"
        confirmText="Supprimer"
        variant="danger"
        loading={isDeleting}
      />
    </>
  );
}
