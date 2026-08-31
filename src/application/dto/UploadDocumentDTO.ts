import type { DocumentCategory } from "../../domain/enums/DocumentCategory";

export interface UploadDocumentDTO {
  portfolioId: string;
  category: DocumentCategory;
  file: File;
}
