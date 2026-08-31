import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { container } from "../../../../infrastructure/di/container";
import type { UploadDocumentDTO } from "../../../../application/dto/UploadDocumentDTO";
import type { DocumentCategory } from "../../../../domain/enums/DocumentCategory";

const KEY = ["documents", "list"] as const;

/**
 * useDocuments - liste globale des documents envoyés (GET
 * /api/v1/documents), optionnellement filtrée par catégorie. Remplace
 * mocks/documents.ts.
 */
export function useDocuments(category?: DocumentCategory) {
  return useQuery({
    queryKey: [...KEY, category ?? "ALL"] as const,
    queryFn: () => container.useCases.documents.getAll.execute(category),
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UploadDocumentDTO) =>
      container.useCases.documents.upload.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
    },
  });
}

/** Récupère le contenu binaire d'un document, pour "Voir" (ouverture
 * dans un nouvel onglet) ou "Télécharger" (enregistrement forcé) - même
 * appel réseau, seul le traitement du Blob en résultant diffère. */
export function useDocumentContent() {
  return useMutation({
    mutationFn: (documentId: string) =>
      container.useCases.documents.getContent.execute(documentId),
  });
}
