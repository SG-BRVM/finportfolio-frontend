import { useQueries } from "@tanstack/react-query";
import { container } from "../../../../infrastructure/di/container";
import type { Order } from "../../../../domain/entities/Order";
import type { Transaction } from "../../../../domain/entities/Transaction";
import type { FinancialInstrument } from "../../../../domain/entities/FinancialInstrument";
import { usePortfolios } from "./usePortfolios";
import { useInstruments } from "./useInstruments";

export interface EnrichedOrder {
  order: Order;
  portfolioName: string;
  instrument: FinancialInstrument | undefined;
}

export interface EnrichedTransaction {
  transaction: Transaction;
  portfolioName: string;
  instrument: FinancialInstrument | undefined;
}

/**
 * useConsolidatedOrders - agrège, sur tous les portefeuilles persistés en
 * base (voir usePortfolios), les ordres passés - le backend n'exposant
 * aucune liste d'ordres tous portefeuilles confondus (seulement
 * `GET /portfolios/{id}/orders`). Même principe que
 * `useConsolidatedPortfolio` pour les positions.
 */
export function useConsolidatedOrders() {
  const { portfolios, isLoading: arePortfoliosLoading } = usePortfolios();
  const knownPortfolios = portfolios;

  const ordersQueries = useQueries({
    queries: knownPortfolios.map((p) => ({
      queryKey: ["portfolios", p.id, "orders"],
      queryFn: () => container.useCases.portfolios.getOrders.execute(p.id),
    })),
  });

  const { data: instruments = [], isLoading: areInstrumentsLoading } = useInstruments();
  const instrumentsById = new Map(instruments.map((i) => [i.id, i]));

  const isLoading =
    arePortfoliosLoading || areInstrumentsLoading || ordersQueries.some((q) => q.isLoading);

  const orders: EnrichedOrder[] = knownPortfolios
    .flatMap((portfolio, index) => {
      const portfolioOrders = ordersQueries[index]?.data ?? [];
      return portfolioOrders.map((order) => ({
        order,
        portfolioName: portfolio.name,
        instrument: instrumentsById.get(order.instrumentId),
      }));
    })
    .sort((a, b) => b.order.createdAt.getTime() - a.order.createdAt.getTime());

  return {
    orders,
    isLoading,
    hasAnyPortfolio: knownPortfolios.length > 0,
  };
}

/**
 * useConsolidatedTransactions - agrège, sur tous les portefeuilles
 * persistés en base (voir usePortfolios), l'historique des exécutions
 * (GET /portfolios/{id}/transactions, lui aussi persisté en base). Même
 * principe que `useConsolidatedOrders`.
 */
export function useConsolidatedTransactions() {
  const { portfolios, isLoading: arePortfoliosLoading } = usePortfolios();
  const knownPortfolios = portfolios;
  const portfolioNameById = new Map(knownPortfolios.map((p) => [p.id, p.name]));

  const transactionsQueries = useQueries({
    queries: knownPortfolios.map((p) => ({
      queryKey: ["portfolios", p.id, "transactions"],
      queryFn: () => container.useCases.portfolios.getTransactions.execute(p.id),
    })),
  });

  const { data: instruments = [], isLoading: areInstrumentsLoading } = useInstruments();
  const instrumentsById = new Map(instruments.map((i) => [i.id, i]));

  const isLoading =
    arePortfoliosLoading || areInstrumentsLoading || transactionsQueries.some((q) => q.isLoading);

  const transactions: EnrichedTransaction[] = knownPortfolios
    .flatMap((portfolio, index) => {
      const portfolioTransactions = transactionsQueries[index]?.data ?? [];
      return portfolioTransactions.map((transaction) => ({
        transaction,
        portfolioName: portfolioNameById.get(portfolio.id) ?? portfolio.id.slice(0, 8),
        instrument: instrumentsById.get(transaction.instrumentId),
      }));
    })
    .sort((a, b) => b.transaction.executedAt.getTime() - a.transaction.executedAt.getTime());

  return {
    transactions,
    isLoading,
  };
}
