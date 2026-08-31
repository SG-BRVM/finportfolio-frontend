import { useState } from "react";
import { Upload } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useUploadDocument } from "../../hooks/useDocuments";
import { usePortfolios } from "../../hooks/usePortfolios";
import { DOCUMENT_CATEGORIES, DOCUMENT_CATEGORY_LABELS } from "../../../../../domain/enums/DocumentCategory";
import type { DocumentCategory } from "../../../../../domain/enums/DocumentCategory";

/**
 * UploadDocumentDialog - "Ajouter un document". Envoie réellement le
 * fichier au backend (POST /api/v1/documents, multipart) et l'attache à
 * un portefeuille choisi dans le formulaire (voir hooks/useDocuments.ts).
 */
export function UploadDocumentDialog() {
  const [open, setOpen] = useState(false);
  const [portfolioId, setPortfolioId] = useState("");
  const [category, setCategory] = useState<DocumentCategory | "">("");
  const [file, setFile] = useState<File | null>(null);

  const { portfolios } = usePortfolios();
  const uploadDocument = useUploadDocument();

  const isValid = portfolioId !== "" && category !== "" && file !== null;

  const reset = () => {
    setPortfolioId("");
    setCategory("");
    setFile(null);
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    await uploadDocument.mutateAsync({ portfolioId, category, file });
    reset();
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Upload className="h-4 w-4" />
          Ajouter un document
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un document</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Envoyez un fichier et rattachez-le à l'un de vos portefeuilles.
        </DialogDescription>

        <div className="space-y-4">
          <div>
            <Label>Portefeuille</Label>
            <Select value={portfolioId} onValueChange={setPortfolioId}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un portefeuille" />
              </SelectTrigger>
              <SelectContent>
                {portfolios.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Catégorie</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as DocumentCategory)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {DOCUMENT_CATEGORY_LABELS[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Fichier</Label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-ink-600 file:mr-3 file:rounded-md file:border-0 file:bg-ink-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-ink-700 hover:file:bg-ink-200"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid || uploadDocument.isPending}>
            {uploadDocument.isPending ? "Envoi…" : "Envoyer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
