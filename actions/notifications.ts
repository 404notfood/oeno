"use server";

import prisma from "@/lib/prisma";

export interface NotificationData {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: Date;
}

/**
 * Recupere les 20 dernieres notifications d'un utilisateur
 */
export async function getUserNotifications(userId: string): Promise<NotificationData[]> {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      type: true,
      title: true,
      message: true,
      link: true,
      isRead: true,
      createdAt: true,
    },
  });

  return notifications;
}

/**
 * Compte le nombre de notifications non lues d'un utilisateur
 */
export async function getUnreadCount(userId: string): Promise<number> {
  const count = await prisma.notification.count({
    where: {
      userId,
      isRead: false,
    },
  });

  return count;
}

/**
 * Marque une notification comme lue
 */
export async function markAsRead(notificationId: string): Promise<void> {
  await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
}

/**
 * Marque toutes les notifications d'un utilisateur comme lues
 */
export async function markAllAsRead(userId: string): Promise<void> {
  await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: { isRead: true },
  });
}
