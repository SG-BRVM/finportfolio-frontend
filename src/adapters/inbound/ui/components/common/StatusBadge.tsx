import type { OrderStatus } from "../../../../../domain/enums/OrderStatus";
import type { OrderSide } from "../../../../../domain/enums/OrderSide";
import { Badge } from "../ui/badge";

const STATUS_VARIANT: Record<OrderStatus, "warning" | "success" | "neutral"> = {
  PENDING: "warning",
  EXECUTED: "success",
  CANCELLED: "neutral",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "En attente",
  EXECUTED: "Exécuté",
  CANCELLED: "Annulé",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABELS[status]}</Badge>;
}

const SIDE_VARIANT: Record<OrderSide, "success" | "destructive"> = {
  BUY: "success",
  SELL: "destructive",
};

const SIDE_LABELS: Record<OrderSide, string> = {
  BUY: "ACHAT",
  SELL: "VENTE",
};

export function OrderSideBadge({ side }: { side: OrderSide }) {
  return (
    <Badge variant={SIDE_VARIANT[side]} className="font-bold tracking-wide">
      {SIDE_LABELS[side]}
    </Badge>
  );
}
