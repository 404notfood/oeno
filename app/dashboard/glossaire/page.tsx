import { prisma } from "@/lib/prisma";
import GlossaireClient from "./GlossaireClient";

async function getGlossaireTerms() {
  const terms = await prisma.glossaryTerm.findMany({
    orderBy: { term: "asc" },
  });

  // Group by first letter
  const grouped = terms.reduce(
    (acc, term) => {
      const letter = term.term[0].toUpperCase();
      if (!acc[letter]) {
        acc[letter] = [];
      }
      acc[letter].push(term);
      return acc;
    },
    {} as Record<string, typeof terms>
  );

  return { terms, grouped };
}

export default async function GlossairePage() {
  const { terms, grouped } = await getGlossaireTerms();
  const letters = Object.keys(grouped).sort();

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Glossaire</h1>
        <p className="text-[var(--gris-tech)]">
          {terms.length} termes pour maîtriser le vocabulaire de l&apos;œnologie.
        </p>
      </div>

      <GlossaireClient terms={terms} letters={letters} />
    </>
  );
}
