"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateSetting, resetSetting } from "@/actions/admin";

interface Setting {
  id: string;
  key: string;
  value: unknown;
  category: string;
  label: string | null;
  description: string | null;
  isPublic: boolean;
}

interface Category {
  id: string;
  label: string;
}

interface SettingsFormProps {
  settings: Setting[];
  categories: Category[];
  currentCategory: string;
}

export default function SettingsForm({
  settings,
  categories,
  currentCategory,
}: SettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const startEditing = (setting: Setting) => {
    setEditingKey(setting.key);
    setEditValue(JSON.stringify(setting.value));
    setMessage(null);
  };

  const cancelEditing = () => {
    setEditingKey(null);
    setEditValue("");
  };

  const handleSave = async (key: string) => {
    try {
      let parsedValue: unknown;
      try {
        parsedValue = JSON.parse(editValue);
      } catch {
        parsedValue = editValue;
      }

      startTransition(async () => {
        await updateSetting(key, parsedValue);
        setEditingKey(null);
        setMessage({ type: "success", text: "Paramètre mis à jour" });
        router.refresh();
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Erreur lors de la mise à jour",
      });
    }
  };

  const handleReset = async (key: string) => {
    if (!confirm("Réinitialiser ce paramètre à sa valeur par défaut ?")) return;

    startTransition(async () => {
      await resetSetting(key);
      setMessage({ type: "success", text: "Paramètre réinitialisé" });
      router.refresh();
    });
  };

  const handleToggle = async (key: string, currentValue: boolean) => {
    startTransition(async () => {
      await updateSetting(key, !currentValue);
      router.refresh();
    });
  };

  const renderValue = (setting: Setting) => {
    const value = setting.value;

    if (editingKey === setting.key) {
      return (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="flex-1 px-3 py-1.5 rounded-lg border border-beige-dark text-sm focus:ring-2 focus:ring-bordeaux focus:border-transparent"
            autoFocus
          />
          <button
            onClick={() => handleSave(setting.key)}
            disabled={isPending}
            className="px-3 py-1.5 bg-bordeaux text-white text-sm rounded-lg hover:bg-bordeaux-light disabled:opacity-50"
          >
            Enregistrer
          </button>
          <button
            onClick={cancelEditing}
            className="px-3 py-1.5 bg-gris-light/20 text-gris-dark text-sm rounded-lg hover:bg-gris-light/30"
          >
            Annuler
          </button>
        </div>
      );
    }

    if (typeof value === "boolean") {
      return (
        <button
          onClick={() => handleToggle(setting.key, value)}
          disabled={isPending}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            value ? "bg-success" : "bg-gris-light"
          } ${isPending ? "opacity-50" : ""}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              value ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      );
    }

    if (typeof value === "number") {
      return (
        <span className="font-mono text-sm text-gris-dark">{value}</span>
      );
    }

    if (typeof value === "string") {
      return (
        <span className="text-sm text-gris-dark truncate max-w-md" title={value}>
          {value.length > 50 ? `${value.slice(0, 50)}...` : value}
        </span>
      );
    }

    return (
      <span className="font-mono text-xs text-gris-tech">
        {JSON.stringify(value).slice(0, 50)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-success/10 text-success border border-success/30"
              : "bg-danger/10 text-danger border border-danger/30"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Onglets catégories */}
      <div className="flex flex-wrap gap-2 border-b border-beige-dark pb-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/admin/parametres?category=${cat.id}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentCategory === cat.id
                ? "bg-bordeaux text-white"
                : "bg-beige text-gris-dark hover:bg-beige-dark"
            }`}
          >
            {cat.label}
          </Link>
        ))}
      </div>

      {/* Liste des paramètres */}
      <div className="bg-white rounded-xl shadow-sm border border-beige-dark overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-beige-dark bg-beige/50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gris-tech">
                Paramètre
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gris-tech">
                Valeur
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gris-tech">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-beige-dark">
            {settings.map((setting) => (
              <tr key={setting.key} className="hover:bg-beige/30">
                <td className="px-4 py-4">
                  <div>
                    <p className="font-medium text-gris-dark">
                      {setting.label || setting.key}
                    </p>
                    {setting.description && (
                      <p className="text-xs text-gris-tech mt-0.5">
                        {setting.description}
                      </p>
                    )}
                    <p className="text-xs text-gris-light font-mono mt-1">
                      {setting.key}
                      {setting.isPublic && (
                        <span className="ml-2 px-1.5 py-0.5 bg-info/10 text-info rounded text-[10px]">
                          public
                        </span>
                      )}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4">{renderValue(setting)}</td>
                <td className="px-4 py-4 text-right">
                  {editingKey !== setting.key && (
                    <div className="flex items-center justify-end gap-2">
                      {typeof setting.value !== "boolean" && (
                        <button
                          onClick={() => startEditing(setting)}
                          className="p-1.5 text-gris-tech hover:text-bordeaux hover:bg-beige rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                      )}
                      {setting.id && (
                        <button
                          onClick={() => handleReset(setting.key)}
                          className="p-1.5 text-gris-tech hover:text-warning hover:bg-warning/10 rounded-lg transition-colors"
                          title="Réinitialiser"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {settings.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-12 text-center text-sm text-gris-tech">
                  Aucun paramètre dans cette catégorie
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Note */}
      <div className="bg-info/10 border border-info/30 rounded-lg p-4">
        <p className="text-sm text-info">
          <strong>Note :</strong> Les paramètres marqués &quot;public&quot; sont accessibles côté client.
          Les modifications de certains paramètres peuvent nécessiter un redémarrage de l&apos;application.
        </p>
      </div>
    </div>
  );
}
