import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Order } from "../../../../../domain/entities/Order";
import { useExecuteOrder, useCancelOrder } from "../../hooks/useOrders";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { getErrorMessage } from "../../utils/errorMessage";

/** OrderActions - exécuter ou annuler un ordre PENDING, avec confirmation. */
export function OrderActions({ order }: { order: Order }) {
  const { t } = useTranslation();
  const executeOrder = useExecuteOrder();
  const cancelOrder = useCancelOrder();
  const [confirming, setConfirming] = useState<"execute" | "cancel" | null>(null);

  if (order.status !== "PENDING") return null;

  const error = executeOrder.error ?? cancelOrder.error;

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex gap-2">
        <button
          onClick={() => setConfirming("execute")}
          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
        >
          {t("orders.execute")}
        </button>
        <button
          onClick={() => setConfirming("cancel")}
          className="rounded-lg border border-rose-200 px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
        >
          {t("common.cancel")}
        </button>
      </div>
      {error && <p className="text-sm text-rose-600">{getErrorMessage(error)}</p>}

      <ConfirmDialog
        open={confirming === "execute"}
        title={t("orders.confirmExecuteTitle")}
        description={t("orders.confirmExecuteDescription")}
        confirmLabel={t("orders.execute")}
        pending={executeOrder.isPending}
        onConfirm={() => executeOrder.mutate(order.id, { onSuccess: () => setConfirming(null) })}
        onCancel={() => setConfirming(null)}
      />
      <ConfirmDialog
        open={confirming === "cancel"}
        title={t("orders.confirmCancelTitle")}
        description={t("orders.confirmCancelDescription")}
        confirmLabel={t("orders.cancelOrder")}
        destructive
        pending={cancelOrder.isPending}
        onConfirm={() => cancelOrder.mutate(order.id, { onSuccess: () => setConfirming(null) })}
        onCancel={() => setConfirming(null)}
      />
    </div>
  );
}
