"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField, TextareaField, SelectField, SwitchField } from "@/components/admin/ui";
import { createQuizSchema, updateQuizSchema } from "@/lib/validations/admin";
import { createQuiz, updateQuiz } from "@/actions/admin";
import type { CreateQuizInput, UpdateQuizInput } from "@/lib/validations/admin";
import Link from "next/link";

interface Block {
  id: string;
  number: number;
  title: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  blockId: string | null;
  timeLimit: number | null;
  passingScore: number;
  shuffleQuestions: boolean;
  showCorrection: boolean;
  maxAttempts: number | null;
  isActive: boolean;
}

interface QuizFormProps {
  quiz?: Quiz;
  blocks: Block[];
}

export default function QuizForm({ quiz, blocks }: QuizFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!quiz;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateQuizInput | UpdateQuizInput>({
    resolver: zodResolver(isEditing ? updateQuizSchema : createQuizSchema),
    defaultValues: isEditing
      ? {
          title: quiz.title,
          description: quiz.description || "",
          blockId: quiz.blockId || "",
          timeLimit: quiz.timeLimit || undefined,
          passingScore: quiz.passingScore,
          shuffleQuestions: quiz.shuffleQuestions,
          showCorrection: quiz.showCorrection,
          maxAttempts: quiz.maxAttempts || undefined,
          isActive: quiz.isActive,
        }
      : {
          passingScore: 60,
          shuffleQuestions: true,
          showCorrection: true,
          isActive: true,
        },
  });

  const onSubmit = async (data: CreateQuizInput | UpdateQuizInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (isEditing) {
        await updateQuiz(quiz.id, data as UpdateQuizInput);
      } else {
        await createQuiz(data as CreateQuizInput);
      }
      router.push("/admin/quiz");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const blockOptions = [
    { value: "", label: "Aucun bloc lie" },
    ...blocks.map((b) => ({
      value: b.id,
      label: `Bloc ${b.number} - ${b.title}`,
    })),
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-beige-dark p-6 space-y-6">
        <h2 className="text-lg font-semibold text-bordeaux font-cormorant">
          Informations du quiz
        </h2>

        <InputField
          label="Titre du quiz"
          {...register("title")}
          error={errors.title?.message}
          required
          placeholder="Ex: Quiz sur les appellations bordelaises"
        />

        <TextareaField
          label="Description"
          {...register("description")}
          error={errors.description?.message}
          placeholder="Description du quiz..."
          rows={3}
        />

        <SelectField
          label="Bloc de competence lie"
          {...register("blockId")}
          options={blockOptions}
          error={errors.blockId?.message}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-beige-dark p-6 space-y-6">
        <h2 className="text-lg font-semibold text-bordeaux font-cormorant">
          Parametres du quiz
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Temps limite (minutes)"
            type="number"
            {...register("timeLimit", { valueAsNumber: true })}
            error={errors.timeLimit?.message}
            placeholder="Laisser vide pour illimite"
            min={1}
          />

          <InputField
            label="Score de reussite (%)"
            type="number"
            {...register("passingScore", { valueAsNumber: true })}
            error={errors.passingScore?.message}
            required
            min={0}
            max={100}
          />
        </div>

        <InputField
          label="Nombre max de tentatives"
          type="number"
          {...register("maxAttempts", { valueAsNumber: true })}
          error={errors.maxAttempts?.message}
          placeholder="Laisser vide pour illimite"
          min={1}
        />

        <div className="space-y-4">
          <SwitchField
            label="Melanger les questions"
            {...register("shuffleQuestions")}
            description="Les questions seront presentees dans un ordre aleatoire"
          />

          <SwitchField
            label="Afficher les corrections"
            {...register("showCorrection")}
            description="Afficher les corrections apres la soumission"
          />

          <SwitchField
            label="Quiz actif"
            {...register("isActive")}
            description="Les quiz inactifs ne sont pas accessibles aux eleves"
          />
        </div>
      </div>

      {isEditing && (
        <div className="bg-white rounded-xl shadow-sm border border-beige-dark p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-bordeaux font-cormorant">
                Questions
              </h2>
              <p className="text-sm text-gris-tech">
                Gerez les questions de ce quiz
              </p>
            </div>
            <Link
              href={`/admin/quiz/${quiz.id}/questions`}
              className="btn btn-secondary"
            >
              Gerer les questions
            </Link>
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-4">
        <Link href="/admin/quiz" className="btn btn-secondary">
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
            "Creer le quiz"
          )}
        </button>
      </div>
    </form>
  );
}
