"use client";

import { useState, useMemo } from "react";

interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: string | null;
}

interface GlossaireClientProps {
  terms: GlossaryTerm[];
  letters: string[];
}

export default function GlossaireClient({
  terms,
  letters,
}: GlossaireClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set());

  // Filter terms based on search and selected letter
  const filteredTerms = useMemo(() => {
    let result = terms;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (term) =>
          term.term.toLowerCase().includes(query) ||
          term.definition.toLowerCase().includes(query)
      );
    }

    if (selectedLetter) {
      result = result.filter(
        (term) => term.term[0].toUpperCase() === selectedLetter
      );
    }

    return result;
  }, [terms, searchQuery, selectedLetter]);

  // Group filtered terms by letter
  const filteredGrouped = useMemo(() => {
    return filteredTerms.reduce(
      (acc, term) => {
        const letter = term.term[0].toUpperCase();
        if (!acc[letter]) {
          acc[letter] = [];
        }
        acc[letter].push(term);
        return acc;
      },
      {} as Record<string, GlossaryTerm[]>
    );
  }, [filteredTerms]);

  const toggleTerm = (termId: string) => {
    setExpandedTerms((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(termId)) {
        newSet.delete(termId);
      } else {
        newSet.add(termId);
      }
      return newSet;
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLetter(null);
  };

  return (
    <>
      {/* Search and Filter */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--gris-light)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un terme..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--beige-dark)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--bordeaux)] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Clear filters */}
          {(searchQuery || selectedLetter) && (
            <button
              onClick={clearFilters}
              className="btn btn-secondary whitespace-nowrap"
            >
              Effacer les filtres
            </button>
          )}
        </div>

        {/* Letter filter */}
        <div className="mt-4 flex flex-wrap gap-2">
          {letters.map((letter) => (
            <button
              key={letter}
              onClick={() =>
                setSelectedLetter(selectedLetter === letter ? null : letter)
              }
              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                selectedLetter === letter
                  ? "bg-[var(--bordeaux)] text-white"
                  : "bg-[var(--beige)] text-[var(--gris-tech)] hover:bg-[var(--beige-dark)]"
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-[var(--gris-tech)] mb-4">
        {filteredTerms.length} terme{filteredTerms.length > 1 ? "s" : ""} trouvé
        {filteredTerms.length > 1 ? "s" : ""}
      </p>

      {/* Terms list */}
      {Object.keys(filteredGrouped)
        .sort()
        .map((letter) => (
          <div key={letter} className="mb-6">
            <div className="sticky top-20 z-10 bg-[var(--beige)] py-2">
              <h2 className="text-2xl font-bold text-[var(--bordeaux)] font-cormorant">
                {letter}
              </h2>
            </div>
            <div className="space-y-2">
              {filteredGrouped[letter].map((term) => (
                <div
                  key={term.id}
                  className="card cursor-pointer hover:shadow-md transition-all"
                  onClick={() => toggleTerm(term.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-[var(--gris-dark)]">
                        {term.term}
                      </h3>
                      {term.category && (
                        <span className="text-xs text-[var(--gris-light)] bg-[var(--beige)] px-2 py-0.5 rounded">
                          {term.category}
                        </span>
                      )}
                    </div>
                    <svg
                      className={`w-5 h-5 text-[var(--gris-light)] transition-transform ${
                        expandedTerms.has(term.id) ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  {expandedTerms.has(term.id) && (
                    <p className="mt-3 pt-3 border-t border-[var(--beige-dark)] text-[var(--gris-tech)]">
                      {term.definition}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

      {filteredTerms.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-[var(--gris-light)] mb-4">
            Aucun terme trouvé pour votre recherche.
          </p>
          <button onClick={clearFilters} className="btn btn-primary">
            Voir tous les termes
          </button>
        </div>
      )}
    </>
  );
}
