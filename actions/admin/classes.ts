"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";
import { createAuditLog } from "./audit";
import {
  createClassSchema,
  updateClassSchema,
  classFiltersSchema,
  type CreateClassInput,
  type UpdateClassInput,
  type ClassFilters,
} from "@/lib/validations/admin";
import { revalidatePath } from "next/cache";

export async function getClasses(filters: Partial<ClassFilters> = {}) {
  await requireAdmin();

  const validatedFilters = classFiltersSchema.parse(filters);
  const { search, establishmentId, year, level, isActive, page, limit, sortBy, sortOrder } =
    validatedFilters;

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

  if (typeof isActive === "boolean") {
    where.isActive = isActive;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { level: { contains: search, mode: "insensitive" } },
    ];
  }

  const [classes, total] = await Promise.all([
    prisma.classGroup.findMany({
      where,
      include: {
        establishment: {
          select: {
            id: true,
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
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.classGroup.count({ where }),
  ]);

  return {
    data: classes,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getClassById(id: string) {
  await requireAdmin();

  const classGroup = await prisma.classGroup.findUnique({
    where: { id },
    include: {
      establishment: true,
      students: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
        orderBy: { lastName: "asc" },
      },
      teachers: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
    },
  });

  if (!classGroup) {
    throw new Error("Classe non trouvee");
  }

  return classGroup;
}

export async function createClass(data: CreateClassInput) {
  await requireAdmin();

  const validatedData = createClassSchema.parse(data);

  const classGroup = await prisma.classGroup.create({
    data: validatedData,
  });

  await createAuditLog({
    action: "CREATE",
    entityType: "ClassGroup",
    entityId: classGroup.id,
    newValues: {
      name: classGroup.name,
      year: classGroup.year,
      level: classGroup.level,
    },
  });

  revalidatePath("/admin/classes");

  return classGroup;
}

export async function updateClass(id: string, data: UpdateClassInput) {
  await requireAdmin();

  const validatedData = updateClassSchema.parse(data);

  const existingClass = await prisma.classGroup.findUnique({
    where: { id },
  });

  if (!existingClass) {
    throw new Error("Classe non trouvee");
  }

  const classGroup = await prisma.classGroup.update({
    where: { id },
    data: validatedData,
  });

  await createAuditLog({
    action: "UPDATE",
    entityType: "ClassGroup",
    entityId: id,
    oldValues: {
      name: existingClass.name,
      year: existingClass.year,
      isActive: existingClass.isActive,
    },
    newValues: {
      name: classGroup.name,
      year: classGroup.year,
      isActive: classGroup.isActive,
    },
  });

  revalidatePath("/admin/classes");
  revalidatePath(`/admin/classes/${id}`);

  return classGroup;
}

export async function deleteClass(id: string) {
  await requireAdmin();

  const classGroup = await prisma.classGroup.findUnique({
    where: { id },
  });

  if (!classGroup) {
    throw new Error("Classe non trouvee");
  }

  await prisma.classGroup.delete({
    where: { id },
  });

  await createAuditLog({
    action: "DELETE",
    entityType: "ClassGroup",
    entityId: id,
    oldValues: {
      name: classGroup.name,
      year: classGroup.year,
    },
  });

  revalidatePath("/admin/classes");
}

export async function assignTeacherToClass(classId: string, teacherId: string) {
  await requireAdmin();

  const [classGroup, teacher] = await Promise.all([
    prisma.classGroup.findUnique({ where: { id: classId } }),
    prisma.user.findUnique({ where: { id: teacherId } }),
  ]);

  if (!classGroup) {
    throw new Error("Classe non trouvee");
  }

  if (!teacher || teacher.role !== "TEACHER") {
    throw new Error("Enseignant non trouve ou role invalide");
  }

  await prisma.classGroup.update({
    where: { id: classId },
    data: {
      teachers: {
        connect: { id: teacherId },
      },
    },
  });

  await createAuditLog({
    action: "ASSIGN_TEACHER",
    entityType: "ClassGroup",
    entityId: classId,
    newValues: { teacherId },
  });

  revalidatePath(`/admin/classes/${classId}`);
}

export async function removeTeacherFromClass(classId: string, teacherId: string) {
  await requireAdmin();

  await prisma.classGroup.update({
    where: { id: classId },
    data: {
      teachers: {
        disconnect: { id: teacherId },
      },
    },
  });

  await createAuditLog({
    action: "REMOVE_TEACHER",
    entityType: "ClassGroup",
    entityId: classId,
    oldValues: { teacherId },
  });

  revalidatePath(`/admin/classes/${classId}`);
}

export async function assignStudentsToClass(classId: string, studentIds: string[]) {
  await requireAdmin();

  const classGroup = await prisma.classGroup.findUnique({ where: { id: classId } });

  if (!classGroup) {
    throw new Error("Classe non trouvee");
  }

  await prisma.classGroup.update({
    where: { id: classId },
    data: {
      students: {
        connect: studentIds.map((id) => ({ id })),
      },
    },
  });

  await createAuditLog({
    action: "ASSIGN_STUDENTS",
    entityType: "ClassGroup",
    entityId: classId,
    newValues: { studentIds, count: studentIds.length },
  });

  revalidatePath(`/admin/classes/${classId}`);
}

export async function removeStudentFromClass(classId: string, studentId: string) {
  await requireAdmin();

  await prisma.classGroup.update({
    where: { id: classId },
    data: {
      students: {
        disconnect: { id: studentId },
      },
    },
  });

  await createAuditLog({
    action: "REMOVE_STUDENT",
    entityType: "ClassGroup",
    entityId: classId,
    oldValues: { studentId },
  });

  revalidatePath(`/admin/classes/${classId}`);
}

export async function getClassesCount() {
  await requireAdmin();

  const [total, active] = await Promise.all([
    prisma.classGroup.count(),
    prisma.classGroup.count({ where: { isActive: true } }),
  ]);

  return { total, active };
}

export async function getClassYears() {
  const years = await prisma.classGroup.findMany({
    select: { year: true },
    distinct: ["year"],
    orderBy: { year: "desc" },
  });

  return years.map((y) => y.year);
}

export async function getClassLevels() {
  const levels = await prisma.classGroup.findMany({
    select: { level: true },
    distinct: ["level"],
    where: { level: { not: null } },
  });

  return levels.map((l) => l.level).filter(Boolean) as string[];
}

export async function getAvailableStudents(classId: string, search?: string) {
  await requireAdmin();

  const classGroup = await prisma.classGroup.findUnique({
    where: { id: classId },
    select: { establishmentId: true },
  });

  if (!classGroup) {
    throw new Error("Classe non trouvee");
  }

  const where: Record<string, unknown> = {
    role: "STUDENT",
    establishmentId: classGroup.establishmentId,
    studentClasses: {
      none: { id: classId },
    },
  };

  if (search) {
    where.OR = [
      { email: { contains: search, mode: "insensitive" } },
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
    ];
  }

  return prisma.user.findMany({
    where,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
    },
    orderBy: { lastName: "asc" },
    take: 50,
  });
}

export async function getAvailableTeachers(classId: string) {
  await requireAdmin();

  const classGroup = await prisma.classGroup.findUnique({
    where: { id: classId },
    select: { establishmentId: true },
  });

  if (!classGroup) {
    throw new Error("Classe non trouvee");
  }

  return prisma.user.findMany({
    where: {
      role: "TEACHER",
      establishmentId: classGroup.establishmentId,
      teacherClasses: {
        none: { id: classId },
      },
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
    },
    orderBy: { lastName: "asc" },
  });
}

// Import en masse des classes

interface ImportClassRow {
  name: string;
  year: string;
  level?: string;
  establishmentUai: string;
}

interface ImportClassResult {
  created: number;
  skipped: number;
  errors: string[];
}

export async function importClassesFromCsv(classes: ImportClassRow[]): Promise<ImportClassResult> {
  await requireAdmin();

  const result: ImportClassResult = {
    created: 0,
    skipped: 0,
    errors: [],
  };

  // Récupérer tous les établissements pour le mapping UAI -> ID
  const establishments = await prisma.establishment.findMany({
    select: { id: true, uai: true },
  });
  const establishmentMap = new Map(establishments.map((e) => [e.uai.toLowerCase(), e.id]));

  // Récupérer les classes existantes pour éviter les doublons
  const existingClasses = await prisma.classGroup.findMany({
    select: { name: true, year: true, establishmentId: true },
  });
  const existingSet = new Set(
    existingClasses.map((c) => `${c.name.toLowerCase()}|${c.year}|${c.establishmentId}`)
  );

  for (let i = 0; i < classes.length; i++) {
    const classData = classes[i];
    const rowNum = i + 2; // +2 car ligne 1 = header, index commence à 0

    try {
      // Validation nom
      if (!classData.name?.trim()) {
        result.errors.push(`Ligne ${rowNum}: Nom de classe requis`);
        continue;
      }

      // Validation année
      if (!classData.year?.trim()) {
        result.errors.push(`Ligne ${rowNum}: Année scolaire requise`);
        continue;
      }

      // Validation établissement
      if (!classData.establishmentUai?.trim()) {
        result.errors.push(`Ligne ${rowNum}: Code UAI de l'établissement requis`);
        continue;
      }

      const establishmentId = establishmentMap.get(classData.establishmentUai.toLowerCase());
      if (!establishmentId) {
        result.errors.push(`Ligne ${rowNum}: Établissement non trouvé (UAI: ${classData.establishmentUai})`);
        continue;
      }

      // Vérifier si la classe existe déjà
      const key = `${classData.name.trim().toLowerCase()}|${classData.year.trim()}|${establishmentId}`;
      if (existingSet.has(key)) {
        result.skipped++;
        continue;
      }

      // Créer la classe
      await prisma.classGroup.create({
        data: {
          name: classData.name.trim(),
          year: classData.year.trim(),
          level: classData.level?.trim() || null,
          establishmentId,
        },
      });

      existingSet.add(key);
      result.created++;
    } catch (err) {
      result.errors.push(
        `Ligne ${rowNum}: ${err instanceof Error ? err.message : "Erreur inconnue"}`
      );
    }
  }

  if (result.created > 0) {
    await createAuditLog({
      action: "IMPORT_CLASSES",
      entityType: "ClassGroup",
      entityId: `batch_${Date.now()}`,
      newValues: {
        count: result.created,
        skipped: result.skipped,
        errors: result.errors.length,
      },
    });

    revalidatePath("/admin/classes");
  }

  return result;
}
