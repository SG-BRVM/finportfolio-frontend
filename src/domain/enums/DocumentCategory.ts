/**
 * Catégorie d'un document, attribuée à l'envoi.
 * Miroir exact de l'enum backend `DocumentCategory`.
 */
export type DocumentCategory = "STATEMENT" | "TAX" | "REGULATORY";

export const DOCUMENT_CATEGORIES: DocumentCategory[] = ["STATEMENT", "TAX", "REGULATORY"];

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  STATEMENT: "Relevé",
  TAX: "Fiscal",
  REGULATORY: "Réglementaire",
};
