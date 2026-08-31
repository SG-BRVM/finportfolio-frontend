import type { DocumentRepository } from "../../../../application/ports/DocumentRepository";
import type { UploadDocumentDTO } from "../../../../application/dto/UploadDocumentDTO";
import type { Document } from "../../../../domain/entities/Document";
import type { DocumentCategory } from "../../../../domain/enums/DocumentCategory";
import type { HttpClient } from "../axios/HttpClient";
import { DocumentMapper, type DocumentApiResponse } from "../mappers/DocumentMapper";

export class HttpDocumentRepository implements DocumentRepository {
  constructor(private readonly http: HttpClient) {}

  async upload(data: UploadDocumentDTO): Promise<Document> {
    const formData = new FormData();
    formData.append("portfolio_id", data.portfolioId);
    formData.append("category", data.category);
    formData.append("file", data.file);

    const response = await this.http.postForm<DocumentApiResponse>(
      "/api/v1/documents",
      formData
    );
    return DocumentMapper.toDomain(response);
  }

  async getAll(category?: DocumentCategory): Promise<Document[]> {
    const url = category
      ? `/api/v1/documents?category=${category}`
      : "/api/v1/documents";
    const response = await this.http.get<DocumentApiResponse[]>(url);
    return response.map(DocumentMapper.toDomain);
  }

  async getContent(documentId: string): Promise<Blob> {
    return this.http.getBlob(`/api/v1/documents/${documentId}/content`);
  }
}
