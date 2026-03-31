import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--beige)] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-[var(--bordeaux)] font-cormorant mb-4">404</p>
        <h1 className="text-3xl font-bold text-[var(--gris-dark)] font-cormorant mb-2">
          Page introuvable
        </h1>
        <p className="text-[var(--gris-tech)] max-w-md mx-auto mb-8">
          Cette page n&apos;existe pas ou a &eacute;t&eacute; d&eacute;plac&eacute;e.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--bordeaux)] text-white rounded-xl hover:bg-[var(--bordeaux-light)] transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour &agrave; l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
