/**
 * Utilitaires pour la génération et le parsing de fichiers CSV
 */

type CsvValue = string | number | boolean | null | undefined | Date;

// ============================================
// PARSING CSV (Import)
// ============================================

export interface ParsedCsvResult<T> {
  data: T[];
  errors: { row: number; message: string }[];
  totalRows: number;
}

/**
 * Parse un fichier CSV en tableau d'objets
 */
export function parseCsv<T extends Record<string, unknown>>(
  csvContent: string,
  options: {
    requiredColumns?: string[];
    columnMapping?: Record<string, string>;
    transform?: (row: Record<string, string>, rowIndex: number) => T | null;
  } = {}
): ParsedCsvResult<T> {
  const { requiredColumns = [], columnMapping = {}, transform } = options;
  const lines = csvContent
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .filter((line) => line.trim() !== "");

  if (lines.length === 0) {
    return { data: [], errors: [{ row: 0, message: "Fichier vide" }], totalRows: 0 };
  }

  // Parser l'en-tête (première ligne)
  const headerLine = lines[0].startsWith("\uFEFF") ? lines[0].slice(1) : lines[0];
  const headers = parseCsvLine(headerLine).map((h) => h.trim().toLowerCase());

  // Vérifier les colonnes requises
  const missingColumns = requiredColumns.filter(
    (col) => !headers.includes(col.toLowerCase()) &&
             !headers.includes((columnMapping[col] || "").toLowerCase())
  );

  if (missingColumns.length > 0) {
    return {
      data: [],
      errors: [{ row: 0, message: `Colonnes manquantes: ${missingColumns.join(", ")}` }],
      totalRows: 0,
    };
  }

  const data: T[] = [];
  const errors: { row: number; message: string }[] = [];

  // Parser les lignes de données
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    try {
      const values = parseCsvLine(line);
      const row: Record<string, string> = {};

      headers.forEach((header, index) => {
        const mappedKey = Object.entries(columnMapping).find(
          ([, v]) => v.toLowerCase() === header
        )?.[0] || header;
        row[mappedKey] = values[index]?.trim() || "";
      });

      if (transform) {
        const transformed = transform(row, i);
        if (transformed) {
          data.push(transformed);
        }
      } else {
        data.push(row as unknown as T);
      }
    } catch (err) {
      errors.push({
        row: i + 1,
        message: err instanceof Error ? err.message : "Erreur de parsing",
      });
    }
  }

  return { data, errors, totalRows: lines.length - 1 };
}

/**
 * Parse une ligne CSV en tenant compte des guillemets
 */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === "," || char === ";") {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }
  }

  result.push(current);
  return result;
}

// ============================================
// GÉNÉRATION CSV (Export)
// ============================================

interface CsvColumn<T> {
  header: string;
  accessor: keyof T | ((item: T) => CsvValue);
}

/**
 * Échappe une valeur pour le format CSV
 */
function escapeCsvValue(value: CsvValue): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  const stringValue = String(value);

  // Si la valeur contient des caractères spéciaux, on l'entoure de guillemets
  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n") ||
    stringValue.includes("\r")
  ) {
    // On double les guillemets existants
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

/**
 * Génère un fichier CSV à partir d'un tableau de données
 */
export function generateCsv<T extends Record<string, unknown>>(
  data: T[],
  columns: CsvColumn<T>[]
): string {
  // Ligne d'en-tête
  const headerLine = columns.map((col) => escapeCsvValue(col.header)).join(",");

  // Lignes de données
  const dataLines = data.map((item) => {
    return columns
      .map((col) => {
        const value =
          typeof col.accessor === "function"
            ? col.accessor(item)
            : item[col.accessor];
        return escapeCsvValue(value as CsvValue);
      })
      .join(",");
  });

  // On ajoute le BOM UTF-8 pour que Excel reconnaisse l'encodage
  return "\uFEFF" + [headerLine, ...dataLines].join("\r\n");
}

/**
 * Crée une réponse HTTP avec un fichier CSV
 */
export function createCsvResponse(csv: string, filename: string): Response {
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

// Colonnes prédéfinies pour les exports courants

export const userCsvColumns = [
  { header: "ID", accessor: "id" as const },
  { header: "Email", accessor: "email" as const },
  { header: "Prénom", accessor: "firstName" as const },
  { header: "Nom", accessor: "lastName" as const },
  { header: "Rôle", accessor: "role" as const },
  {
    header: "Établissement",
    accessor: (u: Record<string, unknown>) =>
      (u.establishment as { name?: string } | null)?.name || "",
  },
  { header: "Créé le", accessor: "createdAt" as const },
  { header: "Mis à jour le", accessor: "updatedAt" as const },
];

export const establishmentCsvColumns = [
  { header: "ID", accessor: "id" as const },
  { header: "Code UAI", accessor: "uai" as const },
  { header: "Nom", accessor: "name" as const },
  { header: "Adresse", accessor: "address" as const },
  { header: "Code postal", accessor: "zipCode" as const },
  { header: "Ville", accessor: "city" as const },
  { header: "Région", accessor: "region" as const },
  { header: "Actif", accessor: "isActive" as const },
  { header: "Créé le", accessor: "createdAt" as const },
];

export const classCsvColumns = [
  { header: "ID", accessor: "id" as const },
  { header: "Nom", accessor: "name" as const },
  { header: "Niveau", accessor: "level" as const },
  { header: "Année", accessor: "year" as const },
  {
    header: "Établissement",
    accessor: (c: Record<string, unknown>) =>
      (c.establishment as { name?: string } | null)?.name || "",
  },
  {
    header: "Nb élèves",
    accessor: (c: Record<string, unknown>) =>
      (c._count as { students?: number } | null)?.students || 0,
  },
  {
    header: "Nb enseignants",
    accessor: (c: Record<string, unknown>) =>
      (c._count as { teachers?: number } | null)?.teachers || 0,
  },
  { header: "Actif", accessor: "isActive" as const },
  { header: "Créé le", accessor: "createdAt" as const },
];

export const wineCsvColumns = [
  { header: "ID", accessor: "id" as const },
  { header: "Nom", accessor: "name" as const },
  { header: "Producteur", accessor: "producer" as const },
  {
    header: "Appellation",
    accessor: (w: Record<string, unknown>) =>
      (w.appellation as { name?: string } | null)?.name || "",
  },
  { header: "Région", accessor: "region" as const },
  { header: "Couleur", accessor: "color" as const },
  { header: "Type", accessor: "type" as const },
  { header: "Millésime", accessor: "vintage" as const },
  { header: "Alcool (%)", accessor: "alcoholLevel" as const },
  { header: "Pays", accessor: "country" as const },
  { header: "Créé le", accessor: "createdAt" as const },
];

export const grapeCsvColumns = [
  { header: "ID", accessor: "id" as const },
  { header: "Nom", accessor: "name" as const },
  { header: "Couleur", accessor: "color" as const },
  { header: "Origine", accessor: "origin" as const },
  { header: "Caractéristiques", accessor: "characteristics" as const },
  { header: "Créé le", accessor: "createdAt" as const },
];

export const appellationCsvColumns = [
  { header: "ID", accessor: "id" as const },
  { header: "Nom", accessor: "name" as const },
  { header: "Région", accessor: "region" as const },
  { header: "Type", accessor: "type" as const },
  { header: "Description", accessor: "description" as const },
  { header: "Créé le", accessor: "createdAt" as const },
];

export const glossaryCsvColumns = [
  { header: "ID", accessor: "id" as const },
  { header: "Terme", accessor: "term" as const },
  { header: "Définition", accessor: "definition" as const },
  { header: "Catégorie", accessor: "category" as const },
  { header: "Créé le", accessor: "createdAt" as const },
];

export const auditLogCsvColumns = [
  { header: "ID", accessor: "id" as const },
  { header: "Action", accessor: "action" as const },
  { header: "Type entité", accessor: "entityType" as const },
  { header: "ID entité", accessor: "entityId" as const },
  { header: "Utilisateur ID", accessor: "userId" as const },
  {
    header: "Utilisateur",
    accessor: (log: Record<string, unknown>) =>
      (log.user as { email?: string } | null)?.email || "",
  },
  { header: "Date", accessor: "createdAt" as const },
];
