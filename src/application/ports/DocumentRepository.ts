import type { Document } from "../../domain/entities/Document";
import type { DocumentCategory } from "../../domain/enums/DocumentCategory";
import type { UploadDocumentDTO } from "../dto/UploadDocumentDTO";

export interface DocumentRepository {
  upload(data: UploadDocumentDTO): Promise<Document>;
  /** Liste globale (tous portefeuilles confondus), optionnellement filtrée par catégorie. */
  getAll(category?: DocumentCategory): Promise<Document[]>;
  /** Contenu binaire brut du fichier, pour "Voir"/"Télécharger". */
  getContent(documentId: string): Promise<Blob>;
}
