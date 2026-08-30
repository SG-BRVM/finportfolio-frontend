import { useMemo, useState } from "react";
import { FileText, Eye, Download, Share2 } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { EmptyState } from "../components/common/EmptyState";
import {
  DOCUMENTS,
  DOCUMENT_CATEGORY_LABELS,
  type DocumentCategory,
} from "../../../../mocks/documents";
import { formatDateShort } from "../../../../shared/utils/formatDate";
import { formatNumber } from "../../../../shared/utils/formatNumber";

/**
 * DocumentsPage - "Mes documents". Le backend n'expose aucune notion de
 * document (voir mocks/documents.ts) : la liste ci-dessous est une
 * démonstration. N'étant adossées à aucun fichier réel, les actions
 * restent volontairement inertes plutôt que de simuler un téléchargement
 * trompeur.
 */
export function DocumentsPage() {
  const [category, setCategory] = useState<DocumentCategory | "all">("all");

  const filtered = useMemo(
    () => (category === "all" ? DOCUMENTS : DOCUMENTS.filter((d) => d.category === category)),
    [category],
  );

  return (
    <PageContainer title="Mes documents" description="Vos relevés et documents réglementaires.">
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4 max-w-xs">
            <Select value={category} onValueChange={(v) => setCategory(v as DocumentCategory | "all")}>
              <SelectTrigger>
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {(Object.keys(DOCUMENT_CATEGORY_LABELS) as DocumentCategory[]).map((c) => (
                  <SelectItem key={c} value={c}>
                    {DOCUMENT_CATEGORY_LABELS[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Aucun document"
              description="Aucun document dans cette catégorie."
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Taille</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-center gap-2 font-medium text-ink-900">
                          <FileText className="h-4 w-4 text-ink-300" />
                          {doc.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="neutral">{DOCUMENT_CATEGORY_LABELS[doc.category]}</Badge>
                      </TableCell>
                      <TableCell className="font-ledger text-xs text-ink-500">
                        {formatDateShort(doc.date)}
                      </TableCell>
                      <TableCell className="text-right font-ledger text-ink-500">
                        {formatNumber(doc.sizeKb)} Ko
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1 text-ink-300">
                          <span title="Non disponible en démonstration">
                            <Eye className="h-4 w-4 cursor-not-allowed" />
                          </span>
                          <span title="Non disponible en démonstration">
                            <Download className="h-4 w-4 cursor-not-allowed" />
                          </span>
                          <span title="Non disponible en démonstration">
                            <Share2 className="h-4 w-4 cursor-not-allowed" />
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className="mt-4 text-xs text-ink-400">
                Documents de démonstration : les actions Voir / Télécharger / Partager ne sont pas
                connectées à un fichier réel.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
