import { useTranslation } from "react-i18next";
import type { OrderStatus } from "../../../../../domain/enums/OrderStatus";
import type { OrderSide } from "../../../../../domain/enums/OrderSide";
import { Badge } from "../ui/badge";

const STATUS_VARIANT: Record<OrderStatus, "warning" | "success" | "neutral"> = {
  PENDING: "warning",
  EXECUTED: "success",
  CANCELLED: "neutral",
};

/** useOrderStatusLabels - libellés de statut d'ordre traduits, réutilisables hors du badge (ex. filtre de table). */
export function useOrderStatusLabels(): Record<OrderStatus, string> {
  const { t } = useTranslation();
  return {
    PENDING: t("enums.orderStatus.pending"),
    EXECUTED: t("enums.orderStatus.executed"),
    CANCELLED: t("enums.orderStatus.cancelled"),
  };
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const STATUS_LABELS = useOrderStatusLabels();
  return <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABELS[status]}</Badge>;
}

const SIDE_VARIANT: Record<OrderSide, "success" | "destructive"> = {
  BUY: "success",
  SELL: "destructive",
};

export function OrderSideBadge({ side }: { side: OrderSide }) {
  const { t } = useTranslation();
  const SIDE_LABELS: Record<OrderSide, string> = {
    BUY: t("enums.orderSide.buy"),
    SELL: t("enums.orderSide.sell"),
  };
  return (
    <Badge variant={SIDE_VARIANT[side]} className="font-bold tracking-wide">
      {SIDE_LABELS[side]}
    </Badge>
  );
}
