"use server";

import { prisma } from "@/lib/prisma";
import { requireSuperAdmin, getServerSession } from "@/lib/auth-server";
import { createAuditLog } from "./audit";
import { revalidatePath } from "next/cache";

// UserRole défini localement pour éviter les problèmes d'import
export type UserRole = "STUDENT" | "TEACHER" | "ADMIN" | "SUPER_ADMIN";

// Permission enum défini manuellement (en attendant prisma generate)
export type Permission =
  | "VIEW_USERS"
  | "CREATE_USERS"
  | "EDIT_USERS"
  | "DELETE_USERS"
  | "MANAGE_USER_ROLES"
  | "VIEW_ESTABLISHMENTS"
  | "CREATE_ESTABLISHMENTS"
  | "EDIT_ESTABLISHMENTS"
  | "DELETE_ESTABLISHMENTS"
  | "VIEW_CLASSES"
  | "CREATE_CLASSES"
  | "EDIT_CLASSES"
  | "DELETE_CLASSES"
  | "MANAGE_CLASS_MEMBERS"
  | "VIEW_BLOCS"
  | "EDIT_BLOCS"
  | "VIEW_ACTIVITIES"
  | "CREATE_ACTIVITIES"
  | "EDIT_ACTIVITIES"
  | "DELETE_ACTIVITIES"
  | "VIEW_QUIZZES"
  | "CREATE_QUIZZES"
  | "EDIT_QUIZZES"
  | "DELETE_QUIZZES"
  | "VIEW_CONTENT"
  | "CREATE_CONTENT"
  | "EDIT_CONTENT"
  | "DELETE_CONTENT"
  | "VIEW_AROMAS"
  | "MANAGE_AROMAS"
  | "VIEW_LOGS"
  | "VIEW_ANALYTICS"
  | "VIEW_SETTINGS"
  | "MANAGE_SETTINGS"
  | "MANAGE_PERMISSIONS"
  | "SUPER_ADMIN_ACCESS";

const ALL_PERMISSIONS: Permission[] = [
  "VIEW_USERS",
  "CREATE_USERS",
  "EDIT_USERS",
  "DELETE_USERS",
  "MANAGE_USER_ROLES",
  "VIEW_ESTABLISHMENTS",
  "CREATE_ESTABLISHMENTS",
  "EDIT_ESTABLISHMENTS",
  "DELETE_ESTABLISHMENTS",
  "VIEW_CLASSES",
  "CREATE_CLASSES",
  "EDIT_CLASSES",
  "DELETE_CLASSES",
  "MANAGE_CLASS_MEMBERS",
  "VIEW_BLOCS",
  "EDIT_BLOCS",
  "VIEW_ACTIVITIES",
  "CREATE_ACTIVITIES",
  "EDIT_ACTIVITIES",
  "DELETE_ACTIVITIES",
  "VIEW_QUIZZES",
  "CREATE_QUIZZES",
  "EDIT_QUIZZES",
  "DELETE_QUIZZES",
  "VIEW_CONTENT",
  "CREATE_CONTENT",
  "EDIT_CONTENT",
  "DELETE_CONTENT",
  "VIEW_AROMAS",
  "MANAGE_AROMAS",
  "VIEW_LOGS",
  "VIEW_ANALYTICS",
  "VIEW_SETTINGS",
  "MANAGE_SETTINGS",
  "MANAGE_PERMISSIONS",
  "SUPER_ADMIN_ACCESS",
];

// Helper pour accéder aux modèles de manière sécurisée (avant prisma generate)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getRolePermissionModel = () => (prisma as any).rolePermission;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getUserPermissionModel = () => (prisma as any).userPermission;

// Types
export interface RolePermissionData {
  role: UserRole;
  permissions: Permission[];
}

export interface UserPermissionData {
  userId: string;
  permission: Permission;
  granted: boolean;
}

// Permissions par défaut pour chaque rôle
const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  STUDENT: [],
  TEACHER: [
    "VIEW_CLASSES",
    "VIEW_BLOCS",
    "VIEW_ACTIVITIES",
    "VIEW_QUIZZES",
    "VIEW_CONTENT",
    "VIEW_AROMAS",
  ],
  ADMIN: [
    "VIEW_USERS",
    "CREATE_USERS",
    "EDIT_USERS",
    "VIEW_ESTABLISHMENTS",
    "VIEW_CLASSES",
    "CREATE_CLASSES",
    "EDIT_CLASSES",
    "DELETE_CLASSES",
    "MANAGE_CLASS_MEMBERS",
    "VIEW_BLOCS",
    "VIEW_ACTIVITIES",
    "CREATE_ACTIVITIES",
    "EDIT_ACTIVITIES",
    "VIEW_QUIZZES",
    "CREATE_QUIZZES",
    "EDIT_QUIZZES",
    "VIEW_CONTENT",
    "CREATE_CONTENT",
    "EDIT_CONTENT",
    "VIEW_AROMAS",
    "VIEW_LOGS",
    "VIEW_ANALYTICS",
  ],
  SUPER_ADMIN: ALL_PERMISSIONS,
};

// Récupérer les permissions d'un rôle
export async function getRolePermissions(role: UserRole): Promise<Permission[]> {
  await requireSuperAdmin();

  try {
    const model = getRolePermissionModel();
    if (model) {
      const rolePermissions = await model.findMany({
        where: { role },
        select: { permission: true },
      });

      if (rolePermissions.length > 0) {
        return rolePermissions.map((rp: { permission: Permission }) => rp.permission);
      }
    }
  } catch {
    // Le modèle n'existe pas encore
  }

  // Retourner les permissions par défaut
  return DEFAULT_ROLE_PERMISSIONS[role];
}

// Récupérer toutes les permissions par rôle
export async function getAllRolePermissions(): Promise<RolePermissionData[]> {
  await requireSuperAdmin();

  const roles: UserRole[] = ["STUDENT", "TEACHER", "ADMIN", "SUPER_ADMIN"];
  const result: RolePermissionData[] = [];

  for (const role of roles) {
    const permissions = await getRolePermissions(role);
    result.push({ role, permissions });
  }

  return result;
}

// Mettre à jour les permissions d'un rôle
export async function updateRolePermissions(
  role: UserRole,
  permissions: Permission[]
): Promise<void> {
  await requireSuperAdmin();

  // Ne pas modifier les permissions SUPER_ADMIN
  if (role === "SUPER_ADMIN") {
    throw new Error("Les permissions du Super Admin ne peuvent pas être modifiées");
  }

  const model = getRolePermissionModel();
  if (!model) {
    throw new Error("Le système de permissions n'est pas encore configuré. Exécutez 'npx prisma migrate dev'.");
  }

  try {
    // Récupérer les anciennes permissions pour l'audit
    const oldPermissions = await model.findMany({
      where: { role },
      select: { permission: true },
    });

    // Supprimer les anciennes permissions
    await model.deleteMany({
      where: { role },
    });

    // Créer les nouvelles permissions
    if (permissions.length > 0) {
      await model.createMany({
        data: permissions.map((permission: Permission) => ({
          role,
          permission,
        })),
      });
    }

    await createAuditLog({
      action: "UPDATE_ROLE_PERMISSIONS",
      entityType: "RolePermission",
      entityId: role,
      oldValues: { permissions: oldPermissions.map((p: { permission: Permission }) => p.permission) },
      newValues: { permissions },
    });

    revalidatePath("/admin/permissions");
  } catch (err) {
    if (err instanceof Error && err.message.includes("pas encore configuré")) {
      throw err;
    }
    throw new Error("Erreur lors de la mise à jour des permissions");
  }
}

// Récupérer les permissions personnalisées d'un utilisateur
export async function getUserPermissions(userId: string): Promise<UserPermissionData[]> {
  await requireSuperAdmin();

  try {
    const model = getUserPermissionModel();
    if (model) {
      const userPermissions = await model.findMany({
        where: { userId },
      });

      return userPermissions.map((up: { userId: string; permission: Permission; granted: boolean }) => ({
        userId: up.userId,
        permission: up.permission,
        granted: up.granted,
      }));
    }
  } catch {
    // Le modèle n'existe pas encore
  }

  return [];
}

// Ajouter/modifier une permission personnalisée pour un utilisateur
export async function setUserPermission(
  userId: string,
  permission: Permission,
  granted: boolean
): Promise<void> {
  await requireSuperAdmin();

  const model = getUserPermissionModel();
  if (!model) {
    throw new Error("Le système de permissions n'est pas encore configuré. Exécutez 'npx prisma migrate dev'.");
  }

  try {
    const existing = await model.findUnique({
      where: {
        userId_permission: { userId, permission },
      },
    });

    if (existing) {
      await model.update({
        where: { id: existing.id },
        data: { granted },
      });
    } else {
      await model.create({
        data: { userId, permission, granted },
      });
    }

    await createAuditLog({
      action: "SET_USER_PERMISSION",
      entityType: "UserPermission",
      entityId: userId,
      newValues: { permission, granted },
    });

    revalidatePath("/admin/permissions");
    revalidatePath(`/admin/utilisateurs/${userId}`);
  } catch (err) {
    if (err instanceof Error && err.message.includes("pas encore configuré")) {
      throw err;
    }
    throw new Error("Erreur lors de la mise à jour de la permission");
  }
}

// Supprimer une permission personnalisée d'un utilisateur
export async function removeUserPermission(
  userId: string,
  permission: Permission
): Promise<void> {
  await requireSuperAdmin();

  const model = getUserPermissionModel();
  if (!model) {
    throw new Error("Le système de permissions n'est pas encore configuré. Exécutez 'npx prisma migrate dev'.");
  }

  try {
    await model.deleteMany({
      where: { userId, permission },
    });

    await createAuditLog({
      action: "REMOVE_USER_PERMISSION",
      entityType: "UserPermission",
      entityId: userId,
      oldValues: { permission },
    });

    revalidatePath("/admin/permissions");
    revalidatePath(`/admin/utilisateurs/${userId}`);
  } catch (err) {
    if (err instanceof Error && err.message.includes("pas encore configuré")) {
      throw err;
    }
    throw new Error("Erreur lors de la suppression de la permission");
  }
}

// Vérifier si l'utilisateur actuel a une permission spécifique
export async function hasPermission(permission: Permission): Promise<boolean> {
  const session = await getServerSession();
  if (!session?.user) return false;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user) return false;

  // Super Admin a toutes les permissions
  if (user.role === "SUPER_ADMIN") return true;

  try {
    // Vérifier les permissions personnalisées de l'utilisateur
    const userPermModel = getUserPermissionModel();
    if (userPermModel) {
      const userPermission = await userPermModel.findUnique({
        where: {
          userId_permission: { userId: session.user.id, permission },
        },
      });

      // Si une permission personnalisée existe, elle a priorité
      if (userPermission) {
        return userPermission.granted;
      }
    }

    // Sinon, vérifier les permissions du rôle
    const rolePermModel = getRolePermissionModel();
    if (rolePermModel) {
      const rolePermission = await rolePermModel.findUnique({
        where: {
          role_permission: { role: user.role, permission },
        },
      });

      if (rolePermission) {
        return true;
      }
    }
  } catch {
    // Les modèles n'existent pas encore
  }

  // Vérifier les permissions par défaut
  return DEFAULT_ROLE_PERMISSIONS[user.role].includes(permission);
}

// Récupérer toutes les permissions de l'utilisateur actuel
export async function getCurrentUserPermissions(): Promise<Permission[]> {
  const session = await getServerSession();
  if (!session?.user) return [];

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user) return [];

  // Super Admin a toutes les permissions
  if (user.role === "SUPER_ADMIN") {
    return ALL_PERMISSIONS;
  }

  const permissions: Set<Permission> = new Set();

  try {
    // Récupérer les permissions du rôle
    const rolePermModel = getRolePermissionModel();
    let rolePermissions: { permission: Permission }[] = [];

    if (rolePermModel) {
      rolePermissions = await rolePermModel.findMany({
        where: { role: user.role },
        select: { permission: true },
      });
    }

    // Ajouter les permissions du rôle (ou par défaut)
    if (rolePermissions.length > 0) {
      rolePermissions.forEach((rp: { permission: Permission }) => permissions.add(rp.permission));
    } else {
      DEFAULT_ROLE_PERMISSIONS[user.role].forEach((p) => permissions.add(p));
    }

    // Appliquer les permissions personnalisées
    const userPermModel = getUserPermissionModel();
    if (userPermModel) {
      const userPermissions = await userPermModel.findMany({
        where: { userId: session.user.id },
      });

      userPermissions.forEach((up: { permission: Permission; granted: boolean }) => {
        if (up.granted) {
          permissions.add(up.permission);
        } else {
          permissions.delete(up.permission);
        }
      });
    }
  } catch {
    // Les modèles n'existent pas encore, utiliser les permissions par défaut
    DEFAULT_ROLE_PERMISSIONS[user.role].forEach((p) => permissions.add(p));
  }

  return Array.from(permissions);
}

// Liste de toutes les permissions disponibles avec leurs labels
export async function getPermissionsList(): Promise<{ permission: Permission; label: string; category: string }[]> {
  return [
    // Utilisateurs
    { permission: "VIEW_USERS", label: "Voir les utilisateurs", category: "Utilisateurs" },
    { permission: "CREATE_USERS", label: "Créer des utilisateurs", category: "Utilisateurs" },
    { permission: "EDIT_USERS", label: "Modifier des utilisateurs", category: "Utilisateurs" },
    { permission: "DELETE_USERS", label: "Supprimer des utilisateurs", category: "Utilisateurs" },
    { permission: "MANAGE_USER_ROLES", label: "Gérer les rôles", category: "Utilisateurs" },

    // Établissements
    { permission: "VIEW_ESTABLISHMENTS", label: "Voir les établissements", category: "Établissements" },
    { permission: "CREATE_ESTABLISHMENTS", label: "Créer des établissements", category: "Établissements" },
    { permission: "EDIT_ESTABLISHMENTS", label: "Modifier des établissements", category: "Établissements" },
    { permission: "DELETE_ESTABLISHMENTS", label: "Supprimer des établissements", category: "Établissements" },

    // Classes
    { permission: "VIEW_CLASSES", label: "Voir les classes", category: "Classes" },
    { permission: "CREATE_CLASSES", label: "Créer des classes", category: "Classes" },
    { permission: "EDIT_CLASSES", label: "Modifier des classes", category: "Classes" },
    { permission: "DELETE_CLASSES", label: "Supprimer des classes", category: "Classes" },
    { permission: "MANAGE_CLASS_MEMBERS", label: "Gérer les membres", category: "Classes" },

    // Blocs & Activités
    { permission: "VIEW_BLOCS", label: "Voir les blocs", category: "Contenu pédagogique" },
    { permission: "EDIT_BLOCS", label: "Modifier les blocs", category: "Contenu pédagogique" },
    { permission: "VIEW_ACTIVITIES", label: "Voir les activités", category: "Contenu pédagogique" },
    { permission: "CREATE_ACTIVITIES", label: "Créer des activités", category: "Contenu pédagogique" },
    { permission: "EDIT_ACTIVITIES", label: "Modifier des activités", category: "Contenu pédagogique" },
    { permission: "DELETE_ACTIVITIES", label: "Supprimer des activités", category: "Contenu pédagogique" },

    // Quiz
    { permission: "VIEW_QUIZZES", label: "Voir les quiz", category: "Quiz" },
    { permission: "CREATE_QUIZZES", label: "Créer des quiz", category: "Quiz" },
    { permission: "EDIT_QUIZZES", label: "Modifier des quiz", category: "Quiz" },
    { permission: "DELETE_QUIZZES", label: "Supprimer des quiz", category: "Quiz" },

    // Contenu
    { permission: "VIEW_CONTENT", label: "Voir le contenu", category: "Référentiel" },
    { permission: "CREATE_CONTENT", label: "Créer du contenu", category: "Référentiel" },
    { permission: "EDIT_CONTENT", label: "Modifier du contenu", category: "Référentiel" },
    { permission: "DELETE_CONTENT", label: "Supprimer du contenu", category: "Référentiel" },

    // Arômes
    { permission: "VIEW_AROMAS", label: "Voir les arômes", category: "Référentiel" },
    { permission: "MANAGE_AROMAS", label: "Gérer les arômes", category: "Référentiel" },

    // Logs & Analytics
    { permission: "VIEW_LOGS", label: "Voir les logs", category: "Administration" },
    { permission: "VIEW_ANALYTICS", label: "Voir les analytics", category: "Administration" },

    // Paramètres
    { permission: "VIEW_SETTINGS", label: "Voir les paramètres", category: "Administration" },
    { permission: "MANAGE_SETTINGS", label: "Gérer les paramètres", category: "Administration" },

    // Permissions spéciales
    { permission: "MANAGE_PERMISSIONS", label: "Gérer les permissions", category: "Système" },
    { permission: "SUPER_ADMIN_ACCESS", label: "Accès Super Admin", category: "Système" },
  ];
}

// Helper pour grouper les permissions par catégorie
export async function getPermissionsByCategory(): Promise<Record<string, { permission: Permission; label: string }[]>> {
  const permissions = await getPermissionsList();
  const grouped: Record<string, { permission: Permission; label: string }[]> = {};

  permissions.forEach(({ permission, label, category }) => {
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push({ permission, label });
  });

  return grouped;
}
