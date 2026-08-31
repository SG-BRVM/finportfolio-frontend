import type { DocumentCategory } from "../enums/DocumentCategory";

/** Document - un fichier (relevé, document fiscal, réglementaire, ...)
 * envoyé pour un Portfolio et stocké côté serveur. */
export interface Document {
  readonly id: string;
  readonly portfolioId: string;
  readonly name: string;
  readonly category: DocumentCategory;
  readonly contentType: string;
  readonly sizeBytes: number;
  readonly createdAt: Date;
}
