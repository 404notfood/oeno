"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField, TextareaField, SelectField } from "@/components/admin/ui";
import { createGrapeVarietySchema, updateGrapeVarietySchema } from "@/lib/validations/admin";
import { createGrapeVariety, updateGrapeVariety } from "@/actions/admin";
import type { CreateGrapeVarietyInput, UpdateGrapeVarietyInput } from "@/lib/validations/admin";
import Link from "next/link";

interface GrapeVariety {
  id: string;
  name: string;
  color: string;
  origin: string | null;
  characteristics: string | null;
  imageUrl: string | null;
}

interface GrapeFormProps {
  grape?: GrapeVariety;
}

const grapeColors = [
  { value: "RED", label: "Rouge" },
  { value: "WHITE", label: "Blanc" },
  { value: "ROSE", label: "Rose" },
  { value: "ORANGE", label: "Orange" },
];

export default function GrapeForm({ grape }: GrapeFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!grape;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGrapeVarietyInput | UpdateGrapeVarietyInput>({
    resolver: zodResolver(isEditing ? updateGrapeVarietySchema : createGrapeVarietySchema),
    defaultValues: isEditing
      ? {
          name: grape.name,
          color: grape.color as CreateGrapeVarietyInput["color"],
          origin: grape.origin || "",
          characteristics: grape.characteristics || "",
          imageUrl: grape.imageUrl || "",
        }
      : {
          color: "RED",
        },
  });

  const onSubmit = async (data: CreateGrapeVarietyInput | UpdateGrapeVarietyInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (isEditing) {
        await updateGrapeVariety(grape.id, data as UpdateGrapeVarietyInput);
      } else {
        await createGrapeVariety(data as CreateGrapeVarietyInput);
      }
      router.push("/admin/cepages");
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

      <div className="bg-white rounded-xl shadow-sm border border-beige-dark p-6 space-y-6">
        <h2 className="text-lg font-semibold text-bordeaux font-cormorant">
          Informations du cepage
        </h2>

        <InputField
          label="Nom du cepage"
          {...register("name")}
          error={errors.name?.message}
          required
          placeholder="Ex: Cabernet Sauvignon"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Couleur"
            {...register("color")}
            options={grapeColors}
            error={errors.color?.message}
            required
          />

          <InputField
            label="Origine"
            {...register("origin")}
            error={errors.origin?.message}
            placeholder="Ex: Bordeaux, France"
          />
        </div>

        <TextareaField
          label="Caracteristiques"
          {...register("characteristics")}
          error={errors.characteristics?.message}
          placeholder="Description des caracteristiques du cepage (aromes, tanins, structure...)"
          rows={4}
        />

        <InputField
          label="URL de l'image"
          {...register("imageUrl")}
          error={errors.imageUrl?.message}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="flex items-center justify-end gap-4">
        <Link href="/admin/cepages" className="btn btn-secondary">
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
            "Creer le cepage"
          )}
        </button>
      </div>
    </form>
  );
}
