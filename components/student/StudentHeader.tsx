"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import NotificationDropdown from "@/components/ui/NotificationDropdown";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: Date;
}

interface StudentHeaderProps {
  showMobileMenu?: boolean;
  onMenuToggle?: () => void;
  notifications?: NotificationItem[];
  unreadCount?: number;
  userId?: string;
}

export default function StudentHeader({
  showMobileMenu,
  onMenuToggle,
  notifications = [],
  unreadCount = 0,
  userId = "",
}: StudentHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  function handleSearchSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      router.push(`/dashboard/recherche?q=${encodeURIComponent(trimmed)}`);
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[var(--beige-dark)]">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          aria-label={showMobileMenu ? "Fermer le menu" : "Ouvrir le menu"}
          className="lg:hidden p-2 rounded-lg hover:bg-[var(--beige)] transition-colors"
        >
          <svg
            className="w-6 h-6 text-[var(--gris-dark)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {showMobileMenu ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--gris-light)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <label htmlFor="student-search" className="sr-only">Rechercher</label>
            <input
              type="search"
              id="student-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une activité, un terme..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[var(--beige-dark)] bg-[var(--beige)] focus:outline-none focus:ring-2 focus:ring-[var(--bordeaux)] focus:border-transparent transition-all"
            />
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <NotificationDropdown
            notifications={notifications}
            unreadCount={unreadCount}
            userId={userId}
          />

          <Link
            href="/logout"
            className="p-2 rounded-lg hover:bg-[var(--beige)] transition-colors"
            title="Déconnexion"
            aria-label="Se déconnecter"
          >
            <svg
              className="w-6 h-6 text-[var(--gris-tech)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
