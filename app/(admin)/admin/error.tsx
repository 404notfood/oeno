"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 bg-[var(--danger)] bg-opacity-10 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-[var(--danger)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-[var(--gris-dark)] font-cormorant mb-2">
        Erreur d&apos;administration
      </h2>
      <p className="text-[var(--gris-tech)] max-w-md mb-6">
        {error.message || "Quelque chose s\u2019est mal pass\u00e9. Veuillez r\u00e9essayer."}
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-[var(--bordeaux)] text-white rounded-xl hover:bg-[var(--bordeaux-light)] transition-colors font-medium"
      >
        R&eacute;essayer
      </button>
    </div>
  );
}
