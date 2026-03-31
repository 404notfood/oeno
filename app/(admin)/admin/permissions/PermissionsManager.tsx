"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateRolePermissions, type Permission, type UserRole } from "@/actions/admin";

interface RolePermissionData {
  role: UserRole;
  permissions: Permission[];
}

interface PermissionsManagerProps {
  rolePermissions: RolePermissionData[];
  permissionsByCategory: Record<string, { permission: Permission; label: string }[]>;
}

const roleLabels: Record<UserRole, string> = {
  STUDENT: "Élève",
  TEACHER: "Enseignant",
  ADMIN: "Administrateur",
  SUPER_ADMIN: "Super Admin",
};

const roleDescriptions: Record<UserRole, string> = {
  STUDENT: "Accès basique pour consulter le contenu et effectuer des activités",
  TEACHER: "Gestion des classes et création de contenu pédagogique",
  ADMIN: "Administration de l'établissement et gestion des utilisateurs",
  SUPER_ADMIN: "Accès complet à toutes les fonctionnalités (non modifiable)",
};

export default function PermissionsManager({
  rolePermissions,
  permissionsByCategory,
}: PermissionsManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedRole, setSelectedRole] = useState<UserRole>("TEACHER");
  const [editedPermissions, setEditedPermissions] = useState<Record<UserRole, Set<Permission>>>(() => {
    const initial: Record<UserRole, Set<Permission>> = {
      STUDENT: new Set(),
      TEACHER: new Set(),
      ADMIN: new Set(),
      SUPER_ADMIN: new Set(),
    };
    rolePermissions.forEach((rp) => {
      initial[rp.role] = new Set(rp.permissions);
    });
    return initial;
  });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const currentPermissions = editedPermissions[selectedRole];

  const togglePermission = (permission: Permission) => {
    if (selectedRole === "SUPER_ADMIN") return; // Ne pas modifier Super Admin

    const newPermissions = new Set(currentPermissions);
    if (newPermissions.has(permission)) {
      newPermissions.delete(permission);
    } else {
      newPermissions.add(permission);
    }

    setEditedPermissions({
      ...editedPermissions,
      [selectedRole]: newPermissions,
    });
    setHasChanges(true);
  };

  const toggleCategory = (category: string) => {
    if (selectedRole === "SUPER_ADMIN") return;

    const categoryPermissions = permissionsByCategory[category].map((p) => p.permission);
    const allSelected = categoryPermissions.every((p) => currentPermissions.has(p));

    const newPermissions = new Set(currentPermissions);
    categoryPermissions.forEach((p) => {
      if (allSelected) {
        newPermissions.delete(p);
      } else {
        newPermissions.add(p);
      }
    });

    setEditedPermissions({
      ...editedPermissions,
      [selectedRole]: newPermissions,
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (selectedRole === "SUPER_ADMIN") return;

    startTransition(async () => {
      try {
        await updateRolePermissions(selectedRole, Array.from(currentPermissions));
        setMessage({ type: "success", text: "Permissions mises à jour avec succès" });
        setHasChanges(false);
        router.refresh();
      } catch (err) {
        setMessage({
          type: "error",
          text: err instanceof Error ? err.message : "Erreur lors de la mise à jour",
        });
      }
    });
  };

  const handleReset = () => {
    const original = rolePermissions.find((rp) => rp.role === selectedRole);
    if (original) {
      setEditedPermissions({
        ...editedPermissions,
        [selectedRole]: new Set(original.permissions),
      });
      setHasChanges(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-success/10 text-success border border-success/30"
              : "bg-danger/10 text-danger border border-danger/30"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Sélection du rôle */}
      <div className="bg-white rounded-xl shadow-sm border border-beige-dark p-6">
        <h2 className="text-lg font-semibold text-gris-dark mb-4">Sélectionner un rôle</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(["STUDENT", "TEACHER", "ADMIN", "SUPER_ADMIN"] as UserRole[]).map((role) => (
            <button
              key={role}
              onClick={() => {
                setSelectedRole(role);
                setMessage(null);
              }}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedRole === role
                  ? "border-bordeaux bg-bordeaux/5"
                  : "border-beige-dark hover:border-bordeaux/50"
              }`}
            >
              <p className="font-semibold text-gris-dark">{roleLabels[role]}</p>
              <p className="text-xs text-gris-tech mt-1">{roleDescriptions[role]}</p>
              <p className="text-xs text-bordeaux mt-2 font-medium">
                {editedPermissions[role].size} permissions
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Permissions du rôle sélectionné */}
      <div className="bg-white rounded-xl shadow-sm border border-beige-dark p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gris-dark">
              Permissions pour {roleLabels[selectedRole]}
            </h2>
            <p className="text-sm text-gris-tech">
              {selectedRole === "SUPER_ADMIN"
                ? "Le Super Admin a accès à toutes les permissions (non modifiable)"
                : "Cochez les permissions à accorder à ce rôle"}
            </p>
          </div>
          {selectedRole !== "SUPER_ADMIN" && hasChanges && (
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-gris-dark bg-beige rounded-lg hover:bg-beige-dark transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-bordeaux rounded-lg hover:bg-bordeaux-light transition-colors disabled:opacity-50"
              >
                {isPending ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {Object.entries(permissionsByCategory).map(([category, permissions]) => {
            const allSelected = permissions.every((p) => currentPermissions.has(p.permission));
            const someSelected = permissions.some((p) => currentPermissions.has(p.permission));

            return (
              <div key={category} className="border border-beige-dark rounded-lg overflow-hidden">
                <div
                  className={`flex items-center justify-between px-4 py-3 bg-beige/50 ${
                    selectedRole !== "SUPER_ADMIN" ? "cursor-pointer hover:bg-beige" : ""
                  }`}
                  onClick={() => toggleCategory(category)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        allSelected
                          ? "bg-bordeaux border-bordeaux"
                          : someSelected
                          ? "bg-bordeaux/30 border-bordeaux"
                          : "border-gris-light"
                      }`}
                    >
                      {(allSelected || someSelected) && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d={allSelected ? "M5 13l4 4L19 7" : "M5 12h14"}
                          />
                        </svg>
                      )}
                    </div>
                    <span className="font-semibold text-gris-dark">{category}</span>
                  </div>
                  <span className="text-xs text-gris-tech">
                    {permissions.filter((p) => currentPermissions.has(p.permission)).length} /{" "}
                    {permissions.length}
                  </span>
                </div>

                <div className="divide-y divide-beige-dark">
                  {permissions.map(({ permission, label }) => {
                    const isChecked = currentPermissions.has(permission);
                    return (
                      <label
                        key={permission}
                        className={`flex items-center gap-3 px-4 py-3 ${
                          selectedRole !== "SUPER_ADMIN"
                            ? "cursor-pointer hover:bg-beige/30"
                            : "cursor-default"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePermission(permission)}
                          disabled={selectedRole === "SUPER_ADMIN"}
                          className="w-4 h-4 rounded border-gris-light text-bordeaux focus:ring-bordeaux disabled:opacity-50"
                        />
                        <div className="flex-1">
                          <span className="text-sm text-gris-dark">{label}</span>
                          <span className="ml-2 text-xs text-gris-tech font-mono">
                            {permission}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info */}
      <div className="bg-info/10 border border-info/30 rounded-lg p-4">
        <p className="text-sm text-info">
          <strong>Note :</strong> Les modifications de permissions s&apos;appliquent immédiatement à tous
          les utilisateurs du rôle concerné. Les permissions personnalisées par utilisateur peuvent
          être gérées depuis la fiche de chaque utilisateur.
        </p>
      </div>
    </div>
  );
}
