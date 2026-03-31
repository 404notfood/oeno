"use client";

import { useState } from "react";
import Link from "next/link";
import ClassesTable from "./ClassesTable";
import ImportClassesModal from "./ImportClassesModal";

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

interface ClassesPageClientProps {
  classes: ClassGroup[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
  establishments: Establishment[];
  currentFilters: {
    search?: string;
    establishmentId?: string;
    year?: string;
    page: number;
  };
}

export default function ClassesPageClient({
  classes,
  pagination,
  establishments,
  currentFilters,
}: ClassesPageClientProps) {
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
        <Link href="/admin/classes/nouveau" className="btn btn-primary">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouvelle classe
        </Link>
      </div>

      <ClassesTable
        classes={classes}
        pagination={pagination}
        establishments={establishments}
        currentFilters={currentFilters}
      />

      <ImportClassesModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </>
  );
}
