"use client";

import { useState } from "react";
import Link from "next/link";
import WinesTable from "./WinesTable";
import ImportWinesModal from "./ImportWinesModal";

interface Wine {
  id: string;
  name: string;
  type: string;
  color: string;
  vintage: number | null;
  region: string | null;
  isActive: boolean;
  appellation: { id: string; name: string; type: string } | null;
  grapeVarieties: {
    grapeVariety: { id: string; name: string; color: string };
  }[];
  _count: { tastings: number };
}

interface WinesPageClientProps {
  wines: Wine[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
  currentFilters: { search?: string; type?: string; color?: string; page: number };
}

export default function WinesPageClient({
  wines,
  pagination,
  currentFilters,
}: WinesPageClientProps) {
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Importer JSON
        </button>
        <Link href="/admin/vins/nouveau" className="btn btn-primary">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouveau vin
        </Link>
      </div>

      <WinesTable wines={wines} pagination={pagination} currentFilters={currentFilters} />

      <ImportWinesModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </>
  );
}
