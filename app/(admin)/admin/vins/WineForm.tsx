"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField, TextareaField, SelectField, SwitchField } from "@/components/admin/ui";
import { createWineSchema, updateWineSchema } from "@/lib/validations/admin";
import { createWine, updateWine } from "@/actions/admin";
import type { CreateWineInput, UpdateWineInput } from "@/lib/validations/admin";
import Link from "next/link";

interface Appellation {
  id: string;
  name: string;
  region: string;
}

interface GrapeVariety {
  id: string;
  name: string;
}

interface Wine {
  id: string;
  name: string;
  type: string;
  color: string;
  vintage: number | null;
  isAlcoholic: boolean;
  alcoholLevel: number | null;
  producer: string | null;
  region: string | null;
  country: string;
  imageUrl: string | null;
  description: string | null;
  climate: string | null;
  appellationId: string | null;
  isActive: boolean;
  grapeVarieties: { grapeVarietyId: string; percentage: number | null }[];
}

interface WineFormProps {
  wine?: Wine;
  appellations: Appellation[];
  grapeVarieties: GrapeVariety[];
}

const wineTypes = [
  { value: "STILL", label: "Tranquille" },
  { value: "SPARKLING", label: "Effervescent" },
  { value: "FORTIFIED", label: "Mute/Fortifie" },
  { value: "SWEET", label: "Liquoreux" },
];

const wineColors = [
  { value: "RED", label: "Rouge" },
  { value: "WHITE", label: "Blanc" },
  { value: "ROSE", label: "Rose" },
  { value: "ORANGE", label: "Orange" },
];

const currentYear = new Date().getFullYear();

export default function WineForm({ wine, appellations, grapeVarieties }: WineFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGrapes, setSelectedGrapes] = useState<string[]>(
    wine?.grapeVarieties.map((g) => g.grapeVarietyId) || []
  );
  const isEditing = !!wine;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateWineInput | UpdateWineInput>({
    resolver: zodResolver(isEditing ? updateWineSchema : createWineSchema),
    defaultValues: isEditing
      ? {
          name: wine.name,
          type: wine.type as CreateWineInput["type"],
          color: wine.color as CreateWineInput["color"],
          vintage: wine.vintage || undefined,
          isAlcoholic: wine.isAlcoholic,
          alcoholLevel: wine.alcoholLevel || undefined,
          producer: wine.producer || "",
          region: wine.region || "",
          country: wine.country || "France",
          imageUrl: wine.imageUrl || "",
          description: wine.description || "",
          climate: wine.climate || "",
          appellationId: wine.appellationId || "",
          grapeVarietyIds: wine.grapeVarieties.map((g) => ({
            grapeVarietyId: g.grapeVarietyId,
            percentage: g.percentage,
          })),
        }
      : {
          type: "STILL",
          color: "RED",
          isAlcoholic: true,
          country: "France",
          grapeVarietyIds: [],
        },
  });

  const onSubmit = async (data: CreateWineInput | UpdateWineInput) => {
    setIsSubmitting(true);
    setError(null);

    const submitData = {
      ...data,
      grapeVarietyIds: selectedGrapes.map((id) => ({ grapeVarietyId: id })),
    };

    try {
      if (isEditing) {
        await updateWine(wine.id, submitData as UpdateWineInput);
      } else {
        await createWine(submitData as CreateWineInput);
      }
      router.push("/admin/vins");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const appellationOptions = [
    { value: "", label: "Aucune appellation" },
    ...appellations.map((a) => ({
      value: a.id,
      label: `${a.name} (${a.region})`,
    })),
  ];

  const toggleGrape = (grapeId: string) => {
    setSelectedGrapes((prev) =>
      prev.includes(grapeId)
        ? prev.filter((id) => id !== grapeId)
        : [...prev, grapeId]
    );
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
          Informations generales
        </h2>

        <InputField
          label="Nom du vin"
          {...register("name")}
          error={errors.name?.message}
          required
          placeholder="Ex: Chateau Margaux 2015"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Type"
            {...register("type")}
            options={wineTypes}
            error={errors.type?.message}
            required
          />

          <SelectField
            label="Couleur"
            {...register("color")}
            options={wineColors}
            error={errors.color?.message}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Millesime"
            type="number"
            {...register("vintage", { valueAsNumber: true })}
            error={errors.vintage?.message}
            placeholder="Ex: 2015"
            min={1900}
            max={currentYear}
          />

          <InputField
            label="Degre d'alcool (%)"
            type="number"
            step="0.1"
            {...register("alcoholLevel", { valueAsNumber: true })}
            error={errors.alcoholLevel?.message}
            placeholder="Ex: 13.5"
            min={0}
            max={25}
          />
        </div>

        <InputField
          label="Producteur"
          {...register("producer")}
          error={errors.producer?.message}
          placeholder="Ex: Chateau Margaux"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="Region"
            {...register("region")}
            error={errors.region?.message}
            placeholder="Ex: Bordeaux"
          />

          <InputField
            label="Pays"
            {...register("country")}
            error={errors.country?.message}
            placeholder="Ex: France"
          />

          <InputField
            label="Climat"
            {...register("climate")}
            error={errors.climate?.message}
            placeholder="Ex: Tempere"
          />
        </div>

        <SelectField
          label="Appellation"
          {...register("appellationId")}
          options={appellationOptions}
          error={errors.appellationId?.message}
        />

        <InputField
          label="URL de l'image"
          {...register("imageUrl")}
          error={errors.imageUrl?.message}
          placeholder="https://example.com/image.jpg"
        />

        <TextareaField
          label="Description"
          {...register("description")}
          error={errors.description?.message}
          placeholder="Description du vin..."
          rows={3}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-beige-dark p-6 space-y-6">
        <h2 className="text-lg font-semibold text-bordeaux font-cormorant">
          Cepages
        </h2>
        <p className="text-sm text-gris-tech">
          Selectionnez les cepages composant ce vin
        </p>

        <div className="flex flex-wrap gap-2">
          {grapeVarieties.map((grape) => (
            <button
              key={grape.id}
              type="button"
              onClick={() => toggleGrape(grape.id)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                selectedGrapes.includes(grape.id)
                  ? "bg-bordeaux text-white"
                  : "bg-beige text-gris-dark hover:bg-beige-dark"
              }`}
            >
              {grape.name}
            </button>
          ))}
        </div>
        {grapeVarieties.length === 0 && (
          <p className="text-sm text-gris-light italic">
            Aucun cepage disponible. Creez d&apos;abord des cepages.
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-beige-dark p-6 space-y-6">
        <h2 className="text-lg font-semibold text-bordeaux font-cormorant">
          Options
        </h2>

        <SwitchField
          label="Vin alcoolise"
          {...register("isAlcoholic")}
          description="Decocher pour les vins sans alcool"
        />

        <SwitchField
          label="Vin actif"
          {...register("isActive")}
          description="Les vins inactifs ne sont pas visibles dans les activites"
        />
      </div>

      <div className="flex items-center justify-end gap-4">
        <Link href="/admin/vins" className="btn btn-secondary">
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
            "Creer le vin"
          )}
        </button>
      </div>
    </form>
  );
}
