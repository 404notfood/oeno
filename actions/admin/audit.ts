"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getServerSession } from "@/lib/auth-server";
import { headers } from "next/headers";

interface AuditLogParams {
  action: string;
  entityType: string;
  entityId?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
}

export async function createAuditLog({
  action,
  entityType,
  entityId,
  oldValues,
  newValues,
}: AuditLogParams) {
  try {
    const session = await getServerSession();
    const headersList = await headers();
    const ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip");
    const userAgent = headersList.get("user-agent");

    await prisma.auditLog.create({
      data: {
        action,
        entityType,
        entityId,
        oldValues: oldValues ? (oldValues as Prisma.InputJsonValue) : undefined,
        newValues: newValues ? (newValues as Prisma.InputJsonValue) : undefined,
        userId: session?.user?.id,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }
}

export interface AuditLogFilters {
  search?: string;
  action?: string;
  entityType?: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export async function getAuditLogs(filters: AuditLogFilters = {}) {
  const {
    search,
    action,
    entityType,
    userId,
    startDate,
    endDate,
    page = 1,
    limit = 20,
  } = filters;

  const where: Record<string, unknown> = {};

  if (action) {
    where.action = action;
  }

  if (entityType) {
    where.entityType = entityType;
  }

  if (userId) {
    where.userId = userId;
  }

  if (startDate || endDate) {
    where.createdAt = {
      ...(startDate && { gte: startDate }),
      ...(endDate && { lte: endDate }),
    };
  }

  if (search) {
    where.OR = [
      { action: { contains: search, mode: "insensitive" } },
      { entityType: { contains: search, mode: "insensitive" } },
      { entityId: { contains: search, mode: "insensitive" } },
    ];
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    data: logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getAuditLogActions() {
  const actions = await prisma.auditLog.findMany({
    select: { action: true },
    distinct: ["action"],
  });
  return actions.map((a) => a.action);
}

export async function getAuditLogEntityTypes() {
  const types = await prisma.auditLog.findMany({
    select: { entityType: true },
    distinct: ["entityType"],
    where: { entityType: { not: null } },
  });
  return types.map((t) => t.entityType).filter(Boolean) as string[];
}
