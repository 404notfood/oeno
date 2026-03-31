import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";
import { generateCsv, createCsvResponse, grapeCsvColumns } from "@/lib/csv";

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
  const color = searchParams.get("color");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = {};

  if (color) {
    where.color = color;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { origin: { contains: search, mode: "insensitive" } },
    ];
  }

  const grapes = await prisma.grapeVariety.findMany({
    where,
    orderBy: { name: "asc" },
  });

  const csv = generateCsv(grapes, grapeCsvColumns);
  const filename = `cepages_${new Date().toISOString().split("T")[0]}.csv`;

  return createCsvResponse(csv, filename);
}
