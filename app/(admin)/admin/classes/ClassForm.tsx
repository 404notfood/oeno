"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField, SelectField, SwitchField } from "@/components/admin/ui";
import { createClassSchema, updateClassSchema } from "@/lib/validations/admin";
import { createClass, updateClass } from "@/actions/admin";
import type { CreateClassInput, UpdateClassInput } from "@/lib/validations/admin";
import Link from "next/link";

interface Establishment {
  id: string;
  name: string;
  uai: string;
}

interface ClassGroup {
  id: string;
  name: string;
  year: string;
  level: string | null;
  establishmentId: string;
  isActive: boolean;
}

interface ClassFormProps {
  classGroup?: ClassGroup;
  establishments: Establishment[];
}

const currentYear = new Date().getFullYear();
const yearOptions = [
  { value: `${currentYear}-${currentYear + 1}`, label: `${currentYear}-${currentYear + 1}` },
  { value: `${currentYear + 1}-${currentYear + 2}`, label: `${currentYear + 1}-${currentYear + 2}` },
  { value: `${currentYear - 1}-${currentYear}`, label: `${currentYear - 1}-${currentYear}` },
];

const levelOptions = [
  { value: "CAPa", label: "CAPa" },
  { value: "Seconde Pro", label: "Seconde Pro" },
  { value: "Premiere Pro", label: "Premiere Pro" },
  { value: "Terminale Pro", label: "Terminale Pro" },
  { value: "BTSA 1", label: "BTSA 1ere annee" },
  { value: "BTSA 2", label: "BTSA 2eme annee" },
];

export default function ClassForm({ classGroup, establishments }: ClassFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!classGroup;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateClassInput | UpdateClassInput>({
    resolver: zodResolver(isEditing ? updateClassSchema : createClassSchema),
    defaultValues: isEditing
      ? {
          name: classGroup.name,
          year: classGroup.year,
          level: classGroup.level || "",
          establishmentId: classGroup.establishmentId,
          isActive: classGroup.isActive,
        }
      : {
          year: `${currentYear}-${currentYear + 1}`,
          isActive: true,
        },
  });

  const onSubmit = async (data: CreateClassInput | UpdateClassInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (isEditing) {
        await updateClass(classGroup.id, data as UpdateClassInput);
      } else {
        await createClass(data as CreateClassInput);
      }
      router.push("/admin/classes");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const establishmentOptions = establishments.map((est) => ({
    value: est.id,
    label: `${est.name} (${est.uai})`,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-beige-dark p-6 space-y-6">
        <h2 className="text-lg font-semibold text-bordeaux font-cormorant">
          Informations de la classe
        </h2>

        <InputField
          label="Nom de la classe"
          {...register("name")}
          error={errors.name?.message}
          required
          placeholder="Ex: Terminale Bac Pro CGEA"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Annee scolaire"
            {...register("year")}
            options={yearOptions}
            error={errors.year?.message}
            required
          />
          <SelectField
            label="Niveau"
            {...register("level")}
            options={levelOptions}
            error={errors.level?.message}
            placeholder="Selectionner un niveau"
          />
        </div>

        <SelectField
          label="Etablissement"
          {...register("establishmentId")}
          options={establishmentOptions}
          error={errors.establishmentId?.message}
          required
        />

        <SwitchField
          label="Classe active"
          {...register("isActive")}
          description="Les classes inactives ne sont pas visibles pour les eleves"
        />
      </div>

      <div className="flex items-center justify-end gap-4">
        <Link href="/admin/classes" className="btn btn-secondary">
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
            "Creer la classe"
          )}
        </button>
      </div>
    </form>
  );
}
