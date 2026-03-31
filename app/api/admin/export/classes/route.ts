import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";
import { generateCsv, createCsvResponse, classCsvColumns } from "@/lib/csv";

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
  const establishmentId = searchParams.get("establishmentId");
  const year = searchParams.get("year");
  const level = searchParams.get("level");
  const isActive = searchParams.get("isActive");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = {};

  if (establishmentId) {
    where.establishmentId = establishmentId;
  }

  if (year) {
    where.year = year;
  }

  if (level) {
    where.level = level;
  }

  if (isActive !== null) {
    where.isActive = isActive === "true";
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { level: { contains: search, mode: "insensitive" } },
    ];
  }

  const classes = await prisma.classGroup.findMany({
    where,
    include: {
      establishment: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          students: true,
          teachers: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const csv = generateCsv(classes, classCsvColumns);
  const filename = `classes_${new Date().toISOString().split("T")[0]}.csv`;

  return createCsvResponse(csv, filename);
}
