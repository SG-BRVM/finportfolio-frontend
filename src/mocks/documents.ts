// TEMPORARY MOCK DATA
// Il n'existe aucune notion de document côté API (pas de génération de
// relevés, de documents fiscaux ou réglementaires dans le Domain backend
// actuel - voir app/domain côté finportfolio). Remplacer par le use case
// + le port applicatifs adéquats (ex. GetInvestorDocumentsUseCase)
// lorsque l'API exposera cette donnée. Isolé ici (src/mocks/) : seule la
// page "Documents" le consomme. Les documents n'étant adossés à aucun
// fichier réel, les actions Voir/Télécharger/Partager restent
// volontairement inertes dans l'UI plutôt que de simuler un
// téléchargement trompeur.

export type DocumentCategory = "statement" | "tax" | "regulatory";

export interface FinancialDocument {
  id: string;
  name: string;
  category: DocumentCategory;
  date: Date;
  sizeKb: number;
}

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  statement: "Relevés",
  tax: "Documents fiscaux",
  regulatory: "Documents réglementaires",
};

export const DOCUMENTS: FinancialDocument[] = [
  {
    id: "doc-1",
    name: "Relevé de portefeuille - Juillet 2026",
    category: "statement",
    date: new Date("2026-08-01"),
    sizeKb: 412,
  },
  {
    id: "doc-2",
    name: "Relevé de portefeuille - Juin 2026",
    category: "statement",
    date: new Date("2026-07-01"),
    sizeKb: 398,
  },
  {
    id: "doc-3",
    name: "Relevé de portefeuille - Mai 2026",
    category: "statement",
    date: new Date("2026-06-01"),
    sizeKb: 405,
  },
  {
    id: "doc-4",
    name: "Attestation fiscale 2025",
    category: "tax",
    date: new Date("2026-02-15"),
    sizeKb: 156,
  },
  {
    id: "doc-5",
    name: "Récapitulatif des plus-values 2025",
    category: "tax",
    date: new Date("2026-02-15"),
    sizeKb: 203,
  },
  {
    id: "doc-6",
    name: "Convention de compte-titres",
    category: "regulatory",
    date: new Date("2025-11-03"),
    sizeKb: 588,
  },
  {
    id: "doc-7",
    name: "Document d'information clé (DIC)",
    category: "regulatory",
    date: new Date("2025-11-03"),
    sizeKb: 312,
  },
];
