import Image from "next/image";
import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[var(--beige)] flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[var(--vert)] overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-[var(--vert-light)] rounded-full opacity-30 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[var(--or)] rounded-full opacity-20 blur-3xl" />

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
            Rejoignez OenoClass
          </h2>
          <p className="text-white/80 text-center max-w-md text-lg">
            Creez votre compte et commencez votre parcours dans l&apos;univers
            passionnant de l&apos;oenologie.
          </p>

          {/* Benefits */}
          <div className="mt-12 space-y-4 max-w-sm">
            {[
              { icon: "🍇", text: "Acces aux 8 blocs de competences" },
              { icon: "📊", text: "Suivi de progression personnalise" },
              { icon: "🎯", text: "Quiz et activites interactives" },
              { icon: "📚", text: "Ressources pedagogiques completes" },
            ].map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-white/10 rounded-xl px-4 py-3"
              >
                <span className="text-2xl">{benefit.icon}</span>
                <span className="text-white/90">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Header */}
        <div className="p-6">
          <Link
            href="/"
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
            Retour a l&apos;accueil
          </Link>
        </div>

        {/* Register Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {/* Logo mobile */}
            <div className="flex justify-center mb-6 lg:hidden">
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

            <div className="text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Inscription</h1>
              <p className="text-[var(--gris-tech)]">
                Creez votre compte OenoClass
              </p>
            </div>

            {/* ENT/GAR Connection - Primary */}
            <div className="space-y-4 mb-6">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 bg-[var(--bordeaux)] text-white rounded-xl px-6 py-4 font-medium hover:bg-[var(--bordeaux-light)] transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                S&apos;inscrire via ENT / GAR
              </button>

              <p className="text-center text-sm text-[var(--gris-light)]">
                Recommande pour les etablissements connectes au GAR
              </p>
            </div>

            {/* Separator */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--beige-dark)]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[var(--beige)] text-[var(--gris-light)]">
                  ou inscription manuelle
                </span>
              </div>
            </div>

            {/* Registration Form */}
            <RegisterForm />

            {/* Login link */}
            <p className="text-center mt-6 text-[var(--gris-tech)]">
              Vous avez deja un compte ?{" "}
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
              Mentions legales
            </Link>
            <span>•</span>
            <Link
              href="/confidentialite"
              className="hover:text-[var(--gris-tech)] transition-colors"
            >
              Confidentialite
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
