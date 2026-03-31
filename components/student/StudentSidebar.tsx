"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface StudentSidebarProps {
  user: {
    firstName: string;
    lastName: string;
    role: string;
  };
}

const navItems = [
  {
    href: "/dashboard",
    label: "Tableau de bord",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    exact: true,
  },
  {
    href: "/dashboard/blocs",
    label: "Les 8 blocs",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  },
  {
    href: "/dashboard/degustations",
    label: "Mes dégustations",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
  {
    href: "/dashboard/aromes",
    label: "Roue des arômes",
    icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  },
  {
    href: "/dashboard/glossaire",
    label: "Glossaire",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  },
  {
    href: "/dashboard/progression",
    label: "Ma progression",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
];

export default function StudentSidebar({ user }: StudentSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-[var(--beige-dark)] flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-[var(--beige-dark)]">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image
            src="/images/logo/favicon_enoclass.svg"
            alt="OenoClass"
            width={40}
            height={40}
          />
          <span className="font-cormorant text-2xl font-bold text-[var(--bordeaux)]">
            OenoClass
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(item.href, item.exact) ? "page" : undefined}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              isActive(item.href, item.exact)
                ? "bg-[var(--bordeaux)] text-white"
                : "text-[var(--gris-tech)] hover:bg-[var(--beige)]"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={item.icon}
              />
            </svg>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-[var(--beige-dark)]">
        <Link
          href="/dashboard/profil"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
            pathname === "/dashboard/profil"
              ? "bg-[var(--bordeaux)] text-white"
              : "hover:bg-[var(--beige)]"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
              pathname === "/dashboard/profil"
                ? "bg-white text-[var(--bordeaux)]"
                : "bg-[var(--bordeaux)] text-white"
            }`}
          >
            {user.firstName[0]}
            {user.lastName[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={`font-medium truncate ${
                pathname === "/dashboard/profil"
                  ? "text-white"
                  : "text-[var(--gris-dark)]"
              }`}
            >
              {user.firstName} {user.lastName}
            </p>
            <p
              className={`text-sm truncate ${
                pathname === "/dashboard/profil"
                  ? "text-white/70"
                  : "text-[var(--gris-light)]"
              }`}
            >
              {user.role === "STUDENT"
                ? "Élève"
                : user.role === "TEACHER"
                ? "Enseignant"
                : "Admin"}
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
