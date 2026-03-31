import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[var(--beige)] flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[var(--bordeaux)] overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-[var(--bordeaux-light)] rounded-full opacity-30 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[var(--or)] rounded-full opacity-20 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          <div className="animate-float mb-8">
            <Image
              src="/images/logo/logo_raison.jpeg"
              alt="Mascotte OenoClass"
              width={300}
              height={300}
              className="rounded-3xl shadow-2xl"
              priority
            />
          </div>

          <h2 className="text-4xl font-bold text-white font-cormorant text-center mb-4">
            Bienvenue sur OenoClass
          </h2>
          <p className="text-white/80 text-center max-w-md text-lg">
            La plateforme pedagogique de reference pour l&apos;enseignement de
            l&apos;oenologie dans les lycees agricoles.
          </p>

          {/* Stats */}
          <div className="flex gap-12 mt-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-[var(--or)] font-cormorant">
                8
              </div>
              <div className="text-sm text-white/70">Blocs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[var(--or)] font-cormorant">
                45+
              </div>
              <div className="text-sm text-white/70">Activites</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[var(--or)] font-cormorant">
                700+
              </div>
              <div className="text-sm text-white/70">Lycees</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Header */}
        <div className="p-6">
          <Link href="/" className="inline-flex items-center gap-2 text-[var(--gris-tech)] hover:text-[var(--bordeaux)] transition-colors">
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

        {/* Login Content */}
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

            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Connexion</h1>
              <p className="text-[var(--gris-tech)]">
                Connectez-vous pour acceder a votre espace
              </p>
            </div>

            {/* ENT/GAR Connection - Primary */}
            <div className="space-y-4 mb-8">
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
                Se connecter via ENT / GAR
              </button>

              <p className="text-center text-sm text-[var(--gris-light)]">
                Connexion securisee via le Gestionnaire d&apos;Acces aux Ressources
              </p>
            </div>

            {/* Separator */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--beige-dark)]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[var(--beige)] text-[var(--gris-light)]">
                  ou
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <LoginForm />

            {/* Register link */}
            <p className="text-center mt-8 text-[var(--gris-tech)]">
              Vous n&apos;avez pas de compte ?{" "}
              <Link
                href="/register"
                className="text-[var(--bordeaux)] font-medium hover:text-[var(--bordeaux-light)] transition-colors"
              >
                Demander un acces
              </Link>
            </p>

            {/* Help */}
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
                    Premiere connexion ?
                  </h4>
                  <p className="text-sm text-[var(--gris-light)] mt-1">
                    Si votre etablissement est inscrit au GAR, utilisez le bouton
                    &quot;Se connecter via ENT / GAR&quot; avec vos identifiants habituels.
                  </p>
                </div>
              </div>
            </div>
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
