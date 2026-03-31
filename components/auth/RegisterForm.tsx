"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const role = formData.get("role") as string;
    const terms = formData.get("terms");

    // Validations
    if (!role || !["student", "teacher"].includes(role)) {
      setError("Veuillez sélectionner votre rôle");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      setIsLoading(false);
      return;
    }

    if (!terms) {
      setError("Vous devez accepter les conditions d'utilisation");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signUp.email({
        email,
        password,
        name: `${firstName} ${lastName}`,
      }, {
        body: {
          firstName,
          lastName,
          role: role.toUpperCase(),
        },
      });

      if (result.error) {
        setError(result.error.message || "Erreur lors de l'inscription");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { value: "student", label: "\u00c9l\u00e8ve", icon: "\ud83c\udf93" },
    { value: "teacher", label: "Enseignant", icon: "\ud83d\udc68\u200d\ud83c\udfeb" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Role Selection */}
      <div>
        <label className="block text-sm font-medium text-[var(--gris-dark)] mb-2">
          Vous êtes
        </label>
        <div className="grid grid-cols-2 gap-3">
          {roles.map((role) => (
            <label
              key={role.value}
              className={`relative flex flex-col items-center gap-1 p-3 bg-white border-2 rounded-xl cursor-pointer transition-colors ${
                selectedRole === role.value
                  ? "border-[var(--bordeaux)] bg-[var(--bordeaux)] bg-opacity-5"
                  : "border-[var(--beige-dark)] hover:border-[var(--bordeaux)]"
              }`}
            >
              <input
                type="radio"
                name="role"
                value={role.value}
                className="sr-only"
                required
                disabled={isLoading}
                onChange={(e) => setSelectedRole(e.target.value)}
              />
              <span className="text-xl">{role.icon}</span>
              <span className="text-sm font-medium text-[var(--gris-dark)]">
                {role.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-[var(--gris-dark)] mb-2"
          >
            Prénom
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="Jean"
            className="w-full px-4 py-3 rounded-xl border border-[var(--beige-dark)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--bordeaux)] focus:border-transparent transition-all"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-[var(--gris-dark)] mb-2"
          >
            Nom
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Dupont"
            className="w-full px-4 py-3 rounded-xl border border-[var(--beige-dark)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--bordeaux)] focus:border-transparent transition-all"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-[var(--gris-dark)] mb-2"
        >
          Adresse email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="jean.dupont@lycee.fr"
          className="w-full px-4 py-3 rounded-xl border border-[var(--beige-dark)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--bordeaux)] focus:border-transparent transition-all"
          required
          disabled={isLoading}
        />
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-[var(--gris-dark)] mb-2"
        >
          Mot de passe
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="••••••••"
          className="w-full px-4 py-3 rounded-xl border border-[var(--beige-dark)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--bordeaux)] focus:border-transparent transition-all"
          required
          minLength={8}
          disabled={isLoading}
        />
        <p className="text-xs text-[var(--gris-light)] mt-1">
          Minimum 8 caractères
        </p>
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-[var(--gris-dark)] mb-2"
        >
          Confirmer le mot de passe
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="••••••••"
          className="w-full px-4 py-3 rounded-xl border border-[var(--beige-dark)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--bordeaux)] focus:border-transparent transition-all"
          required
          disabled={isLoading}
        />
      </div>

      {/* Terms */}
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="terms"
          name="terms"
          className="w-4 h-4 mt-1 rounded border-[var(--beige-dark)] text-[var(--bordeaux)] focus:ring-[var(--bordeaux)]"
          required
          disabled={isLoading}
        />
        <label htmlFor="terms" className="text-sm text-[var(--gris-tech)]">
          J&apos;accepte les{" "}
          <Link
            href="/cgu"
            className="text-[var(--bordeaux)] hover:underline"
          >
            conditions générales d&apos;utilisation
          </Link>{" "}
          et la{" "}
          <Link
            href="/confidentialite"
            className="text-[var(--bordeaux)] hover:underline"
          >
            politique de confidentialité
          </Link>
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn bg-[var(--vert)] text-white hover:bg-[var(--vert-light)] text-lg py-4 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Inscription...
          </span>
        ) : (
          "Créer mon compte"
        )}
      </button>
    </form>
  );
}
