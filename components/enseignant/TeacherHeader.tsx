"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

interface TeacherHeaderProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  showMobileMenu?: boolean;
  onMenuToggle?: () => void;
  notifications?: NotificationItem[];
  unreadCount?: number;
  userId?: string;
}

export default function TeacherHeader({ user, showMobileMenu, onMenuToggle, notifications = [], unreadCount = 0, userId = "" }: TeacherHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
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
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-[var(--beige-dark)] px-6 flex items-center justify-between">
      {/* Mobile menu button */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg hover:bg-[var(--beige)] transition-colors mr-3"
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
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
        <div className="relative">
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
          <label htmlFor="teacher-search" className="sr-only">Rechercher</label>
          <input
            type="search"
            id="teacher-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un élève, une classe..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--beige)] border-none focus:outline-none focus:ring-2 focus:ring-[var(--vert)] transition-all text-sm"
          />
        </div>
      </form>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <NotificationDropdown
          notifications={notifications}
          unreadCount={unreadCount}
          userId={userId}
        />

        {/* Help */}
        <Link
          href="/aide"
          className="p-2 text-[var(--gris-tech)] hover:text-[var(--gris-dark)] transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </Link>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--beige)] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--vert)] to-[var(--bordeaux)] flex items-center justify-center text-white text-sm font-bold">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium text-[var(--gris-dark)]">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-[var(--gris-light)]">Enseignant</p>
            </div>
            <svg
              className={`w-4 h-4 text-[var(--gris-light)] transition-transform ${
                showUserMenu ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-[var(--beige-dark)] py-2 z-50">
              <Link
                href="/dashboard/profil"
                className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--gris-tech)] hover:bg-[var(--beige)] hover:text-[var(--gris-dark)]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Mon profil
              </Link>
              <Link
                href="/enseignant/parametres"
                className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--gris-tech)] hover:bg-[var(--beige)] hover:text-[var(--gris-dark)]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Paramètres
              </Link>
              <hr className="my-2 border-[var(--beige-dark)]" />
              <Link
                href="/logout"
                className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--danger)] hover:bg-[var(--beige)]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Déconnexion
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
