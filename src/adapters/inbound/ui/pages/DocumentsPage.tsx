import { useState } from "react";
import { FileText, Eye, Download } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Skeleton } from "../components/ui/skeleton";
import { EmptyState } from "../components/common/EmptyState";
import { UploadDocumentDialog } from "../components/documents/UploadDocumentDialog";
import { useDocuments } from "../hooks/useDocuments";
import { container } from "../../../../infrastructure/di/container";
import { DOCUMENT_CATEGORIES } from "../../../../domain/enums/DocumentCategory";
import { useDocumentCategoryLabels } from "../components/common/useDocumentCategoryLabels";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import type { DocumentCategory } from "../../../../domain/enums/DocumentCategory";
import type { Document } from "../../../../domain/entities/Document";
import { formatDateShort } from "../../../../shared/utils/formatDate";

function formatFileSize(bytes: number, t: TFunction): string {
  if (bytes < 1024) return t("documents.sizeBytes", { count: bytes });
  if (bytes < 1024 * 1024) return t("documents.sizeKb", { value: (bytes / 1024).toFixed(1) });
  return t("documents.sizeMb", { value: (bytes / (1024 * 1024)).toFixed(1) });
}

/** Récupère le fichier et l'ouvre (Voir) ou force son enregistrement
 * (Télécharger) - même appel réseau, seul le traitement du Blob diffère. */
async function openDocument(document: Document, mode: "view" | "download") {
  const blob = await container.useCases.documents.getContent.execute(document.id);
  const url = URL.createObjectURL(blob);
  if (mode === "download") {
    const link = window.document.createElement("a");
    link.href = url;
    link.download = document.name;
    link.click();
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
  // Laisse le temps au navigateur d'ouvrir/télécharger avant de révoquer.
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

/**
 * DocumentsPage - "Mes documents". Fonctionnalité réelle de bout en
 * bout : envoi (UploadDocumentDialog), listing filtrable par catégorie
 * (useDocuments, GET /api/v1/documents) et récupération du contenu réel
 * (GET /api/v1/documents/{id}/content) pour "Voir"/"Télécharger".
 * Remplace mocks/documents.ts. L'action "Partager" a été retirée : il
 * n'existe aucune notion de partage côté backend.
 */
export function DocumentsPage() {
  const { t } = useTranslation();
  const categoryLabels = useDocumentCategoryLabels();
  const [category, setCategory] = useState<DocumentCategory | "all">("all");
  const { data: documents = [], isLoading } = useDocuments(
    category === "all" ? undefined : category,
  );

  return (
    <PageContainer title={t("documents.pageTitle")} description={t("documents.pageDescription")}>
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="max-w-xs flex-1">
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as DocumentCategory | "all")}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("common.type")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("documents.allCategories")}</SelectItem>
                  {DOCUMENT_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {categoryLabels[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <UploadDocumentDialog />
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : documents.length === 0 ? (
            <EmptyState
              icon={FileText}
              title={t("documents.emptyTitle")}
              description={t("documents.emptyDescription")}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("common.name")}</TableHead>
                  <TableHead>{t("common.type")}</TableHead>
                  <TableHead>{t("common.date")}</TableHead>
                  <TableHead className="text-right">{t("documents.size")}</TableHead>
                  <TableHead className="text-right">{t("common.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center gap-2 font-medium text-ink-900">
                        <FileText className="h-4 w-4 text-ink-300" />
                        {doc.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="neutral">{categoryLabels[doc.category]}</Badge>
                    </TableCell>
                    <TableCell className="font-ledger text-xs text-ink-500">
                      {formatDateShort(doc.createdAt)}
                    </TableCell>
                    <TableCell className="text-right font-ledger text-ink-500">
                      {formatFileSize(doc.sizeBytes, t)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1 text-ink-400">
                        <button
                          type="button"
                          title={t("documents.view")}
                          onClick={() => openDocument(doc, "view")}
                          className="rounded p-1 transition hover:bg-ink-100 hover:text-ink-700"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          title={t("common.download")}
                          onClick={() => openDocument(doc, "download")}
                          className="rounded p-1 transition hover:bg-ink-100 hover:text-ink-700"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
