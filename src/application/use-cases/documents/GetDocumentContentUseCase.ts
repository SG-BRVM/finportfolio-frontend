import type { DocumentRepository } from "../../ports/DocumentRepository";

export class GetDocumentContentUseCase {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async execute(documentId: string): Promise<Blob> {
    return this.documentRepository.getContent(documentId);
  }
}
