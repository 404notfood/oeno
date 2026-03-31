import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";
import {
  generateCsv,
  createCsvResponse,
  establishmentCsvColumns,
} from "@/lib/csv";

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
  const region = searchParams.get("region");
  const isActive = searchParams.get("isActive");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = {};

  if (region) {
    where.region = region;
  }

  if (isActive !== null) {
    where.isActive = isActive === "true";
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { uai: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
    ];
  }

  const establishments = await prisma.establishment.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const csv = generateCsv(establishments, establishmentCsvColumns);
  const filename = `etablissements_${new Date().toISOString().split("T")[0]}.csv`;

  return createCsvResponse(csv, filename);
}
