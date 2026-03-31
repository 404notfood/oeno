"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField, TextareaField, SwitchField } from "@/components/admin/ui";
import { createEstablishmentSchema, updateEstablishmentSchema } from "@/lib/validations/admin";
import { createEstablishment, updateEstablishment } from "@/actions/admin";
import type { CreateEstablishmentInput, UpdateEstablishmentInput } from "@/lib/validations/admin";
import Link from "next/link";

interface Establishment {
  id: string;
  uai: string;
  name: string;
  address: string | null;
  city: string | null;
  zipCode: string | null;
  region: string | null;
  phone: string | null;
  email: string | null;
  isActive: boolean;
}

interface EstablishmentFormProps {
  establishment?: Establishment;
}

export default function EstablishmentForm({ establishment }: EstablishmentFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!establishment;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEstablishmentInput | UpdateEstablishmentInput>({
    resolver: zodResolver(isEditing ? updateEstablishmentSchema : createEstablishmentSchema),
    defaultValues: isEditing
      ? {
          uai: establishment.uai,
          name: establishment.name,
          address: establishment.address || "",
          city: establishment.city || "",
          zipCode: establishment.zipCode || "",
          region: establishment.region || "",
          phone: establishment.phone || "",
          email: establishment.email || "",
          isActive: establishment.isActive,
        }
      : {
          isActive: true,
        },
  });

  const onSubmit = async (data: CreateEstablishmentInput | UpdateEstablishmentInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (isEditing) {
        await updateEstablishment(establishment.id, data as UpdateEstablishmentInput);
      } else {
        await createEstablishment(data as CreateEstablishmentInput);
      }
      router.push("/admin/etablissements");
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
          Informations generales
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Code UAI"
            {...register("uai")}
            error={errors.uai?.message}
            required
            placeholder="0000000X"
            description="Code unique de l'etablissement (7 chiffres + 1 lettre)"
          />
          <InputField
            label="Nom de l'etablissement"
            {...register("name")}
            error={errors.name?.message}
            required
          />
        </div>

        <TextareaField
          label="Adresse"
          {...register("address")}
          error={errors.address?.message}
          rows={2}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="Code postal"
            {...register("zipCode")}
            error={errors.zipCode?.message}
            placeholder="00000"
          />
          <InputField
            label="Ville"
            {...register("city")}
            error={errors.city?.message}
          />
          <InputField
            label="Region"
            {...register("region")}
            error={errors.region?.message}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-beige-dark p-6 space-y-6">
        <h2 className="text-lg font-semibold text-bordeaux font-cormorant">
          Coordonnees
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Telephone"
            type="tel"
            {...register("phone")}
            error={errors.phone?.message}
            placeholder="0123456789"
          />
          <InputField
            label="Email"
            type="email"
            {...register("email")}
            error={errors.email?.message}
          />
        </div>

        <SwitchField
          label="Etablissement actif"
          {...register("isActive")}
          description="Les etablissements inactifs ne peuvent pas se connecter"
        />
      </div>

      <div className="flex items-center justify-end gap-4">
        <Link href="/admin/etablissements" className="btn btn-secondary">
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
            "Creer l'etablissement"
          )}
        </button>
      </div>
    </form>
  );
}
