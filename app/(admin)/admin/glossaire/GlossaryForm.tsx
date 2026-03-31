"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField, TextareaField, SelectField } from "@/components/admin/ui";
import { createGlossaryTermSchema, updateGlossaryTermSchema } from "@/lib/validations/admin";
import { createGlossaryTerm, updateGlossaryTerm } from "@/actions/admin";
import type { CreateGlossaryTermInput, UpdateGlossaryTermInput } from "@/lib/validations/admin";
import Link from "next/link";

interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: string | null;
  relatedTerms: string[];
}

interface GlossaryFormProps {
  glossaryTerm?: GlossaryTerm;
}

const categories = [
  { value: "", label: "Aucune categorie" },
  { value: "Viticulture", label: "Viticulture" },
  { value: "Vinification", label: "Vinification" },
  { value: "Degustation", label: "Degustation" },
  { value: "Cepage", label: "Cepage" },
  { value: "Terroir", label: "Terroir" },
  { value: "Service", label: "Service du vin" },
  { value: "Autre", label: "Autre" },
];

export default function GlossaryForm({ glossaryTerm }: GlossaryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [relatedTermsInput, setRelatedTermsInput] = useState(
    glossaryTerm?.relatedTerms.join(", ") || ""
  );
  const isEditing = !!glossaryTerm;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGlossaryTermInput | UpdateGlossaryTermInput>({
    resolver: zodResolver(isEditing ? updateGlossaryTermSchema : createGlossaryTermSchema),
    defaultValues: isEditing
      ? {
          term: glossaryTerm.term,
          definition: glossaryTerm.definition,
          category: glossaryTerm.category as CreateGlossaryTermInput["category"],
          relatedTerms: glossaryTerm.relatedTerms,
        }
      : {
          relatedTerms: [],
        },
  });

  const onSubmit = async (data: CreateGlossaryTermInput | UpdateGlossaryTermInput) => {
    setIsSubmitting(true);
    setError(null);

    // Parse related terms from comma-separated input
    const relatedTerms = relatedTermsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const submitData = {
      ...data,
      relatedTerms,
    };

    try {
      if (isEditing) {
        await updateGlossaryTerm(glossaryTerm.id, submitData as UpdateGlossaryTermInput);
      } else {
        await createGlossaryTerm(submitData as CreateGlossaryTermInput);
      }
      router.push("/admin/glossaire");
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
          Informations du terme
        </h2>

        <InputField
          label="Terme"
          {...register("term")}
          error={errors.term?.message}
          required
          placeholder="Ex: Tanin"
        />

        <SelectField
          label="Categorie"
          {...register("category")}
          options={categories}
          error={errors.category?.message}
        />

        <TextareaField
          label="Definition"
          {...register("definition")}
          error={errors.definition?.message}
          required
          placeholder="Definition claire et pedagogique du terme..."
          rows={4}
        />

        <div>
          <label className="block text-sm font-medium text-gris-dark mb-1">
            Termes lies
          </label>
          <input
            type="text"
            value={relatedTermsInput}
            onChange={(e) => setRelatedTermsInput(e.target.value)}
            className="w-full px-3 py-2 border border-beige-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-bordeaux/20 focus:border-bordeaux"
            placeholder="Ex: Astringence, Polyphenols, Structure (separes par des virgules)"
          />
          <p className="mt-1 text-sm text-gris-tech">
            Entrez les termes lies separes par des virgules
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4">
        <Link href="/admin/glossaire" className="btn btn-secondary">
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
            "Creer le terme"
          )}
        </button>
      </div>
    </form>
  );
}
