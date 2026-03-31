"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/admin/ui";
import { importUsersFromCsv } from "@/actions/admin";
import { parseCsv } from "@/lib/csv";

interface ImportUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportUsersModal({ isOpen, onClose }: ImportUsersModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvContent, setCsvContent] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    created: number;
    skipped: number;
    errors: string[];
    passwords: { email: string; password: string }[];
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
        requiredColumns: ["email", "firstname", "lastname"],
        columnMapping: {
          email: "email",
          firstname: "prénom",
          lastname: "nom",
          role: "rôle",
          establishmentuai: "uai",
          password: "mot de passe",
        },
      });

      if (parsed.errors.length > 0 && parsed.data.length === 0) {
        setError(parsed.errors.map((e) => `Ligne ${e.row}: ${e.message}`).join("\n"));
        return;
      }

      // Transformer pour l'import
      const users = parsed.data.map((row) => ({
        email: row.email || "",
        firstName: row.firstname || "",
        lastName: row.lastname || "",
        role: row.role,
        establishmentUai: row.establishmentuai,
        password: row.password,
      }));

      // Appeler l'action server
      const importResult = await importUsersFromCsv(users);
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

  const downloadPasswordsCsv = () => {
    if (!result?.passwords.length) return;

    const csv =
      "\uFEFF" +
      "Email,Mot de passe\r\n" +
      result.passwords.map((p) => `${p.email},${p.password}`).join("\r\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mots_de_passe_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Importer des utilisateurs (CSV)">
      <div className="space-y-4">
        <p className="text-sm text-gris-tech">
          Importez plusieurs utilisateurs en masse depuis un fichier CSV.
        </p>

        {/* Format attendu */}
        <div className="bg-beige rounded-lg p-4">
          <p className="text-xs font-medium text-gris-dark mb-2">Format CSV attendu:</p>
          <pre className="text-xs text-gris-tech overflow-x-auto">
{`email;firstname;lastname;role;establishmentUai;password
jean.dupont@ecole.fr;Jean;Dupont;STUDENT;0123456A;
marie.martin@ecole.fr;Marie;Martin;TEACHER;0123456A;MonMotDePasse123`}
          </pre>
          <ul className="text-xs text-gris-tech mt-3 space-y-1">
            <li>• <strong>email</strong>, <strong>firstname</strong>, <strong>lastname</strong> : obligatoires</li>
            <li>• <strong>role</strong> : STUDENT (défaut), TEACHER, ou ADMIN</li>
            <li>• <strong>establishmentUai</strong> : Code UAI de l&apos;établissement</li>
            <li>• <strong>password</strong> : Mot de passe (généré si vide)</li>
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
                {result.created} utilisateur(s) créé(s), {result.skipped} ignoré(s) (déjà existants)
              </p>
            </div>

            {result.passwords.length > 0 && (
              <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-warning">
                    {result.passwords.length} mot(s) de passe généré(s)
                  </p>
                  <button
                    onClick={downloadPasswordsCsv}
                    className="text-xs bg-warning text-white px-3 py-1 rounded-lg hover:bg-warning/80"
                  >
                    Télécharger CSV
                  </button>
                </div>
                <p className="text-xs text-warning/80">
                  Conservez ces mots de passe, ils ne seront plus affichés.
                </p>
              </div>
            )}

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
