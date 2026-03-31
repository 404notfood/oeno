"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/admin/ui";
import { importWinesFromJson } from "@/actions/admin";

interface ImportWinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportWinesModal({ isOpen, onClose }: ImportWinesModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [jsonContent, setJsonContent] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    created: number;
    updated: number;
    errors: string[];
  } | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      setJsonContent(text);
      setError(null);
      // Valider que c'est du JSON
      JSON.parse(text);
    } catch {
      setError("Le fichier n'est pas un JSON valide");
    }
  };

  const handleImport = async () => {
    if (!jsonContent) {
      setError("Veuillez selectionner un fichier ou coller du JSON");
      return;
    }

    setIsImporting(true);
    setError(null);
    setResult(null);

    try {
      const data = JSON.parse(jsonContent);
      const importResult = await importWinesFromJson(data);
      setResult(importResult);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'import");
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    setJsonContent("");
    setError(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Importer des vins (JSON)">
      <div className="space-y-4">
        <p className="text-sm text-gris-tech">
          Importez des vins avec leurs profils sensoriels depuis un fichier JSON.
          Le format attendu est celui de <code>documents/vin.json</code>.
        </p>

        {/* Format attendu */}
        <div className="bg-beige rounded-lg p-4">
          <p className="text-xs font-medium text-gris-dark mb-2">Format attendu:</p>
          <pre className="text-xs text-gris-tech overflow-x-auto">
{`[
  {
    "id": "identifiant_unique",
    "cepage": ["Nom du cepage"],
    "region": "Region",
    "climat": "frais|tempere|chaud",
    "type": "rouge|blanc_sec|blanc_moelleux",
    "acidite": "faible|moyenne|elevee",
    "alcool_percu": "faible|modere|eleve",
    "matiere": "legere|moyenne|ample|puissante",
    "structure": "tendue|ample",
    "tanins": "fins|souples|serres|marques",
    "aromes_dominants": ["arome1", "arome2"],
    "finale": "courte|moyenne|moyenne_a_longue|longue",
    "variabilite": "faible|moyenne|elevee"
  }
]`}
          </pre>
        </div>

        {/* Upload fichier */}
        <div>
          <label className="block text-sm font-medium text-gris-dark mb-2">
            Fichier JSON
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="w-full text-sm text-gris-tech file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-bordeaux file:text-white hover:file:bg-bordeaux-light"
          />
        </div>

        {/* Ou coller du JSON */}
        <div>
          <label className="block text-sm font-medium text-gris-dark mb-2">
            Ou collez le JSON directement
          </label>
          <textarea
            value={jsonContent}
            onChange={(e) => {
              setJsonContent(e.target.value);
              setError(null);
            }}
            className="w-full px-4 py-3 rounded-lg border border-beige-dark focus:ring-2 focus:ring-bordeaux focus:border-transparent font-mono text-xs"
            rows={8}
            placeholder='[{"cepage": ["Merlot"], ...}]'
          />
        </div>

        {/* Erreur */}
        {error && (
          <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg p-4 text-sm">
            {error}
          </div>
        )}

        {/* Resultat */}
        {result && (
          <div className="space-y-2">
            <div className="bg-success/10 border border-success/30 text-success rounded-lg p-4">
              <p className="font-medium">Import termine !</p>
              <p className="text-sm">
                {result.created} vin(s) cree(s), {result.updated} vin(s) mis a jour
              </p>
            </div>
            {result.errors.length > 0 && (
              <div className="bg-warning/10 border border-warning/30 text-warning rounded-lg p-4">
                <p className="font-medium mb-1">Erreurs ({result.errors.length}):</p>
                <ul className="text-xs space-y-1">
                  {result.errors.map((err, i) => (
                    <li key={i}>• {err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-beige-dark">
          <button
            type="button"
            onClick={handleClose}
            className="btn btn-secondary"
          >
            {result ? "Fermer" : "Annuler"}
          </button>
          {!result && (
            <button
              type="button"
              onClick={handleImport}
              disabled={isImporting || !jsonContent}
              className="btn btn-primary"
            >
              {isImporting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Import en cours...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Importer
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
