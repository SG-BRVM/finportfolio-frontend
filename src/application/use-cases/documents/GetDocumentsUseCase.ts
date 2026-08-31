import type { DocumentRepository } from "../../ports/DocumentRepository";
import type { Document } from "../../../domain/entities/Document";
import type { DocumentCategory } from "../../../domain/enums/DocumentCategory";

export class GetDocumentsUseCase {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async execute(category?: DocumentCategory): Promise<Document[]> {
    return this.documentRepository.getAll(category);
  }
}
