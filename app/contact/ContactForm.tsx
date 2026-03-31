"use client";

import { useState } from "react";

interface FormData {
  etablissement: string;
  nom: string;
  email: string;
  telephone: string;
  role: string;
  message: string;
}

const initialFormData: FormData = {
  etablissement: "",
  nom: "",
  email: "",
  telephone: "",
  role: "",
  message: "",
};

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.etablissement.trim()) {
      newErrors.etablissement = "Le nom de l\u2019\u00e9tablissement est requis.";
    }
    if (!formData.nom.trim()) {
      newErrors.nom = "Votre nom est requis.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "L\u2019adresse email est requise.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "L\u2019adresse email n\u2019est pas valide.";
    }
    if (!formData.role) {
      newErrors.role = "Veuillez s\u00e9lectionner votre r\u00f4le.";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Le message est requis.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-[var(--vert)] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-[var(--vert)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="font-cormorant text-3xl text-[var(--bordeaux)] mb-4">
          Demande envoy&eacute;e !
        </h2>
        <p className="text-[var(--gris-tech)] max-w-md mx-auto mb-6">
          Merci pour votre int&eacute;r&ecirc;t pour OenoClass. Notre &eacute;quipe
          vous recontactera &agrave; l&apos;adresse{" "}
          <strong className="text-[var(--gris-dark)]">{formData.email}</strong>{" "}
          dans les 48 heures ouvr&eacute;es.
        </p>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setFormData(initialFormData);
          }}
          className="btn btn-secondary"
        >
          Envoyer une autre demande
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <h2 className="font-cormorant text-2xl text-[var(--bordeaux)] mb-2">
        Formulaire de contact
      </h2>

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Etablissement */}
        <div>
          <label
            htmlFor="etablissement"
            className="block text-sm font-medium text-[var(--gris-dark)] mb-1"
          >
            Nom de l&apos;&eacute;tablissement <span className="text-[var(--danger)]">*</span>
          </label>
          <input
            type="text"
            id="etablissement"
            name="etablissement"
            value={formData.etablissement}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.etablissement
                ? "border-[var(--danger)]"
                : "border-[var(--beige-dark)]"
            } bg-[var(--beige-light)] text-[var(--gris-dark)] focus:outline-none focus:border-[var(--bordeaux)] focus:ring-1 focus:ring-[var(--bordeaux)] transition-colors`}
            placeholder="Lyc&eacute;e agricole..."
          />
          {errors.etablissement && (
            <p className="mt-1 text-sm text-[var(--danger)]">{errors.etablissement}</p>
          )}
        </div>

        {/* Nom */}
        <div>
          <label
            htmlFor="nom"
            className="block text-sm font-medium text-[var(--gris-dark)] mb-1"
          >
            Nom du contact <span className="text-[var(--danger)]">*</span>
          </label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.nom
                ? "border-[var(--danger)]"
                : "border-[var(--beige-dark)]"
            } bg-[var(--beige-light)] text-[var(--gris-dark)] focus:outline-none focus:border-[var(--bordeaux)] focus:ring-1 focus:ring-[var(--bordeaux)] transition-colors`}
            placeholder="Pr&eacute;nom Nom"
          />
          {errors.nom && (
            <p className="mt-1 text-sm text-[var(--danger)]">{errors.nom}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[var(--gris-dark)] mb-1"
          >
            Adresse email <span className="text-[var(--danger)]">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.email
                ? "border-[var(--danger)]"
                : "border-[var(--beige-dark)]"
            } bg-[var(--beige-light)] text-[var(--gris-dark)] focus:outline-none focus:border-[var(--bordeaux)] focus:ring-1 focus:ring-[var(--bordeaux)] transition-colors`}
            placeholder="nom@etablissement.fr"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-[var(--danger)]">{errors.email}</p>
          )}
        </div>

        {/* Telephone */}
        <div>
          <label
            htmlFor="telephone"
            className="block text-sm font-medium text-[var(--gris-dark)] mb-1"
          >
            T&eacute;l&eacute;phone{" "}
            <span className="text-[var(--gris-light)] font-normal">(optionnel)</span>
          </label>
          <input
            type="tel"
            id="telephone"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-[var(--beige-dark)] bg-[var(--beige-light)] text-[var(--gris-dark)] focus:outline-none focus:border-[var(--bordeaux)] focus:ring-1 focus:ring-[var(--bordeaux)] transition-colors"
            placeholder="01 23 45 67 89"
          />
        </div>
      </div>

      {/* Role */}
      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium text-[var(--gris-dark)] mb-1"
        >
          Votre r&ocirc;le <span className="text-[var(--danger)]">*</span>
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.role
              ? "border-[var(--danger)]"
              : "border-[var(--beige-dark)]"
          } bg-[var(--beige-light)] text-[var(--gris-dark)] focus:outline-none focus:border-[var(--bordeaux)] focus:ring-1 focus:ring-[var(--bordeaux)] transition-colors`}
        >
          <option value="">S&eacute;lectionnez votre r&ocirc;le</option>
          <option value="directeur">Directeur / Proviseur</option>
          <option value="enseignant">Enseignant</option>
          <option value="autre">Autre</option>
        </select>
        {errors.role && (
          <p className="mt-1 text-sm text-[var(--danger)]">{errors.role}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-[var(--gris-dark)] mb-1"
        >
          Votre message <span className="text-[var(--danger)]">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.message
              ? "border-[var(--danger)]"
              : "border-[var(--beige-dark)]"
          } bg-[var(--beige-light)] text-[var(--gris-dark)] focus:outline-none focus:border-[var(--bordeaux)] focus:ring-1 focus:ring-[var(--bordeaux)] transition-colors resize-vertical`}
          placeholder="D&eacute;crivez votre projet, le nombre de classes concern&eacute;es, vos attentes..."
        />
        {errors.message && (
          <p className="mt-1 text-sm text-[var(--danger)]">{errors.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-2">
        <p className="text-sm text-[var(--gris-light)]">
          <span className="text-[var(--danger)]">*</span> Champs obligatoires
        </p>
        <button type="submit" className="btn btn-primary text-lg px-8 py-3">
          Envoyer la demande
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}
