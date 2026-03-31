"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField, SelectField, TextareaField, SwitchField } from "@/components/admin/ui";
import { createActivitySchema, updateActivitySchema } from "@/lib/validations/admin";
import { createActivity, updateActivity } from "@/actions/admin";
import type { CreateActivityInput, UpdateActivityInput } from "@/lib/validations/admin";
import Link from "next/link";

interface Activity {
  id: string;
  title: string;
  description: string | null;
  type: string;
  order: number;
  duration: number | null;
  isActive: boolean;
  blockId: string;
}

interface ActivityFormProps {
  activity?: Activity;
  blockId: string;
}

const activityTypes = [
  { value: "QUIZ", label: "Quiz" },
  { value: "FRISE", label: "Frise chronologique" },
  { value: "SCHEMA", label: "Schema interactif" },
  { value: "ROUE_AROMES", label: "Roue des aromes" },
  { value: "FICHE_ANALYSE", label: "Fiche d'analyse sensorielle" },
  { value: "ETUDE_CAS", label: "Etude de cas" },
  { value: "ARBRE_DIAGNOSTIC", label: "Arbre de diagnostic" },
  { value: "APPARIEMENT", label: "Appariement" },
];

export default function ActivityForm({ activity, blockId }: ActivityFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!activity;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateActivityInput | UpdateActivityInput>({
    resolver: zodResolver(isEditing ? updateActivitySchema : createActivitySchema),
    defaultValues: isEditing
      ? {
          title: activity.title,
          description: activity.description || "",
          type: activity.type as CreateActivityInput["type"],
          order: activity.order,
          duration: activity.duration || undefined,
          isActive: activity.isActive,
          blockId: activity.blockId,
        }
      : {
          blockId,
          order: 1,
          isActive: true,
        },
  });

  const onSubmit = async (data: CreateActivityInput | UpdateActivityInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (isEditing) {
        await updateActivity(activity.id, data as UpdateActivityInput);
      } else {
        await createActivity(data as CreateActivityInput);
      }
      router.push(`/admin/blocs/${blockId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      <input type="hidden" {...register("blockId")} value={blockId} />

      <div className="bg-white rounded-xl shadow-sm border border-beige-dark p-6 space-y-6">
        <h2 className="text-lg font-semibold text-bordeaux font-cormorant">
          Informations de l&apos;activit&eacute;
        </h2>

        <InputField
          label="Titre de l'activite"
          {...register("title")}
          error={errors.title?.message}
          required
          placeholder="Ex: Quiz sur les cepages"
        />

        <TextareaField
          label="Description"
          {...register("description")}
          error={errors.description?.message}
          placeholder="Description detaillee de l'activite..."
          rows={3}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectField
            label="Type d'activite"
            {...register("type")}
            options={activityTypes}
            error={errors.type?.message}
            required
          />

          <InputField
            label="Ordre"
            type="number"
            {...register("order", { valueAsNumber: true })}
            error={errors.order?.message}
            required
            min={1}
          />

          <InputField
            label="Duree (minutes)"
            type="number"
            {...register("duration", { valueAsNumber: true })}
            error={errors.duration?.message}
            placeholder="Ex: 30"
            min={1}
          />
        </div>

        <SwitchField
          label="Activite active"
          {...register("isActive")}
          description="Les activites inactives ne sont pas visibles pour les eleves"
        />
      </div>

      <div className="flex items-center justify-end gap-4">
        <Link href={`/admin/blocs/${blockId}`} className="btn btn-secondary">
          Annuler
        </Link>
        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              {isEditing ? "Enregistrement..." : "Creation..."}
            </>
          ) : isEditing ? (
            "Enregistrer"
          ) : (
            "Creer l'activite"
          )}
        </button>
      </div>
    </form>
  );
}
