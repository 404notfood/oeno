import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";
import { generateCsv, createCsvResponse, userCsvColumns } from "@/lib/csv";

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
  const role = searchParams.get("role") as string | null;
  const establishmentId = searchParams.get("establishmentId");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = {};

  if (role) {
    where.role = role;
  }

  if (establishmentId) {
    where.establishmentId = establishmentId;
  }

  if (search) {
    where.OR = [
      { email: { contains: search, mode: "insensitive" } },
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    include: {
      establishment: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const csv = generateCsv(users, userCsvColumns);
  const filename = `utilisateurs_${new Date().toISOString().split("T")[0]}.csv`;

  return createCsvResponse(csv, filename);
}
