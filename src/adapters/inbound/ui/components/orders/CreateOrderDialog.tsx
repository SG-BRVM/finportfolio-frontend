import { useState } from "react";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { CreateOrderForm } from "./CreateOrderForm";

interface CreateOrderDialogProps {
  defaultPortfolioId?: string;
  onCreated?: (orderId: string) => void;
}

/**
 * CreateOrderDialog - bouton "Nouvel ordre" qui ouvre un Dialog contenant
 * le formulaire de création (voir CreateOrderForm, qui gère lui-même le
 * résumé et la confirmation via AlertDialog). Le Dialog se referme
 * automatiquement une fois l'ordre confirmé.
 */
export function CreateOrderDialog({ defaultPortfolioId, onCreated }: CreateOrderDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          {t("orders.newOrder")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("orders.newOrder")}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{t("orders.newOrderDescription")}</DialogDescription>
        <CreateOrderForm
          defaultPortfolioId={defaultPortfolioId}
          onCreated={onCreated}
          onDone={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
