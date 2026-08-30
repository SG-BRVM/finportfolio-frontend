/** Cycle de vie d'un ordre. Miroir de l'enum backend `OrderStatus`. */
export type OrderStatus = "PENDING" | "EXECUTED" | "CANCELLED";

export const ORDER_STATUSES: OrderStatus[] = ["PENDING", "EXECUTED", "CANCELLED"];
