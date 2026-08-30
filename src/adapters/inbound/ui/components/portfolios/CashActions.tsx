import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Landmark, Wallet } from "lucide-react";
import type { Portfolio } from "../../../../../domain/entities/Portfolio";
import { useDepositCapital, useWithdrawCapital } from "../../hooks/usePortfolios";
import { getErrorMessage } from "../../utils/errorMessage";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

const schema = z.object({
  amount: z
    .string()
    .min(1, "Le montant est requis.")
    .refine((v) => Number(v) > 0, "Le montant doit être strictement positif."),
});

type FormValues = z.infer<typeof schema>;

/**
 * CashActions - dépôt/retrait de capital sur un portefeuille.
 *
 * C'est le seul moyen légitime pour un portefeuille d'obtenir du pouvoir
 * d'achat : sans dépôt préalable, aucun ordre BUY ne peut être exécuté
 * (voir OrderValidationService.ensure_buy_is_affordable côté backend).
 */
export function CashActions({ portfolio }: { portfolio: Portfolio }) {
  const [mode, setMode] = useState<"deposit" | "withdraw" | null>(null);
  const depositCapital = useDepositCapital();
  const withdrawCapital = useWithdrawCapital();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { amount: "" },
  });

  const mutation = mode === "deposit" ? depositCapital : withdrawCapital;

  const close = () => {
    setMode(null);
    reset({ amount: "" });
    depositCapital.reset();
    withdrawCapital.reset();
  };

  const onSubmit = handleSubmit((values) => {
    mutation.mutate(
      { portfolioId: portfolio.id, amount: values.amount },
      { onSuccess: close }
    );
  });

  return (
    <>
      <div className="flex gap-2">
        <Button variant="success" size="sm" onClick={() => setMode("deposit")}>
          <Landmark className="h-4 w-4" />
          Déposer
        </Button>
        <Button variant="outline" size="sm" onClick={() => setMode("withdraw")}>
          <Wallet className="h-4 w-4" />
          Retirer
        </Button>
      </div>

      <Dialog open={mode !== null} onOpenChange={(next) => !next && close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {mode === "deposit" ? "Déposer du capital" : "Retirer du capital"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} noValidate className="space-y-4">
            <div>
              <Label>Montant ({portfolio.currency})</Label>
              <input
                {...register("amount")}
                type="text"
                inputMode="decimal"
                placeholder="10000.00"
                autoFocus
                className="w-full rounded-lg border border-ink-200 px-3 py-2 font-ledger text-sm focus:border-brand-400"
              />
              {errors.amount && (
                <p className="mt-1 text-xs text-rose-600">{errors.amount.message}</p>
              )}
            </div>
            {mutation.isError && (
              <p className="text-sm text-rose-600">{getErrorMessage(mutation.error)}</p>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={close}>
                Annuler
              </Button>
              <Button type="submit" size="sm" disabled={mutation.isPending}>
                {mutation.isPending
                  ? "En cours…"
                  : mode === "deposit"
                    ? "Déposer"
                    : "Retirer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
