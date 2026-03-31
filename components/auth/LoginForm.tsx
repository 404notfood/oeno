"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const rememberMe = formData.get("remember") === "on";

    try {
      const result = await signIn.email({
        email,
        password,
        rememberMe,
      });

      if (result.error) {
        setError(result.error.message || "Email ou mot de passe incorrect");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Une erreur est survenue. Veuillez reessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

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
          placeholder="votre@email.fr"
          className="w-full px-4 py-3 rounded-xl border border-[var(--beige-dark)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--bordeaux)] focus:border-transparent transition-all"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[var(--gris-dark)]"
          >
            Mot de passe
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-[var(--bordeaux)] hover:text-[var(--bordeaux-light)] transition-colors"
          >
            Mot de passe oublie ?
          </Link>
        </div>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="••••••••"
          className="w-full px-4 py-3 rounded-xl border border-[var(--beige-dark)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--bordeaux)] focus:border-transparent transition-all"
          required
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="remember"
          name="remember"
          className="w-4 h-4 rounded border-[var(--beige-dark)] text-[var(--bordeaux)] focus:ring-[var(--bordeaux)]"
          disabled={isLoading}
        />
        <label htmlFor="remember" className="text-sm text-[var(--gris-tech)]">
          Se souvenir de moi
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn btn-secondary text-lg py-4 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
            Connexion...
          </span>
        ) : (
          "Se connecter"
        )}
      </button>
    </form>
  );
}
