import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Landmark, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
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

function buildSchema(t: TFunction) {
  return z.object({
    amount: z
      .string()
      .min(1, t("portfolios.cash.amountRequired"))
      .refine((v) => Number(v) > 0, t("portfolios.cash.amountPositive")),
  });
}

type FormValues = z.infer<ReturnType<typeof buildSchema>>;

/**
 * CashActions - dépôt/retrait de capital sur un portefeuille.
 *
 * C'est le seul moyen légitime pour un portefeuille d'obtenir du pouvoir
 * d'achat : sans dépôt préalable, aucun ordre BUY ne peut être exécuté
 * (voir OrderValidationService.ensure_buy_is_affordable côté backend).
 */
export function CashActions({ portfolio }: { portfolio: Portfolio }) {
  const { t, i18n } = useTranslation();
  const schema = useMemo(() => buildSchema(t), [i18n.language]); // eslint-disable-line react-hooks/exhaustive-deps
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
          {t("portfolios.cash.deposit")}
        </Button>
        <Button variant="outline" size="sm" onClick={() => setMode("withdraw")}>
          <Wallet className="h-4 w-4" />
          {t("portfolios.cash.withdraw")}
        </Button>
      </div>

      <Dialog open={mode !== null} onOpenChange={(next) => !next && close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              t(mode === "deposit" ? "portfolios.cash.depositTitle" : "portfolios.cash.withdrawTitle")
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} noValidate className="space-y-4">
            <div>
              <Label>{t("common.amount")} ({portfolio.currency})</Label>
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
                {t("common.cancel")}
              </Button>
              <Button type="submit" size="sm" disabled={mutation.isPending}>
                {mutation.isPending
                  ? t("common.inProgress")
                  : mode === "deposit"
                    ? t("portfolios.cash.deposit")
                    : t("portfolios.cash.withdraw")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
