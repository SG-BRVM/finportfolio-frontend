import { useQueries } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { container } from "../../../../infrastructure/di/container";
import type { Order } from "../../../../domain/entities/Order";
import type { OrderStatus } from "../../../../domain/enums/OrderStatus";
import { usePortfolios } from "./usePortfolios";
import { useInstruments } from "./useInstruments";

export interface OrderAlert {
  readonly order: Order;
  readonly portfolioName: string;
  readonly instrumentSymbol: string;
}

/** Libellé d'alerte associé au statut réel de l'ordre - partagé entre
 * AlertsPage et l'aperçu du Topbar pour rester cohérent. */
export function useOrderAlertTitle(): Record<OrderStatus, string> {
  const { t } = useTranslation();
  return {
    EXECUTED: t("alerts.orderExecuted"),
    PENDING: t("alerts.orderPending"),
    CANCELLED: t("alerts.orderCancelled"),
  };
}

/**
 * useOrderAlerts - alertes réelles dérivées des ordres passés sur tous
 * les portefeuilles (`GET /portfolios/{id}/orders`, même source que
 * `usePortfolioOrders` / `PortfolioOrdersTable`). Il n'existe pas
 * d'endpoint global "tous les ordres" côté backend : on part de la liste
 * des portefeuilles (`usePortfolios`) et on interroge leurs ordres en
 * parallèle, puis on fusionne et trie par date de création décroissante.
 *
 * Remplace mocks/notifications.ts, qui couvrait aussi les catégories
 * performance/risque/marchés/sécurité - sans contrepartie backend
 * (aucune notion de ce type dans le Domain), ces catégories ont été
 * retirées plutôt que mockées.
 */
export function useOrderAlerts() {
  const { t } = useTranslation();
  const { portfolios, isLoading: arePortfoliosLoading } = usePortfolios();
  const { data: instruments = [], isLoading: areInstrumentsLoading } = useInstruments();

  const orderQueries = useQueries({
    queries: portfolios.map((portfolio) => ({
      queryKey: ["portfolios", portfolio.id, "orders"],
      queryFn: () => container.useCases.portfolios.getOrders.execute(portfolio.id),
    })),
  });

  const isLoading =
    arePortfoliosLoading || areInstrumentsLoading || orderQueries.some((q) => q.isLoading);

  const portfoliosById = new Map(portfolios.map((p) => [p.id, p]));
  const instrumentsById = new Map(instruments.map((i) => [i.id, i]));

  const alerts: OrderAlert[] = orderQueries
    .flatMap((query) => query.data ?? [])
    .map((order) => ({
      order,
      portfolioName: portfoliosById.get(order.portfolioId)?.name ?? t("common.portfolio"),
      instrumentSymbol: instrumentsById.get(order.instrumentId)?.symbol ?? "-",
    }))
    .sort((a, b) => b.order.createdAt.getTime() - a.order.createdAt.getTime());

  return { alerts, isLoading };
}
