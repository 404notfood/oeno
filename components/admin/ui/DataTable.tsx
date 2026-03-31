"use client";

import { useState, useCallback } from "react";
import Pagination from "./Pagination";
import SearchInput from "./SearchInput";

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  className?: string;
  render?: (item: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  searchValue?: string;
  sortable?: boolean;
  onSort?: (key: string, direction: "asc" | "desc") => void;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
  };
  actions?: (item: T) => React.ReactNode;
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
}

export default function DataTable<T>({
  data,
  columns,
  keyExtractor,
  searchable = false,
  searchPlaceholder = "Rechercher...",
  onSearch,
  searchValue = "",
  sortable = false,
  onSort,
  sortKey,
  sortDirection,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  pagination,
  actions,
  emptyMessage = "Aucun element trouve",
  loading = false,
  className = "",
}: DataTableProps<T>) {
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>(selectedIds);

  const effectiveSelectedIds = onSelectionChange ? selectedIds : localSelectedIds;
  const setEffectiveSelectedIds = onSelectionChange || setLocalSelectedIds;

  const handleSelectAll = useCallback(() => {
    if (effectiveSelectedIds.length === data.length) {
      setEffectiveSelectedIds([]);
    } else {
      setEffectiveSelectedIds(data.map(keyExtractor));
    }
  }, [effectiveSelectedIds, data, keyExtractor, setEffectiveSelectedIds]);

  const handleSelectRow = useCallback(
    (id: string) => {
      if (effectiveSelectedIds.includes(id)) {
        setEffectiveSelectedIds(effectiveSelectedIds.filter((i) => i !== id));
      } else {
        setEffectiveSelectedIds([...effectiveSelectedIds, id]);
      }
    },
    [effectiveSelectedIds, setEffectiveSelectedIds]
  );

  const handleSort = useCallback(
    (key: string) => {
      if (!onSort) return;
      const newDirection =
        sortKey === key && sortDirection === "asc" ? "desc" : "asc";
      onSort(key, newDirection);
    },
    [onSort, sortKey, sortDirection]
  );

  const isAllSelected = data.length > 0 && effectiveSelectedIds.length === data.length;
  const isSomeSelected = effectiveSelectedIds.length > 0 && !isAllSelected;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-beige-dark overflow-hidden ${className}`}>
      {/* Header with search */}
      {searchable && onSearch && (
        <div className="px-4 py-3 border-b border-beige-dark">
          <SearchInput
            value={searchValue}
            onChange={onSearch}
            placeholder={searchPlaceholder}
            className="max-w-sm"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-beige-dark bg-beige/50">
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isSomeSelected;
                    }}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-beige-dark text-bordeaux focus:ring-bordeaux"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gris-tech ${
                    column.className || ""
                  }`}
                >
                  {sortable && column.sortable !== false ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center gap-1 hover:text-bordeaux transition-colors"
                    >
                      {column.header}
                      <span className="flex flex-col">
                        <svg
                          className={`h-3 w-3 ${
                            sortKey === column.key && sortDirection === "asc"
                              ? "text-bordeaux"
                              : "text-gris-light"
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <svg
                          className={`h-3 w-3 -mt-1 ${
                            sortKey === column.key && sortDirection === "desc"
                              ? "text-bordeaux"
                              : "text-gris-light"
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
              {actions && (
                <th className="w-24 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gris-tech">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-beige-dark">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}
                  className="px-4 py-12 text-center"
                >
                  <div className="flex items-center justify-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-bordeaux border-t-transparent"></div>
                    <span className="text-sm text-gris-tech">Chargement...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}
                  className="px-4 py-12 text-center"
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      className="h-10 w-10 text-gris-light"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <span className="text-sm text-gris-tech">{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const id = keyExtractor(item);
                const isSelected = effectiveSelectedIds.includes(id);

                return (
                  <tr
                    key={id}
                    className={`transition-colors ${
                      isSelected ? "bg-bordeaux/5" : "hover:bg-beige/50"
                    }`}
                  >
                    {selectable && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(id)}
                          className="h-4 w-4 rounded border-beige-dark text-bordeaux focus:ring-bordeaux"
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-4 py-3 text-sm text-gris-dark ${
                          column.className || ""
                        }`}
                      >
                        {column.render
                          ? column.render(item, index)
                          : (item as Record<string, unknown>)[column.key] as React.ReactNode}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-4 py-3 text-right">{actions(item)}</td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={pagination.onPageChange}
        />
      )}
    </div>
  );
}
