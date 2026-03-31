"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/admin/ui";
import { importClassesFromCsv } from "@/actions/admin";
import { parseCsv } from "@/lib/csv";

interface ImportClassesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportClassesModal({ isOpen, onClose }: ImportClassesModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvContent, setCsvContent] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    created: number;
    skipped: number;
    errors: string[];
  } | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      setCsvContent(text);
      setError(null);
    } catch {
      setError("Erreur lors de la lecture du fichier");
    }
  };

  const handleImport = async () => {
    if (!csvContent) {
      setError("Veuillez sélectionner un fichier CSV");
      return;
    }

    setIsImporting(true);
    setError(null);
    setResult(null);

    try {
      // Parser le CSV
      const parsed = parseCsv<Record<string, string>>(csvContent, {
        requiredColumns: ["name", "year", "establishmentuai"],
        columnMapping: {
          name: "nom",
          year: "année",
          level: "niveau",
          establishmentuai: "uai",
        },
      });

      if (parsed.errors.length > 0 && parsed.data.length === 0) {
        setError(parsed.errors.map((e) => `Ligne ${e.row}: ${e.message}`).join("\n"));
        return;
      }

      // Transformer pour l'import
      const classes = parsed.data.map((row) => ({
        name: row.name || "",
        year: row.year || "",
        level: row.level,
        establishmentUai: row.establishmentuai || "",
      }));

      // Appeler l'action server
      const importResult = await importClassesFromCsv(classes);
      setResult(importResult);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'import");
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    setCsvContent("");
    setError(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Importer des classes (CSV)">
      <div className="space-y-4">
        <p className="text-sm text-gris-tech">
          Importez plusieurs classes en masse depuis un fichier CSV.
        </p>

        {/* Format attendu */}
        <div className="bg-beige rounded-lg p-4">
          <p className="text-xs font-medium text-gris-dark mb-2">Format CSV attendu:</p>
          <pre className="text-xs text-gris-tech overflow-x-auto">
{`name;year;level;establishmentUai
Terminale CGEA;2024-2025;Bac Pro;0123456A
1ère Viticulture;2024-2025;Bac Pro;0123456A
BTSA VO;2024-2025;BTSA;0123456A`}
          </pre>
          <ul className="text-xs text-gris-tech mt-3 space-y-1">
            <li>• <strong>name</strong> : Nom de la classe (obligatoire)</li>
            <li>• <strong>year</strong> : Année scolaire, ex: 2024-2025 (obligatoire)</li>
            <li>• <strong>level</strong> : Niveau (CAPa, Bac Pro, BTSA...)</li>
            <li>• <strong>establishmentUai</strong> : Code UAI de l&apos;établissement (obligatoire)</li>
          </ul>
        </div>

        {/* Upload fichier */}
        <div>
          <label className="block text-sm font-medium text-gris-dark mb-2">
            Fichier CSV
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.txt"
            onChange={handleFileChange}
            className="w-full text-sm text-gris-tech file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-bordeaux file:text-white hover:file:bg-bordeaux-light cursor-pointer"
          />
        </div>

        {/* Aperçu */}
        {csvContent && !result && (
          <div>
            <label className="block text-sm font-medium text-gris-dark mb-2">
              Aperçu du fichier
            </label>
            <pre className="w-full px-4 py-3 rounded-lg border border-beige-dark bg-beige/50 font-mono text-xs max-h-32 overflow-auto">
              {csvContent.slice(0, 500)}
              {csvContent.length > 500 && "..."}
            </pre>
            <p className="text-xs text-gris-tech mt-1">
              {csvContent.split("\n").filter((l) => l.trim()).length - 1} ligne(s) de données
            </p>
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg p-4 text-sm whitespace-pre-wrap">
            {error}
          </div>
        )}

        {/* Résultat */}
        {result && (
          <div className="space-y-3">
            <div className="bg-success/10 border border-success/30 text-success rounded-lg p-4">
              <p className="font-medium">Import terminé !</p>
              <p className="text-sm">
                {result.created} classe(s) créée(s), {result.skipped} ignorée(s) (déjà existantes)
              </p>
            </div>

            {result.errors.length > 0 && (
              <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg p-4">
                <p className="font-medium mb-1">Erreurs ({result.errors.length}):</p>
                <ul className="text-xs space-y-1 max-h-32 overflow-auto">
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
          <button type="button" onClick={handleClose} className="btn btn-secondary">
            {result ? "Fermer" : "Annuler"}
          </button>
          {!result && (
            <button
              type="button"
              onClick={handleImport}
              disabled={isImporting || !csvContent}
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
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
