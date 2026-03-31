"use client";

import { useState } from "react";

interface Aroma {
  id: string;
  name: string;
  description: string | null;
}

interface Subcategory {
  id: string;
  name: string;
  aromas: Aroma[];
}

interface Category {
  id: string;
  name: string;
  color: string | null;
  description: string | null;
  subCategories: Subcategory[];
}

interface AromesClientProps {
  categories: Category[];
}

export default function AromesClient({ categories }: AromesClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<Subcategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAromas, setSelectedAromas] = useState<Set<string>>(new Set());

  const toggleAroma = (aromaId: string) => {
    setSelectedAromas(prev => {
      const next = new Set(prev);
      if (next.has(aromaId)) {
        next.delete(aromaId);
      } else {
        next.add(aromaId);
      }
      return next;
    });
  };

  // Filter aromas based on search
  const searchResults =
    searchQuery.length >= 2
      ? categories.flatMap((cat) =>
          cat.subCategories.flatMap((subcat) =>
            subcat.aromas
              .filter((aroma) =>
                aroma.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((aroma) => ({
                ...aroma,
                category: cat,
                subcategory: subcat,
              }))
          )
        )
      : [];

  const handleCategoryClick = (category: Category) => {
    if (selectedCategory?.id === category.id) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    } else {
      setSelectedCategory(category);
      setSelectedSubcategory(null);
    }
  };

  const handleSubcategoryClick = (subcategory: Subcategory) => {
    if (selectedSubcategory?.id === subcategory.id) {
      setSelectedSubcategory(null);
    } else {
      setSelectedSubcategory(subcategory);
    }
  };

  return (
    <>
      {/* Search */}
      <div className="card mb-6">
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
            placeholder="Rechercher un arôme..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--beige-dark)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--bordeaux)] focus:border-transparent transition-all"
          />
        </div>

        {/* Search results */}
        {searchQuery.length >= 2 && (
          <div className="mt-4">
            {searchResults.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-[var(--gris-tech)]">
                  {searchResults.length} résultat
                  {searchResults.length > 1 ? "s" : ""}
                </p>
                {searchResults.slice(0, 10).map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center gap-3 p-3 bg-[var(--beige)] rounded-xl"
                  >
                    <span
                      className="w-4 h-4 rounded-full shrink-0"
                      style={{ backgroundColor: result.category.color || "#6B1F3D" }}
                    />
                    <div>
                      <p className="font-medium text-[var(--gris-dark)]">
                        {result.name}
                      </p>
                      <p className="text-xs text-[var(--gris-light)]">
                        {result.category.name} → {result.subcategory.name}
                      </p>
                    </div>
                  </div>
                ))}
                {searchResults.length > 10 && (
                  <p className="text-sm text-[var(--gris-light)] text-center">
                    +{searchResults.length - 10} autres résultats
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-[var(--gris-light)]">
                Aucun arôme trouvé pour &quot;{searchQuery}&quot;
              </p>
            )}
          </div>
        )}
      </div>

      {/* Categories Grid */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            className={`card text-left transition-all ${
              selectedCategory?.id === category.id
                ? "ring-2 ring-[var(--bordeaux)] shadow-lg"
                : "hover:shadow-md"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${category.color || "#6B1F3D"}20` }}
              >
                🍇
              </div>
              <div>
                <h3 className="font-semibold text-[var(--gris-dark)]">
                  {category.name}
                </h3>
                <p className="text-xs text-[var(--gris-light)]">
                  {category.subCategories.length} sous-catégories
                </p>
              </div>
            </div>
            {category.description && (
              <p className="text-sm text-[var(--gris-tech)] line-clamp-2">
                {category.description}
              </p>
            )}
            <div
              className="mt-3 h-1 rounded-full"
              style={{ backgroundColor: category.color || "#6B1F3D" }}
            />
          </button>
        ))}
      </div>

      {/* Selected Category Details */}
      {selectedCategory && (
        <div className="card mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{ backgroundColor: `${selectedCategory.color || "#6B1F3D"}20` }}
            >
              🍇
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--gris-dark)]">
                {selectedCategory.name}
              </h2>
              {selectedCategory.description && (
                <p className="text-[var(--gris-tech)]">
                  {selectedCategory.description}
                </p>
              )}
            </div>
          </div>

          {/* Subcategories */}
          <div className="space-y-3">
            {selectedCategory.subCategories.map((subcategory) => (
              <div key={subcategory.id}>
                <button
                  onClick={() => handleSubcategoryClick(subcategory)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    selectedSubcategory?.id === subcategory.id
                      ? "bg-[var(--bordeaux)] text-white"
                      : "bg-[var(--beige)] hover:bg-[var(--beige-dark)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            selectedSubcategory?.id === subcategory.id
                              ? "white"
                              : selectedCategory.color || "#6B1F3D",
                        }}
                      />
                      <span className="font-medium">{subcategory.name}</span>
                    </div>
                    <span
                      className={`text-sm ${
                        selectedSubcategory?.id === subcategory.id
                          ? "text-white/70"
                          : "text-[var(--gris-light)]"
                      }`}
                    >
                      {subcategory.aromas.length} arômes
                    </span>
                  </div>
                </button>

                {/* Aromas */}
                {selectedSubcategory?.id === subcategory.id && (
                  <div className="mt-3 ml-6 pl-4 border-l-2 border-[var(--beige-dark)]">
                    <div className="flex flex-wrap gap-2">
                      {subcategory.aromas.map((aroma) => (
                        <button
                          key={aroma.id}
                          onClick={() => toggleAroma(aroma.id)}
                          className={`px-3 py-1.5 rounded-lg text-sm shadow-sm hover:shadow transition-all ${
                            selectedAromas.has(aroma.id)
                              ? "bg-[var(--bordeaux)] text-white"
                              : "bg-white text-[var(--gris-dark)]"
                          }`}
                          title={aroma.description || undefined}
                        >
                          {aroma.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedAromas.size > 0 && (
        <div className="card mt-6 bg-[var(--bordeaux)] bg-opacity-5 border border-[var(--bordeaux)] border-opacity-20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-[var(--bordeaux)]">
              Arômes sélectionnés ({selectedAromas.size})
            </h3>
            <button
              onClick={() => setSelectedAromas(new Set())}
              className="text-sm text-[var(--gris-tech)] hover:text-[var(--bordeaux)] transition-colors"
            >
              Tout effacer
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.flatMap(c => c.subCategories.flatMap(s => s.aromas))
              .filter(a => selectedAromas.has(a.id))
              .map(aroma => (
                <span
                  key={aroma.id}
                  className="px-3 py-1.5 bg-[var(--bordeaux)] text-white rounded-lg text-sm flex items-center gap-1"
                >
                  {aroma.name}
                  <button onClick={() => toggleAroma(aroma.id)} className="hover:text-white/70">×</button>
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      {!selectedCategory && (
        <div className="card text-center py-8">
          <div className="text-4xl mb-4">👆</div>
          <p className="text-[var(--gris-tech)]">
            Cliquez sur une catégorie pour explorer ses arômes
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="card mt-8">
        <h3 className="font-semibold mb-4">Familles d&apos;arômes</h3>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color || "#6B1F3D" }}
              />
              <span className="text-sm text-[var(--gris-tech)]">
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
