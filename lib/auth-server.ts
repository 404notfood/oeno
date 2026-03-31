import { auth } from "./auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";

export async function getServerSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function requireAuth() {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Non authentifie");
  }
  return session;
}

export async function requireAdmin() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login?redirect=/admin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    redirect("/dashboard?error=unauthorized");
  }

  return session;
}

export async function requireSuperAdmin() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login?redirect=/admin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || user.role !== "SUPER_ADMIN") {
    redirect("/dashboard?error=unauthorized");
  }

  return session;
}

export async function getCurrentUserWithRole() {
  const session = await getServerSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      avatar: true,
      establishment: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return user;
}
