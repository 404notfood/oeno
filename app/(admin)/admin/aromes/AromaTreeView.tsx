"use client";

import { useState } from "react";
import { Modal, ModalButton, InputField, TextareaField } from "@/components/admin/ui";
import {
  createAromaCategory,
  updateAromaCategory,
  createAromaSubCategory,
  updateAromaSubCategory,
  createAroma,
  updateAroma,
} from "@/actions/admin";

interface Aroma {
  id: string;
  name: string;
  description: string | null;
  order: number;
}

interface SubCategory {
  id: string;
  name: string;
  order: number;
  aromas: Aroma[];
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  order: number;
  subCategories: SubCategory[];
}

interface AromaTreeViewProps {
  categories: Category[];
}

export default function AromaTreeView({ categories }: AromaTreeViewProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedSubCategories, setExpandedSubCategories] = useState<Set<string>>(new Set());
  const [modalType, setModalType] = useState<"category" | "subCategory" | "aroma" | null>(null);
  const [editItem, setEditItem] = useState<{ type: string; item: Category | SubCategory | Aroma; parentId?: string } | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleCategory = (id: string) => {
    const newSet = new Set(expandedCategories);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedCategories(newSet);
  };

  const toggleSubCategory = (id: string) => {
    const newSet = new Set(expandedSubCategories);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedSubCategories(newSet);
  };

  const handleAddCategory = () => {
    setEditItem(null);
    setModalType("category");
  };

  const handleAddSubCategory = (categoryId: string) => {
    setEditItem(null);
    setParentId(categoryId);
    setModalType("subCategory");
  };

  const handleAddAroma = (subCategoryId: string) => {
    setEditItem(null);
    setParentId(subCategoryId);
    setModalType("aroma");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    try {
      if (modalType === "category") {
        if (editItem) {
          await updateAromaCategory(editItem.item.id, { name, description });
        } else {
          await createAromaCategory({ name, description, order: 0 });
        }
      } else if (modalType === "subCategory" && parentId) {
        if (editItem) {
          await updateAromaSubCategory(editItem.item.id, { name });
        } else {
          await createAromaSubCategory({ name, categoryId: parentId, order: 0 });
        }
      } else if (modalType === "aroma" && parentId) {
        if (editItem) {
          await updateAroma(editItem.item.id, { name, description });
        } else {
          await createAroma({ name, description, subCategoryId: parentId, order: 0, associatedWines: [] });
        }
      }
      setModalType(null);
      setEditItem(null);
      setParentId(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={handleAddCategory} className="btn btn-primary">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouvelle categorie
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-beige-dark">
        {categories.length === 0 ? (
          <div className="p-8 text-center text-gris-tech">
            Aucune categorie d&apos;arome. Commencez par en creer une.
          </div>
        ) : (
          <div className="divide-y divide-beige-dark">
            {categories.map((category) => (
              <div key={category.id}>
                {/* Category */}
                <div
                  className="flex items-center justify-between p-4 hover:bg-beige/50 cursor-pointer"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className={`w-4 h-4 transition-transform ${expandedCategories.has(category.id) ? "rotate-90" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color || "#6B1F3D" }}
                    />
                    <span className="font-semibold text-gris-dark">{category.name}</span>
                    <span className="text-xs text-gris-tech">
                      ({category.subCategories.length} sous-categories)
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddSubCategory(category.id);
                    }}
                    className="p-1.5 text-gris-tech hover:text-bordeaux hover:bg-beige rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                {/* Sub-categories */}
                {expandedCategories.has(category.id) && (
                  <div className="pl-8 border-l-2 border-beige-dark ml-4">
                    {category.subCategories.map((sub) => (
                      <div key={sub.id}>
                        <div
                          className="flex items-center justify-between p-3 hover:bg-beige/30 cursor-pointer"
                          onClick={() => toggleSubCategory(sub.id)}
                        >
                          <div className="flex items-center gap-3">
                            <svg
                              className={`w-3 h-3 transition-transform ${expandedSubCategories.has(sub.id) ? "rotate-90" : ""}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="text-sm text-gris-dark">{sub.name}</span>
                            <span className="text-xs text-gris-light">
                              ({sub.aromas.length} aromes)
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddAroma(sub.id);
                            }}
                            className="p-1 text-gris-light hover:text-bordeaux hover:bg-beige rounded transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>

                        {/* Aromas */}
                        {expandedSubCategories.has(sub.id) && (
                          <div className="pl-6 border-l border-beige-dark ml-3 mb-2">
                            {sub.aromas.map((aroma) => (
                              <div
                                key={aroma.id}
                                className="flex items-center justify-between py-2 px-3 text-sm text-gris-tech hover:text-gris-dark"
                              >
                                <span>{aroma.name}</span>
                              </div>
                            ))}
                            {sub.aromas.length === 0 && (
                              <div className="py-2 px-3 text-xs text-gris-light italic">
                                Aucun arome
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    {category.subCategories.length === 0 && (
                      <div className="p-3 text-xs text-gris-light italic">
                        Aucune sous-categorie
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={!!modalType}
        onClose={() => {
          setModalType(null);
          setEditItem(null);
          setParentId(null);
        }}
        title={
          modalType === "category"
            ? "Categorie d'arome"
            : modalType === "subCategory"
              ? "Sous-categorie"
              : "Arome"
        }
        footer={
          <>
            <ModalButton onClick={() => setModalType(null)}>Annuler</ModalButton>
            <ModalButton type="submit" variant="primary" loading={isSubmitting}>
              {editItem ? "Enregistrer" : "Creer"}
            </ModalButton>
          </>
        }
      >
        <form onSubmit={handleSubmit} id="aroma-form">
          <div className="space-y-4">
            <InputField
              label="Nom"
              name="name"
              defaultValue={editItem?.item.name}
              required
            />
            {(modalType === "category" || modalType === "aroma") && (
              <TextareaField
                label="Description"
                name="description"
                defaultValue={(editItem?.item as Category | Aroma)?.description || ""}
              />
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
}
