"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DataTable, Badge, ConfirmDialog } from "@/components/admin/ui";
import { deleteActivity } from "@/actions/admin";
import type { Column } from "@/components/admin/ui/DataTable";

interface Activity {
  id: string;
  title: string;
  description: string | null;
  type: string;
  order: number;
  isActive: boolean;
  duration: number | null;
}

interface BlocActivitiesTableProps {
  activities: Activity[];
  blocId: string;
  activityTypeLabels: Record<string, string>;
}

const typeColors: Record<string, "success" | "info" | "warning" | "danger" | "default"> = {
  QUIZ: "info",
  FRISE: "warning",
  SCHEMA: "success",
  ROUE_AROMES: "danger",
  FICHE_ANALYSE: "info",
  ETUDE_CAS: "warning",
  ARBRE_DIAGNOSTIC: "success",
  APPARIEMENT: "default",
};

export default function BlocActivitiesTable({
  activities,
  blocId,
  activityTypeLabels,
}: BlocActivitiesTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteActivity(deleteId);
      router.refresh();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const columns: Column<Activity>[] = [
    {
      key: "order",
      header: "#",
      render: (activity) => (
        <span className="text-sm font-medium text-gris-tech">{activity.order}</span>
      ),
    },
    {
      key: "title",
      header: "Titre",
      render: (activity) => (
        <div>
          <p className="font-medium text-gris-dark">{activity.title}</p>
          {activity.description && (
            <p className="text-xs text-gris-tech truncate max-w-xs">
              {activity.description}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (activity) => (
        <Badge variant={typeColors[activity.type] || "default"}>
          {activityTypeLabels[activity.type] || activity.type}
        </Badge>
      ),
    },
    {
      key: "duration",
      header: "Duree",
      render: (activity) => (
        <span className="text-sm text-gris-tech">
          {activity.duration ? `${activity.duration} min` : "-"}
        </span>
      ),
    },
    {
      key: "isActive",
      header: "Statut",
      render: (activity) => (
        <Badge variant={activity.isActive ? "success" : "default"}>
          {activity.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (activity) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/blocs/${blocId}/activites/${activity.id}`}
            className="p-2 text-gris-tech hover:text-bordeaux hover:bg-beige rounded-lg transition-colors"
            title="Modifier"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Link>
          <button
            onClick={() => setDeleteId(activity.id)}
            className="p-2 text-gris-tech hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
            title="Supprimer"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  const sortedActivities = [...activities].sort((a, b) => a.order - b.order);

  return (
    <>
      <DataTable
        data={sortedActivities}
        columns={columns}
        keyExtractor={(activity) => activity.id}
        emptyMessage="Aucune activite dans ce bloc"
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Supprimer l'activite"
        message="Etes-vous sur de vouloir supprimer cette activite ? Cette action est irreversible."
        confirmText="Supprimer"
        loading={isDeleting}
        variant="danger"
      />
    </>
  );
}
