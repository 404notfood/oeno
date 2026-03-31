"use client";

import { useState } from "react";
import TeacherSidebar from "./TeacherSidebar";
import TeacherHeader from "./TeacherHeader";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: Date;
}

interface TeacherShellProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  notifications?: NotificationItem[];
  unreadCount?: number;
  children: React.ReactNode;
}

export default function TeacherShell({ user, notifications = [], unreadCount = 0, children }: TeacherShellProps) {
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
        <TeacherSidebar />
      </div>

      {/* Main Content */}
      <div className="lg:ml-56">
        <TeacherHeader
          user={user}
          showMobileMenu={mobileMenuOpen}
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          notifications={notifications}
          unreadCount={unreadCount}
          userId={user.id}
        />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
