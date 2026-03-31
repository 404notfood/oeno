"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { DataTable, RoleBadge, ConfirmDialog, SearchInput, ExportButton } from "@/components/admin/ui";
import type { Column } from "@/components/admin/ui/DataTable";
import { deleteUser } from "@/actions/admin";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: Date;
  establishment: { id: string; name: string } | null;
  _count: { studentClasses: number; teacherClasses: number };
}

interface Establishment {
  id: string;
  name: string;
  uai: string;
}

interface UsersTableProps {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  establishments: Establishment[];
  currentFilters: {
    search?: string;
    role?: string;
    establishmentId?: string;
    page: number;
  };
}

export default function UsersTable({
  users,
  pagination,
  establishments,
  currentFilters,
}: UsersTableProps) {
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

      // Reset to page 1 when filters change
      if (!updates.page) {
        params.delete("page");
      }

      router.push(`/admin/utilisateurs?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearch = useCallback(
    (search: string) => {
      updateFilters({ search: search || undefined });
    },
    [updateFilters]
  );

  const handleRoleFilter = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateFilters({ role: e.target.value || undefined });
    },
    [updateFilters]
  );

  const handleEstablishmentFilter = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateFilters({ establishmentId: e.target.value || undefined });
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
      await deleteUser(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert(error instanceof Error ? error.message : "Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<User>[] = [
    {
      key: "name",
      header: "Utilisateur",
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-bordeaux/10 flex items-center justify-center">
            <span className="text-sm font-medium text-bordeaux">
              {user.firstName[0]}
              {user.lastName[0]}
            </span>
          </div>
          <div>
            <p className="font-medium text-gris-dark">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gris-tech">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (user) => <RoleBadge role={user.role} />,
    },
    {
      key: "establishment",
      header: "Etablissement",
      render: (user) => (
        <span className="text-sm text-gris-tech">
          {user.establishment?.name || "-"}
        </span>
      ),
    },
    {
      key: "classes",
      header: "Classes",
      render: (user) => {
        const count = user._count.studentClasses + user._count.teacherClasses;
        return (
          <span className="text-sm text-gris-tech">
            {count > 0 ? `${count} classe(s)` : "-"}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      header: "Inscription",
      render: (user) => (
        <span className="text-sm text-gris-tech">
          {new Date(user.createdAt).toLocaleDateString("fr-FR")}
        </span>
      ),
    },
  ];

  return (
    <>
      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-4">
        <SearchInput
          value={currentFilters.search}
          onChange={handleSearch}
          placeholder="Rechercher un utilisateur..."
          className="w-64"
        />
        <select
          value={currentFilters.role || ""}
          onChange={handleRoleFilter}
          className="rounded-lg border border-beige-dark bg-white px-3 py-2 text-sm focus:border-bordeaux focus:outline-none"
        >
          <option value="">Tous les roles</option>
          <option value="STUDENT">Eleves</option>
          <option value="TEACHER">Enseignants</option>
          <option value="ADMIN">Administrateurs</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
        <select
          value={currentFilters.establishmentId || ""}
          onChange={handleEstablishmentFilter}
          className="rounded-lg border border-beige-dark bg-white px-3 py-2 text-sm focus:border-bordeaux focus:outline-none"
        >
          <option value="">Tous les etablissements</option>
          {establishments.map((est) => (
            <option key={est.id} value={est.id}>
              {est.name}
            </option>
          ))}
        </select>
        <div className="ml-auto">
          <ExportButton
            endpoint="/api/admin/export/users"
            params={{
              search: currentFilters.search,
              role: currentFilters.role,
              establishmentId: currentFilters.establishmentId,
            }}
            label="Exporter"
          />
        </div>
      </div>

      <DataTable
        data={users}
        columns={columns}
        keyExtractor={(user) => user.id}
        pagination={{
          currentPage: pagination.page,
          totalPages: pagination.totalPages,
          totalItems: pagination.total,
          itemsPerPage: pagination.limit,
          onPageChange: handlePageChange,
        }}
        actions={(user) => (
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/utilisateurs/${user.id}`}
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
            {user.role !== "SUPER_ADMIN" && (
              <button
                onClick={() => setDeleteId(user.id)}
                className="p-1.5 text-gris-tech hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                title="Supprimer"
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
            )}
          </div>
        )}
        emptyMessage="Aucun utilisateur trouve"
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Supprimer l'utilisateur"
        message="Etes-vous sur de vouloir supprimer cet utilisateur ? Cette action est irreversible."
        confirmText="Supprimer"
        variant="danger"
        loading={isDeleting}
      />
    </>
  );
}
