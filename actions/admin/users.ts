"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";
import { createAuditLog } from "./audit";
import {
  createUserSchema,
  updateUserSchema,
  userFiltersSchema,
  type CreateUserInput,
  type UpdateUserInput,
  type UserFilters,
} from "@/lib/validations/admin";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function getUsers(filters: Partial<UserFilters> = {}) {
  await requireAdmin();

  const validatedFilters = userFiltersSchema.parse(filters);
  const {
    search,
    role,
    establishmentId,
    page,
    limit,
    sortBy,
    sortOrder,
  } = validatedFilters;

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

  const [users, total] = await Promise.all([
    prisma.user.findMany({
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
            studentClasses: true,
            teacherClasses: true,
          },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data: users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getUserById(id: string) {
  await requireAdmin();

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      establishment: true,
      studentClasses: {
        include: {
          establishment: {
            select: { name: true },
          },
        },
      },
      teacherClasses: {
        include: {
          establishment: {
            select: { name: true },
          },
        },
      },
      _count: {
        select: {
          quizAttempts: true,
          progress: true,
          tastings: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("Utilisateur non trouve");
  }

  return user;
}

export async function createUser(data: CreateUserInput) {
  await requireAdmin();

  const validatedData = createUserSchema.parse(data);

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: validatedData.email },
  });

  if (existingUser) {
    throw new Error("Un utilisateur avec cet email existe deja");
  }

  // Hash password
  const hashedPassword = await hash(validatedData.password, 12);

  const user = await prisma.user.create({
    data: {
      email: validatedData.email,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      name: `${validatedData.firstName} ${validatedData.lastName}`,
      role: validatedData.role,
      establishmentId: validatedData.establishmentId,
      accounts: {
        create: {
          providerId: "credentials",
          accountId: validatedData.email,
          password: hashedPassword,
        },
      },
    },
  });

  await createAuditLog({
    action: "CREATE",
    entityType: "User",
    entityId: user.id,
    newValues: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  });

  revalidatePath("/admin/utilisateurs");

  return user;
}

export async function updateUser(id: string, data: UpdateUserInput) {
  await requireAdmin();

  const validatedData = updateUserSchema.parse(data);

  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new Error("Utilisateur non trouve");
  }

  // Check if email is being changed and if it's already in use
  if (validatedData.email && validatedData.email !== existingUser.email) {
    const emailExists = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    if (emailExists) {
      throw new Error("Un utilisateur avec cet email existe deja");
    }
  }

  const updateData: Record<string, unknown> = { ...validatedData };
  delete updateData.password;

  // Update name if firstName or lastName is provided
  if (validatedData.firstName || validatedData.lastName) {
    updateData.name = `${validatedData.firstName || existingUser.firstName} ${validatedData.lastName || existingUser.lastName}`;
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
  });

  // Update password if provided
  if (validatedData.password) {
    const hashedPassword = await hash(validatedData.password, 12);
    await prisma.account.updateMany({
      where: {
        userId: id,
        providerId: "credentials",
      },
      data: {
        password: hashedPassword,
      },
    });
  }

  await createAuditLog({
    action: "UPDATE",
    entityType: "User",
    entityId: id,
    oldValues: {
      email: existingUser.email,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      role: existingUser.role,
    },
    newValues: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  });

  revalidatePath("/admin/utilisateurs");
  revalidatePath(`/admin/utilisateurs/${id}`);

  return user;
}

export async function deleteUser(id: string) {
  await requireAdmin();

  const user = await prisma.user.findUnique({
    where: { id },
    select: { email: true, firstName: true, lastName: true, role: true },
  });

  if (!user) {
    throw new Error("Utilisateur non trouve");
  }

  // Prevent deleting super admins
  if (user.role === "SUPER_ADMIN") {
    throw new Error("Impossible de supprimer un super administrateur");
  }

  await prisma.user.delete({
    where: { id },
  });

  await createAuditLog({
    action: "DELETE",
    entityType: "User",
    entityId: id,
    oldValues: user,
  });

  revalidatePath("/admin/utilisateurs");
}

export async function updateUserRole(id: string, role: CreateUserInput["role"]) {
  await requireAdmin();

  const user = await prisma.user.findUnique({
    where: { id },
    select: { role: true },
  });

  if (!user) {
    throw new Error("Utilisateur non trouve");
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { role },
  });

  await createAuditLog({
    action: "UPDATE_ROLE",
    entityType: "User",
    entityId: id,
    oldValues: { role: user.role },
    newValues: { role: updatedUser.role },
  });

  revalidatePath("/admin/utilisateurs");
  revalidatePath(`/admin/utilisateurs/${id}`);

  return updatedUser;
}

export async function getUsersCount() {
  await requireAdmin();

  const [total, students, teachers, admins] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "TEACHER" } }),
    prisma.user.count({ where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } } }),
  ]);

  return { total, students, teachers, admins };
}

// Génération de mot de passe aléatoire
function generateRandomPassword(length: number = 12): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

interface ImportUserRow {
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
  establishmentUai?: string;
  password?: string;
}

interface ImportResult {
  created: number;
  skipped: number;
  errors: string[];
  passwords: { email: string; password: string }[];
}

export async function importUsersFromCsv(users: ImportUserRow[]): Promise<ImportResult> {
  await requireAdmin();

  const result: ImportResult = {
    created: 0,
    skipped: 0,
    errors: [],
    passwords: [],
  };

  // Récupérer tous les établissements pour le mapping UAI -> ID
  const establishments = await prisma.establishment.findMany({
    select: { id: true, uai: true },
  });
  const establishmentMap = new Map(establishments.map((e) => [e.uai.toLowerCase(), e.id]));

  // Récupérer tous les emails existants
  const existingEmails = new Set(
    (await prisma.user.findMany({ select: { email: true } })).map((u) => u.email.toLowerCase())
  );

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const rowNum = i + 2; // +2 car ligne 1 = header, index commence à 0

    try {
      // Validation email
      if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
        result.errors.push(`Ligne ${rowNum}: Email invalide "${user.email}"`);
        continue;
      }

      // Email déjà existant
      if (existingEmails.has(user.email.toLowerCase())) {
        result.skipped++;
        continue;
      }

      // Validation prénom/nom
      if (!user.firstName?.trim() || !user.lastName?.trim()) {
        result.errors.push(`Ligne ${rowNum}: Prénom et nom requis`);
        continue;
      }

      // Validation rôle
      const validRoles = ["STUDENT", "TEACHER", "ADMIN"];
      const role = user.role?.toUpperCase() || "STUDENT";
      if (!validRoles.includes(role)) {
        result.errors.push(`Ligne ${rowNum}: Rôle invalide "${user.role}". Utilisez: ${validRoles.join(", ")}`);
        continue;
      }

      // Établissement (optionnel)
      let establishmentId: string | null = null;
      if (user.establishmentUai) {
        establishmentId = establishmentMap.get(user.establishmentUai.toLowerCase()) || null;
        if (!establishmentId) {
          result.errors.push(`Ligne ${rowNum}: Établissement non trouvé (UAI: ${user.establishmentUai})`);
          continue;
        }
      }

      // Mot de passe
      const password = user.password?.trim() || generateRandomPassword();
      const hashedPassword = await hash(password, 12);

      // Créer l'utilisateur
      const createdUser = await prisma.user.create({
        data: {
          email: user.email.toLowerCase().trim(),
          firstName: user.firstName.trim(),
          lastName: user.lastName.trim(),
          name: `${user.firstName.trim()} ${user.lastName.trim()}`,
          role: role as "STUDENT" | "TEACHER" | "ADMIN",
          establishmentId,
          accounts: {
            create: {
              providerId: "credentials",
              accountId: user.email.toLowerCase().trim(),
              password: hashedPassword,
            },
          },
        },
      });

      existingEmails.add(user.email.toLowerCase());
      result.created++;

      // Si le mot de passe a été généré, le stocker pour l'afficher
      if (!user.password?.trim()) {
        result.passwords.push({ email: createdUser.email, password });
      }
    } catch (err) {
      result.errors.push(
        `Ligne ${rowNum}: ${err instanceof Error ? err.message : "Erreur inconnue"}`
      );
    }
  }

  if (result.created > 0) {
    await createAuditLog({
      action: "IMPORT_USERS",
      entityType: "User",
      entityId: `batch_${Date.now()}`,
      newValues: {
        count: result.created,
        skipped: result.skipped,
        errors: result.errors.length,
      },
    });

    revalidatePath("/admin/utilisateurs");
  }

  return result;
}
