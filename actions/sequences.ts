"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Types
export interface CreateSequenceInput {
  title: string;
  description?: string;
  objectives?: string;
  duration?: number;
  activityIds: string[];
}

export interface SequenceWithCount {
  id: string;
  title: string;
  description: string | null;
  objectives: string | null;
  duration: number | null;
  isPublished: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  teacherId: string;
  _count: {
    activities: number;
  };
}

export interface ActivityForPicker {
  id: string;
  title: string;
  type: string;
  duration: number | null;
  points: number;
}

export interface BlockWithActivities {
  number: number;
  title: string;
  icon: string | null;
  activities: ActivityForPicker[];
}

// Creer une nouvelle sequence pedagogique
export async function createSequence(data: CreateSequenceInput) {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error("Non autorise");
  }

  // Verifier que l'utilisateur est enseignant ou admin
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || (user.role !== "TEACHER" && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    throw new Error("Acces reserve aux enseignants");
  }

  if (!data.title.trim()) {
    throw new Error("Le titre est requis");
  }

  if (data.activityIds.length === 0) {
    throw new Error("Selectionnez au moins une activite");
  }

  // Verifier que les activites existent
  const activities = await prisma.activity.findMany({
    where: {
      id: { in: data.activityIds },
      isActive: true,
    },
    select: { id: true },
  });

  if (activities.length !== data.activityIds.length) {
    throw new Error("Certaines activites selectionnees sont invalides");
  }

  // Creer la sequence avec les activites ordonnees
  await prisma.sequence.create({
    data: {
      title: data.title.trim(),
      description: data.description?.trim() || null,
      objectives: data.objectives?.trim() || null,
      duration: data.duration || null,
      teacherId: session.user.id,
      activities: {
        create: data.activityIds.map((activityId, index) => ({
          activityId,
          order: index,
        })),
      },
    },
  });

  revalidatePath("/enseignant/sequences");
  redirect("/enseignant/sequences");
}

// Recuperer toutes les sequences de l'enseignant connecte
export async function getTeacherSequences(): Promise<SequenceWithCount[]> {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error("Non autorise");
  }

  const sequences = await prisma.sequence.findMany({
    where: {
      teacherId: session.user.id,
    },
    include: {
      _count: {
        select: {
          activities: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return sequences;
}

// Recuperer toutes les activites actives groupees par bloc de competences
export async function getAvailableActivities(): Promise<BlockWithActivities[]> {
  const blocks = await prisma.competencyBlock.findMany({
    where: { isActive: true },
    include: {
      activities: {
        where: { isActive: true },
        select: {
          id: true,
          title: true,
          type: true,
          duration: true,
          points: true,
        },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { number: "asc" },
  });

  return blocks.map((block) => ({
    number: block.number,
    title: block.title,
    icon: block.icon,
    activities: block.activities,
  }));
}
