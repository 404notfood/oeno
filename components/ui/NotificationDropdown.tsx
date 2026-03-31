"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { markAsRead, markAllAsRead } from "@/actions/notifications";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: Date;
}

interface NotificationDropdownProps {
  notifications: NotificationItem[];
  unreadCount: number;
  userId: string;
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "A l'instant";
  if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} sem.`;
  return `Il y a ${Math.floor(diffDays / 30)} mois`;
}

export default function NotificationDropdown({
  notifications,
  unreadCount,
  userId,
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [allMarkedRead, setAllMarkedRead] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const localNotifications = useMemo(
    () =>
      notifications.map((n) => ({
        ...n,
        isRead: allMarkedRead || n.isRead || readIds.has(n.id),
      })),
    [notifications, readIds, allMarkedRead]
  );

  const localUnreadCount = allMarkedRead
    ? 0
    : unreadCount - readIds.size;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  async function handleNotificationClick(notification: NotificationItem) {
    if (!notification.isRead && !readIds.has(notification.id)) {
      setReadIds((prev) => new Set(prev).add(notification.id));
      await markAsRead(notification.id);
    }

    if (notification.link) {
      setIsOpen(false);
      router.push(notification.link);
    }
  }

  async function handleMarkAllAsRead() {
    if (localUnreadCount === 0) return;

    setAllMarkedRead(true);
    await markAllAsRead(userId);
  }

  return (
    <div ref={dropdownRef} className="relative">
      {/* Bell button */}
      <button
        aria-label="Notifications"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-[var(--beige)] transition-colors relative"
      >
        <svg
          className="w-6 h-6 text-[var(--gris-tech)]"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {localUnreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold text-white bg-[var(--danger,#e74c3c)] rounded-full leading-none">
            {localUnreadCount > 99 ? "99+" : localUnreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-[var(--beige-dark)] z-50 overflow-hidden"
          role="menu"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--beige-dark)] bg-[var(--beige)]">
            <h3
              className="text-sm font-semibold text-[var(--gris-dark,#2c3e50)]"
              style={{ fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)" }}
            >
              Notifications
            </h3>
            {localUnreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-[var(--bordeaux,#6B1F3D)] hover:text-[var(--bordeaux-light,#8B2F4D)] font-medium transition-colors"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-80 overflow-y-auto">
            {localNotifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <svg
                  className="w-12 h-12 mx-auto mb-3 text-[var(--beige-dark,#E8E0D0)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <p className="text-sm text-[var(--gris-tech,#566573)]">
                  Aucune notification
                </p>
              </div>
            ) : (
              localNotifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-[var(--beige,#F5F1E8)] transition-colors border-b border-[var(--beige-dark,#E8E0D0)] last:border-b-0 ${
                    !notification.isRead ? "bg-[var(--beige,#F5F1E8)]/50" : ""
                  }`}
                  role="menuitem"
                >
                  {/* Status dot */}
                  <span
                    className={`mt-1.5 flex-shrink-0 w-2.5 h-2.5 rounded-full ${
                      notification.isRead
                        ? "bg-[var(--gris-light,#b0b8c1)]"
                        : "bg-[var(--bordeaux,#6B1F3D)]"
                    }`}
                    aria-hidden="true"
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm leading-tight ${
                        notification.isRead
                          ? "text-[var(--gris-tech,#566573)] font-normal"
                          : "text-[var(--gris-dark,#2c3e50)] font-semibold"
                      }`}
                    >
                      {notification.title}
                    </p>
                    <p className="text-xs text-[var(--gris-light,#b0b8c1)] mt-0.5 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-[var(--gris-light,#b0b8c1)] mt-1">
                      {formatRelativeTime(notification.createdAt)}
                    </p>
                  </div>

                  {/* Link indicator */}
                  {notification.link && (
                    <svg
                      className="w-4 h-4 mt-1 flex-shrink-0 text-[var(--gris-light,#b0b8c1)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
