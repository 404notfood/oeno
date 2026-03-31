"use client";

import { useState } from "react";
import StudentSidebar from "./StudentSidebar";
import StudentHeader from "./StudentHeader";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: Date;
}

interface DashboardShellProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  notifications?: NotificationItem[];
  unreadCount?: number;
  children: React.ReactNode;
}

export default function DashboardShell({ user, notifications = [], unreadCount = 0, children }: DashboardShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--beige)]">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar — always visible on desktop, drawer on mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <StudentSidebar user={user} />
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        <StudentHeader
          showMobileMenu={mobileMenuOpen}
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          notifications={notifications}
          unreadCount={unreadCount}
          userId={user.id}
        />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
