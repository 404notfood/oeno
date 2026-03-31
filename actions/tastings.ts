"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Types
export interface CreateTastingInput {
  title?: string;
  wineId?: string;
  isBlindTasting?: boolean;
}

// Recuperer les vins disponibles pour une degustation
export async function getAvailableWines() {
  const wines = await prisma.wine.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      type: true,
      color: true,
      vintage: true,
      region: true,
      appellation: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return wines;
}

// Creer une nouvelle degustation
export async function createTasting(data: CreateTastingInput) {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error("Non autorise");
  }

  const tasting = await prisma.tasting.create({
    data: {
      title: data.title || null,
      userId: session.user.id,
      wineId: data.wineId || null,
      isBlindTasting: data.isBlindTasting || false,
      status: "DRAFT",
    },
  });

  revalidatePath("/dashboard/degustations");

  return tasting;
}

// Creer et rediriger vers la nouvelle degustation
export async function createTastingAndRedirect(data: CreateTastingInput) {
  const tasting = await createTasting(data);
  redirect(`/dashboard/degustations/${tasting.id}`);
}

// Recuperer une degustation par ID
export async function getTastingById(id: string) {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error("Non autorise");
  }

  const tasting = await prisma.tasting.findUnique({
    where: { id },
    include: {
      wine: {
        include: {
          appellation: true,
          grapeVarieties: {
            include: {
              grapeVariety: true,
            },
          },
        },
      },
      visualAnalysis: true,
      olfactoryAnalysis: true,
      gustatoryAnalysis: true,
    },
  });

  if (!tasting) {
    return null;
  }

  // Verifier que l'utilisateur a acces a cette degustation
  if (tasting.userId !== session.user.id && session.user.role === "STUDENT") {
    throw new Error("Acces non autorise");
  }

  return tasting;
}

// Mettre a jour une degustation
export async function updateTasting(
  id: string,
  data: {
    title?: string;
    wineId?: string | null;
    isBlindTasting?: boolean;
    conclusion?: string;
    overallScore?: number;
    foodPairings?: string[];
    agingPotential?: string;
  }
) {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error("Non autorise");
  }

  const existing = await prisma.tasting.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Degustation non trouvee");
  }

  if (existing.userId !== session.user.id) {
    throw new Error("Acces non autorise");
  }

  const tasting = await prisma.tasting.update({
    where: { id },
    data,
  });

  revalidatePath("/dashboard/degustations");
  revalidatePath(`/dashboard/degustations/${id}`);

  return tasting;
}

// Soumettre une degustation pour evaluation
export async function submitTasting(id: string) {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error("Non autorise");
  }

  const existing = await prisma.tasting.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Degustation non trouvee");
  }

  if (existing.userId !== session.user.id) {
    throw new Error("Acces non autorise");
  }

  const tasting = await prisma.tasting.update({
    where: { id },
    data: { status: "SUBMITTED" },
  });

  revalidatePath("/dashboard/degustations");
  revalidatePath(`/dashboard/degustations/${id}`);

  return tasting;
}

// Supprimer une degustation
export async function deleteTasting(id: string) {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error("Non autorise");
  }

  const existing = await prisma.tasting.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Degustation non trouvee");
  }

  if (existing.userId !== session.user.id) {
    throw new Error("Acces non autorise");
  }

  // Supprimer les analyses associees
  await prisma.$transaction([
    prisma.visualAnalysis.deleteMany({ where: { tastingId: id } }),
    prisma.olfactoryAnalysis.deleteMany({ where: { tastingId: id } }),
    prisma.gustatoryAnalysis.deleteMany({ where: { tastingId: id } }),
    prisma.tasting.delete({ where: { id } }),
  ]);

  revalidatePath("/dashboard/degustations");
}

// ============================================
// ANALYSES
// ============================================

// Types pour les analyses
export interface VisualAnalysisInput {
  clarity?: string;
  intensity?: string;
  color?: string;
  colorNuance?: string;
  viscosity?: string;
  effervescence?: string;
  notes?: string;
}

export interface OlfactoryAnalysisInput {
  intensity?: string;
  quality?: string;
  aromaFamilies?: string[];
  primaryAromas?: string[];
  secondaryAromas?: string[];
  tertiaryAromas?: string[];
  defects?: string[];
  notes?: string;
}

export interface GustatoryAnalysisInput {
  attackType?: string;
  sweetness?: string;
  acidity?: string;
  tannins?: string;
  alcohol?: string;
  body?: string;
  finish?: string;
  finishLength?: number;
  balance?: string;
  flavors?: string[];
  notes?: string;
}

// Sauvegarder l'analyse visuelle
export async function saveVisualAnalysis(tastingId: string, data: VisualAnalysisInput) {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error("Non autorise");
  }

  const tasting = await prisma.tasting.findUnique({
    where: { id: tastingId },
  });

  if (!tasting || tasting.userId !== session.user.id) {
    throw new Error("Acces non autorise");
  }

  const analysis = await prisma.visualAnalysis.upsert({
    where: { tastingId },
    update: data,
    create: {
      tastingId,
      ...data,
    },
  });

  revalidatePath(`/dashboard/degustations/${tastingId}`);
  return analysis;
}

// Sauvegarder l'analyse olfactive
export async function saveOlfactoryAnalysis(tastingId: string, data: OlfactoryAnalysisInput) {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error("Non autorise");
  }

  const tasting = await prisma.tasting.findUnique({
    where: { id: tastingId },
  });

  if (!tasting || tasting.userId !== session.user.id) {
    throw new Error("Acces non autorise");
  }

  const analysis = await prisma.olfactoryAnalysis.upsert({
    where: { tastingId },
    update: data,
    create: {
      tastingId,
      ...data,
    },
  });

  revalidatePath(`/dashboard/degustations/${tastingId}`);
  return analysis;
}

// Sauvegarder l'analyse gustative
export async function saveGustatoryAnalysis(tastingId: string, data: GustatoryAnalysisInput) {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error("Non autorise");
  }

  const tasting = await prisma.tasting.findUnique({
    where: { id: tastingId },
  });

  if (!tasting || tasting.userId !== session.user.id) {
    throw new Error("Acces non autorise");
  }

  const analysis = await prisma.gustatoryAnalysis.upsert({
    where: { tastingId },
    update: data,
    create: {
      tastingId,
      ...data,
    },
  });

  revalidatePath(`/dashboard/degustations/${tastingId}`);
  return analysis;
}

// ============================================
// ENSEIGNANT - Evaluation des degustations
// ============================================

// Recuperer les degustations soumises (pour enseignant)
export async function getSubmittedTastings() {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error("Non autorise");
  }

  // Verifier que l'utilisateur est enseignant ou admin
  if (session.user.role !== "TEACHER" && session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    throw new Error("Acces reserve aux enseignants");
  }

  const tastings = await prisma.tasting.findMany({
    where: {
      status: { in: ["SUBMITTED", "REVIEWED"] },
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      wine: {
        select: {
          id: true,
          name: true,
          color: true,
          vintage: true,
        },
      },
    },
    orderBy: [
      { status: "asc" }, // SUBMITTED first
      { updatedAt: "desc" },
    ],
  });

  return tastings;
}

// Recuperer une degustation pour evaluation (enseignant)
export async function getTastingForReview(id: string) {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error("Non autorise");
  }

  if (session.user.role !== "TEACHER" && session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    throw new Error("Acces reserve aux enseignants");
  }

  const tasting = await prisma.tasting.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      wine: {
        include: {
          appellation: true,
          grapeVarieties: {
            include: {
              grapeVariety: true,
            },
          },
          sensoryProfile: true,
        },
      },
      visualAnalysis: true,
      olfactoryAnalysis: true,
      gustatoryAnalysis: true,
    },
  });

  return tasting;
}

// Evaluer une degustation (enseignant)
export async function reviewTasting(
  id: string,
  data: {
    teacherScore: number;
    teacherComment: string;
  }
) {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error("Non autorise");
  }

  if (session.user.role !== "TEACHER" && session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    throw new Error("Acces reserve aux enseignants");
  }

  const tasting = await prisma.tasting.findUnique({
    where: { id },
  });

  if (!tasting) {
    throw new Error("Degustation non trouvee");
  }

  if (tasting.status !== "SUBMITTED") {
    throw new Error("Cette degustation ne peut pas etre evaluee");
  }

  const updated = await prisma.tasting.update({
    where: { id },
    data: {
      status: "REVIEWED",
      teacherScore: data.teacherScore,
      teacherComment: data.teacherComment,
    },
  });

  revalidatePath("/enseignant/degustations");
  revalidatePath(`/enseignant/degustations/${id}`);
  revalidatePath(`/dashboard/degustations/${id}`);

  return updated;
}

// Sauvegarder la conclusion
export async function saveTastingConclusion(
  tastingId: string,
  data: {
    conclusion?: string;
    overallScore?: number;
    foodPairings?: string[];
    agingPotential?: string;
  }
) {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error("Non autorise");
  }

  const tasting = await prisma.tasting.findUnique({
    where: { id: tastingId },
  });

  if (!tasting || tasting.userId !== session.user.id) {
    throw new Error("Acces non autorise");
  }

  const updated = await prisma.tasting.update({
    where: { id: tastingId },
    data,
  });

  revalidatePath(`/dashboard/degustations/${tastingId}`);
  return updated;
}
