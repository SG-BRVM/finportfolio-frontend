import type { Document } from "../../../../domain/entities/Document";
import type { DocumentCategory } from "../../../../domain/enums/DocumentCategory";

/** Forme exacte de la réponse JSON du backend (DocumentResponse, snake_case). */
export interface DocumentApiResponse {
  id: string;
  portfolio_id: string;
  name: string;
  category: DocumentCategory;
  content_type: string;
  size_bytes: number;
  created_at: string;
}

export class DocumentMapper {
  static toDomain(response: DocumentApiResponse): Document {
    return {
      id: response.id,
      portfolioId: response.portfolio_id,
      name: response.name,
      category: response.category,
      contentType: response.content_type,
      sizeBytes: response.size_bytes,
      createdAt: new Date(response.created_at),
    };
  }
}
