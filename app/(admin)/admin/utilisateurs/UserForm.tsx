"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField, SelectField, SwitchField } from "@/components/admin/ui";
import { createUserSchema, updateUserSchema } from "@/lib/validations/admin";
import { createUser, updateUser } from "@/actions/admin";
import type { CreateUserInput, UpdateUserInput } from "@/lib/validations/admin";
import Link from "next/link";

interface Establishment {
  id: string;
  name: string;
  uai: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  establishmentId: string | null;
  emailVerified: boolean;
}

interface UserFormProps {
  user?: User;
  establishments: Establishment[];
}

export default function UserForm({ user, establishments }: UserFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!user;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserInput | UpdateUserInput>({
    resolver: zodResolver(isEditing ? updateUserSchema : createUserSchema),
    defaultValues: isEditing
      ? {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role as CreateUserInput["role"],
          establishmentId: user.establishmentId,
          emailVerified: user.emailVerified,
        }
      : {
          role: "STUDENT",
          isActive: true,
        },
  });

  const onSubmit = async (data: CreateUserInput | UpdateUserInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (isEditing) {
        await updateUser(user.id, data as UpdateUserInput);
      } else {
        await createUser(data as CreateUserInput);
      }
      router.push("/admin/utilisateurs");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions = [
    { value: "STUDENT", label: "Eleve" },
    { value: "TEACHER", label: "Enseignant" },
    { value: "ADMIN", label: "Administrateur" },
    { value: "SUPER_ADMIN", label: "Super Administrateur" },
  ];

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
          Informations personnelles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Prenom"
            {...register("firstName")}
            error={errors.firstName?.message}
            required
          />
          <InputField
            label="Nom"
            {...register("lastName")}
            error={errors.lastName?.message}
            required
          />
        </div>

        <InputField
          label="Email"
          type="email"
          {...register("email")}
          error={errors.email?.message}
          required
        />

        {!isEditing && (
          <InputField
            label="Mot de passe"
            type="password"
            {...register("password")}
            error={(errors as { password?: { message?: string } }).password?.message}
            required
            description="Au moins 8 caracteres, une majuscule, une minuscule et un chiffre"
          />
        )}

        {isEditing && (
          <InputField
            label="Nouveau mot de passe"
            type="password"
            {...register("password")}
            error={(errors as { password?: { message?: string } }).password?.message}
            description="Laissez vide pour conserver le mot de passe actuel"
          />
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-beige-dark p-6 space-y-6">
        <h2 className="text-lg font-semibold text-bordeaux font-cormorant">
          Role et affectation
        </h2>

        <SelectField
          label="Role"
          {...register("role")}
          options={roleOptions}
          error={errors.role?.message}
          required
        />

        <SelectField
          label="Etablissement"
          {...register("establishmentId")}
          options={establishmentOptions}
          error={errors.establishmentId?.message}
          placeholder="Aucun etablissement"
        />

        {isEditing && (
          <SwitchField
            label="Email verifie"
            {...register("emailVerified")}
            error={(errors as { emailVerified?: { message?: string } }).emailVerified?.message}
          />
        )}
      </div>

      <div className="flex items-center justify-end gap-4">
        <Link href="/admin/utilisateurs" className="btn btn-secondary">
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
            "Creer l'utilisateur"
          )}
        </button>
      </div>
    </form>
  );
}
