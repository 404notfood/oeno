"use client";

import { useState } from "react";
import Link from "next/link";
import UsersTable from "./UsersTable";
import ImportUsersModal from "./ImportUsersModal";

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

interface UsersPageClientProps {
  users: User[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
  establishments: Establishment[];
  currentFilters: {
    search?: string;
    role?: string;
    establishmentId?: string;
    page: number;
  };
}

export default function UsersPageClient({
  users,
  pagination,
  establishments,
  currentFilters,
}: UsersPageClientProps) {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  return (
    <>
      {/* Actions */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setIsImportModalOpen(true)}
          className="btn btn-secondary"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          Importer CSV
        </button>
        <Link href="/admin/utilisateurs/nouveau" className="btn btn-primary">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Nouvel utilisateur
        </Link>
      </div>

      <UsersTable
        users={users}
        pagination={pagination}
        establishments={establishments}
        currentFilters={currentFilters}
      />

      <ImportUsersModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </>
  );
}
