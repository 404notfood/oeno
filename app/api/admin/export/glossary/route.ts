import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";
import { generateCsv, createCsvResponse, glossaryCsvColumns } from "@/lib/csv";

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
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = {};

  if (category) {
    where.category = category;
  }

  if (search) {
    where.OR = [
      { term: { contains: search, mode: "insensitive" } },
      { definition: { contains: search, mode: "insensitive" } },
    ];
  }

  const glossary = await prisma.glossaryTerm.findMany({
    where,
    orderBy: { term: "asc" },
  });

  const csv = generateCsv(glossary, glossaryCsvColumns);
  const filename = `glossaire_${new Date().toISOString().split("T")[0]}.csv`;

  return createCsvResponse(csv, filename);
}
