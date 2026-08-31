import type { DocumentRepository } from "../../ports/DocumentRepository";
import type { UploadDocumentDTO } from "../../dto/UploadDocumentDTO";
import type { Document } from "../../../domain/entities/Document";

export class UploadDocumentUseCase {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async execute(command: UploadDocumentDTO): Promise<Document> {
    return this.documentRepository.upload(command);
  }
}
