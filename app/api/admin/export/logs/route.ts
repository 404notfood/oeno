import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";
import { generateCsv, createCsvResponse, auditLogCsvColumns } from "@/lib/csv";

export async function GET(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return new Response("Non autorisé", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return new Response("Accès interdit", { status: 403 });
  }

  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get("action");
  const entityType = searchParams.get("entityType");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = {};

  if (action) {
    where.action = action;
  }

  if (entityType) {
    where.entityType = entityType;
  }

  if (search) {
    where.OR = [
      { entityId: { contains: search, mode: "insensitive" } },
      { user: { email: { contains: search, mode: "insensitive" } } },
    ];
  }

  const logs = await prisma.auditLog.findMany({
    where,
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 10000, // Limite pour éviter les exports trop volumineux
  });

  const csv = generateCsv(logs, auditLogCsvColumns);
  const filename = `logs_audit_${new Date().toISOString().split("T")[0]}.csv`;

  return createCsvResponse(csv, filename);
}
