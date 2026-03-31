import Link from "next/link";
import { AdminHeader } from "@/components/admin/layout";
import { getServerSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import {
  getAllRolePermissions,
  getPermissionsByCategory,
} from "@/actions/admin";
import PermissionsManager from "./PermissionsManager";

export default async function PermissionsPage() {
  // Check if user is SUPER_ADMIN
  const session = await getServerSession();

  if (!session) {
    return null; // Will be handled by middleware
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || user.role !== "SUPER_ADMIN") {
    return (
      <>
        <AdminHeader
          title="Acces refuse"
          description="Vous n'avez pas les permissions necessaires"
        />

        <div className="p-6">
          <div className="max-w-lg mx-auto text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-danger/10 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-danger"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gris-dark mb-2">
              Acces restreint
            </h2>
            <p className="text-gris-tech mb-6">
              La gestion des permissions est reservee aux Super Administrateurs.
              <br />
              Contactez un Super Admin si vous avez besoin d&apos;acceder a cette fonctionnalite.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 bg-bordeaux text-white rounded-lg hover:bg-bordeaux-light transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Retour au dashboard
            </Link>
          </div>
        </div>
      </>
    );
  }

  const [rolePermissions, permissionsByCategory] = await Promise.all([
    getAllRolePermissions(),
    getPermissionsByCategory(),
  ]);

  return (
    <>
      <AdminHeader
        title="Gestion des permissions"
        description="Configurez les permissions par role"
      />

      <div className="p-6">
        <PermissionsManager
          rolePermissions={rolePermissions}
          permissionsByCategory={permissionsByCategory}
        />
      </div>
    </>
  );
}
