import Image from "next/image";
import Link from "next/link";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[var(--beige)] flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[var(--or)] overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-[var(--or-light)] rounded-full opacity-30 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[var(--bordeaux)] rounded-full opacity-20 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          <div className="animate-float mb-8">
            <Image
              src="/images/logo/logo_raison.jpeg"
              alt="Mascotte OenoClass"
              width={280}
              height={280}
              className="rounded-3xl shadow-2xl"
              priority
            />
          </div>

          <h2 className="text-4xl font-bold text-white font-cormorant text-center mb-4">
            Pas de panique !
          </h2>
          <p className="text-white/90 text-center max-w-md text-lg">
            Ça arrive à tout le monde d&apos;oublier son mot de passe.
            Nous allons vous aider à récupérer l&apos;accès à votre compte.
          </p>

          {/* Steps */}
          <div className="mt-12 space-y-4 max-w-sm">
            {[
              { num: "1", text: "Entrez votre adresse email" },
              { num: "2", text: "Recevez un lien de réinitialisation" },
              { num: "3", text: "Créez un nouveau mot de passe" },
            ].map((step, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-white/20 rounded-xl px-4 py-3"
              >
                <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[var(--or)] font-bold">
                  {step.num}
                </span>
                <span className="text-white">{step.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Header */}
        <div className="p-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-[var(--gris-tech)] hover:text-[var(--bordeaux)] transition-colors"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Retour à la connexion
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {/* Logo mobile */}
            <div className="flex justify-center mb-8 lg:hidden">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/images/logo/favicon_enoclass.svg"
                  alt="OenoClass"
                  width={48}
                  height={48}
                  priority
                />
                <span className="font-cormorant text-3xl font-bold text-[var(--bordeaux)]">
                  OenoClass
                </span>
              </Link>
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-[var(--or)] bg-opacity-10 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-[var(--or)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Mot de passe oublié ?
              </h1>
              <p className="text-[var(--gris-tech)]">
                Entrez votre adresse email et nous vous enverrons un lien pour
                réinitialiser votre mot de passe.
              </p>
            </div>

            {/* Form */}
            <ForgotPasswordForm />

            {/* Info box */}
            <div className="mt-8 p-4 bg-white rounded-xl border border-[var(--beige-dark)]">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[var(--info)] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-[var(--info)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-[var(--gris-dark)] text-sm">
                    Vous utilisez l&apos;ENT / GAR ?
                  </h4>
                  <p className="text-sm text-[var(--gris-light)] mt-1">
                    Si vous vous connectez via votre ENT, contactez
                    l&apos;administrateur de votre établissement pour récupérer vos
                    identifiants.
                  </p>
                </div>
              </div>
            </div>

            {/* Back to login */}
            <p className="text-center mt-8 text-[var(--gris-tech)]">
              Vous vous souvenez de votre mot de passe ?{" "}
              <Link
                href="/login"
                className="text-[var(--bordeaux)] font-medium hover:text-[var(--bordeaux-light)] transition-colors"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 text-center text-sm text-[var(--gris-light)]">
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/mentions-legales"
              className="hover:text-[var(--gris-tech)] transition-colors"
            >
              Mentions légales
            </Link>
            <span>•</span>
            <Link
              href="/confidentialite"
              className="hover:text-[var(--gris-tech)] transition-colors"
            >
              Confidentialité
            </Link>
            <span>•</span>
            <Link
              href="/aide"
              className="hover:text-[var(--gris-tech)] transition-colors"
            >
              Aide
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
