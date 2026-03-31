"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField, TextareaField, SelectField } from "@/components/admin/ui";
import { createAppellationSchema, updateAppellationSchema } from "@/lib/validations/admin";
import { createAppellation, updateAppellation } from "@/actions/admin";
import type { CreateAppellationInput, UpdateAppellationInput } from "@/lib/validations/admin";
import Link from "next/link";

interface Appellation {
  id: string;
  name: string;
  type: string;
  region: string;
  country: string;
  description: string | null;
  regulations: string | null;
}

interface AppellationFormProps {
  appellation?: Appellation;
}

const appellationTypes = [
  { value: "AOP", label: "AOP - Appellation d'Origine Protegee" },
  { value: "IGP", label: "IGP - Indication Geographique Protegee" },
  { value: "VDF", label: "VDF - Vin de France" },
];

const regions = [
  { value: "Bordeaux", label: "Bordeaux" },
  { value: "Bourgogne", label: "Bourgogne" },
  { value: "Champagne", label: "Champagne" },
  { value: "Alsace", label: "Alsace" },
  { value: "Loire", label: "Vallee de la Loire" },
  { value: "Rhone", label: "Vallee du Rhone" },
  { value: "Provence", label: "Provence" },
  { value: "Languedoc", label: "Languedoc-Roussillon" },
  { value: "Sud-Ouest", label: "Sud-Ouest" },
  { value: "Jura", label: "Jura" },
  { value: "Savoie", label: "Savoie" },
  { value: "Corse", label: "Corse" },
  { value: "Beaujolais", label: "Beaujolais" },
  { value: "Autre", label: "Autre" },
];

export default function AppellationForm({ appellation }: AppellationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!appellation;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAppellationInput | UpdateAppellationInput>({
    resolver: zodResolver(isEditing ? updateAppellationSchema : createAppellationSchema),
    defaultValues: isEditing
      ? {
          name: appellation.name,
          type: appellation.type as CreateAppellationInput["type"],
          region: appellation.region,
          country: appellation.country,
          description: appellation.description || "",
          regulations: appellation.regulations || "",
        }
      : {
          type: "AOP",
          region: "Bordeaux",
          country: "France",
        },
  });

  const onSubmit = async (data: CreateAppellationInput | UpdateAppellationInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (isEditing) {
        await updateAppellation(appellation.id, data as UpdateAppellationInput);
      } else {
        await createAppellation(data as CreateAppellationInput);
      }
      router.push("/admin/appellations");
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
          Informations de l&apos;appellation
        </h2>

        <InputField
          label="Nom de l'appellation"
          {...register("name")}
          error={errors.name?.message}
          required
          placeholder="Ex: Margaux"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Type"
            {...register("type")}
            options={appellationTypes}
            error={errors.type?.message}
            required
          />

          <SelectField
            label="Region"
            {...register("region")}
            options={regions}
            error={errors.region?.message}
            required
          />
        </div>

        <InputField
          label="Pays"
          {...register("country")}
          error={errors.country?.message}
          placeholder="France"
        />

        <TextareaField
          label="Description"
          {...register("description")}
          error={errors.description?.message}
          placeholder="Description de l'appellation..."
          rows={3}
        />

        <TextareaField
          label="Reglementation"
          {...register("regulations")}
          error={errors.regulations?.message}
          placeholder="Reglementation de l'appellation (cepages autorises, rendements...)"
          rows={4}
        />
      </div>

      <div className="flex items-center justify-end gap-4">
        <Link href="/admin/appellations" className="btn btn-secondary">
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
            "Creer l'appellation"
          )}
        </button>
      </div>
    </form>
  );
}
