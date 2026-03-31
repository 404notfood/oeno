"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";
import { createAuditLog } from "./audit";
import { revalidatePath } from "next/cache";

// Types
export interface SystemSettingValue {
  id: string;
  key: string;
  value: unknown;
  category: string;
  label: string | null;
  description: string | null;
  isPublic: boolean;
}

// Paramètres par défaut
const DEFAULT_SETTINGS: Record<string, { value: unknown; category: string; label: string; description: string; isPublic: boolean }> = {
  // Général
  "app.name": {
    value: "Œnoclass",
    category: "general",
    label: "Nom de l'application",
    description: "Nom affiché dans l'interface",
    isPublic: true,
  },
  "app.description": {
    value: "Plateforme pédagogique en œnologie",
    category: "general",
    label: "Description",
    description: "Description courte de l'application",
    isPublic: true,
  },
  "app.maintenance": {
    value: false,
    category: "general",
    label: "Mode maintenance",
    description: "Activer le mode maintenance (bloque l'accès aux utilisateurs)",
    isPublic: true,
  },
  "app.maintenanceMessage": {
    value: "L'application est en maintenance. Veuillez réessayer plus tard.",
    category: "general",
    label: "Message de maintenance",
    description: "Message affiché pendant la maintenance",
    isPublic: true,
  },

  // Authentification
  "auth.allowRegistration": {
    value: false,
    category: "auth",
    label: "Inscription publique",
    description: "Autoriser les inscriptions sans invitation",
    isPublic: false,
  },
  "auth.requireEmailVerification": {
    value: true,
    category: "auth",
    label: "Vérification email",
    description: "Exiger la vérification de l'email",
    isPublic: false,
  },
  "auth.sessionDuration": {
    value: 0,
    category: "auth",
    label: "Durée de session",
    description: "Session = fermeture navigateur (conformité GAR/Education)",
    isPublic: false,
  },
  "auth.garEnabled": {
    value: true,
    category: "auth",
    label: "Connexion GAR",
    description: "Activer la connexion via GAR/ENT",
    isPublic: true,
  },

  // Email
  "email.fromName": {
    value: "Œnoclass",
    category: "email",
    label: "Nom expéditeur",
    description: "Nom affiché pour les emails sortants",
    isPublic: false,
  },
  "email.fromEmail": {
    value: "noreply@oenoclass.fr",
    category: "email",
    label: "Email expéditeur",
    description: "Adresse email pour les emails sortants",
    isPublic: false,
  },
  "email.supportEmail": {
    value: "support@oenoclass.fr",
    category: "email",
    label: "Email support",
    description: "Adresse email du support",
    isPublic: true,
  },

  // Fonctionnalités
  "features.tastings": {
    value: true,
    category: "features",
    label: "Module Dégustations",
    description: "Activer le module de dégustation",
    isPublic: true,
  },
  "features.quizzes": {
    value: true,
    category: "features",
    label: "Module Quiz",
    description: "Activer le module de quiz",
    isPublic: true,
  },
  "features.aromaWheel": {
    value: true,
    category: "features",
    label: "Roue des arômes",
    description: "Activer la roue des arômes interactive",
    isPublic: true,
  },
  "features.glossary": {
    value: true,
    category: "features",
    label: "Glossaire",
    description: "Activer le glossaire",
    isPublic: true,
  },
  "features.portfolio": {
    value: false,
    category: "features",
    label: "Portfolio élève",
    description: "Activer le portfolio des élèves",
    isPublic: true,
  },

  // Limites
  "limits.maxFileSize": {
    value: 10,
    category: "limits",
    label: "Taille max fichier (Mo)",
    description: "Taille maximale des fichiers uploadés",
    isPublic: false,
  },
  "limits.maxStudentsPerClass": {
    value: 35,
    category: "limits",
    label: "Max élèves par classe",
    description: "Nombre maximum d'élèves par classe",
    isPublic: false,
  },
};

// Helper pour accéder au modèle SystemSetting de manière sécurisée
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSystemSettingModel = () => (prisma as any).systemSetting;

// Récupérer tous les paramètres
export async function getSettings(category?: string): Promise<SystemSettingValue[]> {
  await requireAdmin();

  let settings: Array<{
    id: string;
    key: string;
    value: unknown;
    category: string;
    label: string | null;
    description: string | null;
    isPublic: boolean;
  }> = [];

  try {
    const model = getSystemSettingModel();
    if (model) {
      const where = category ? { category } : {};
      settings = await model.findMany({
        where,
        orderBy: [{ category: "asc" }, { key: "asc" }],
      });
    }
  } catch {
    // Le modèle n'existe pas encore, on utilise les valeurs par défaut
  }

  // Fusionner avec les paramètres par défaut
  const result: SystemSettingValue[] = [];
  const existingKeys = new Set(settings.map((s) => s.key));

  // Ajouter les paramètres existants
  for (const setting of settings) {
    result.push({
      id: setting.id,
      key: setting.key,
      value: setting.value,
      category: setting.category,
      label: setting.label,
      description: setting.description,
      isPublic: setting.isPublic,
    });
  }

  // Ajouter les paramètres par défaut manquants
  for (const [key, defaultSetting] of Object.entries(DEFAULT_SETTINGS)) {
    if (!existingKeys.has(key) && (!category || defaultSetting.category === category)) {
      result.push({
        id: "",
        key,
        value: defaultSetting.value,
        category: defaultSetting.category,
        label: defaultSetting.label,
        description: defaultSetting.description,
        isPublic: defaultSetting.isPublic,
      });
    }
  }

  return result.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.key.localeCompare(b.key);
  });
}

// Récupérer un paramètre spécifique
export async function getSetting(key: string): Promise<unknown> {
  try {
    const model = getSystemSettingModel();
    if (model) {
      const setting = await model.findUnique({
        where: { key },
        select: { value: true },
      });
      if (setting) {
        return setting.value;
      }
    }
  } catch {
    // Modèle non disponible
  }

  return DEFAULT_SETTINGS[key]?.value ?? null;
}

// Récupérer les paramètres publics (pour le client)
export async function getPublicSettings(): Promise<Record<string, unknown>> {
  const result: Record<string, unknown> = {};

  // Ajouter les paramètres par défaut publics
  for (const [key, defaultSetting] of Object.entries(DEFAULT_SETTINGS)) {
    if (defaultSetting.isPublic) {
      result[key] = defaultSetting.value;
    }
  }

  try {
    const model = getSystemSettingModel();
    if (model) {
      const settings = await model.findMany({
        where: { isPublic: true },
        select: { key: true, value: true },
      });

      // Remplacer par les valeurs en base
      for (const setting of settings) {
        result[setting.key] = setting.value;
      }
    }
  } catch {
    // Modèle non disponible
  }

  return result;
}

// Mettre à jour un paramètre
export async function updateSetting(key: string, value: unknown): Promise<void> {
  await requireAdmin();

  const defaultSetting = DEFAULT_SETTINGS[key];

  try {
    const model = getSystemSettingModel();
    if (!model) {
      throw new Error("Le système de paramètres n'est pas encore configuré. Exécutez 'npx prisma migrate dev'.");
    }

    const existing = await model.findUnique({
      where: { key },
      select: { value: true },
    });

    if (existing) {
      await model.update({
        where: { key },
        data: { value: value as object },
      });
    } else {
      await model.create({
        data: {
          key,
          value: value as object,
          category: defaultSetting?.category || "general",
          label: defaultSetting?.label || null,
          description: defaultSetting?.description || null,
          isPublic: defaultSetting?.isPublic || false,
        },
      });
    }

    await createAuditLog({
      action: "UPDATE_SETTING",
      entityType: "SystemSetting",
      entityId: key,
      oldValues: existing ? { value: existing.value } : undefined,
      newValues: { value },
    });

    revalidatePath("/admin/parametres");
  } catch (err) {
    if (err instanceof Error && err.message.includes("pas encore configuré")) {
      throw err;
    }
    throw new Error("Erreur lors de la mise à jour du paramètre");
  }
}

// Mettre à jour plusieurs paramètres
export async function updateSettings(settings: Record<string, unknown>): Promise<void> {
  await requireAdmin();

  for (const [key, value] of Object.entries(settings)) {
    await updateSetting(key, value);
  }
}

// Réinitialiser un paramètre à sa valeur par défaut
export async function resetSetting(key: string): Promise<void> {
  await requireAdmin();

  try {
    const model = getSystemSettingModel();
    if (!model) {
      throw new Error("Le système de paramètres n'est pas encore configuré.");
    }

    const existing = await model.findUnique({
      where: { key },
      select: { id: true, value: true },
    });

    if (existing) {
      await model.delete({
        where: { key },
      });

      await createAuditLog({
        action: "RESET_SETTING",
        entityType: "SystemSetting",
        entityId: key,
        oldValues: { value: existing.value },
        newValues: { value: DEFAULT_SETTINGS[key]?.value || null },
      });

      revalidatePath("/admin/parametres");
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes("pas encore configuré")) {
      throw err;
    }
    throw new Error("Erreur lors de la réinitialisation du paramètre");
  }
}

// Obtenir les catégories disponibles
export async function getSettingCategories(): Promise<{ id: string; label: string }[]> {
  return [
    { id: "general", label: "Général" },
    { id: "auth", label: "Authentification" },
    { id: "email", label: "Email" },
    { id: "features", label: "Fonctionnalités" },
    { id: "limits", label: "Limites" },
  ];
}
