import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { container } from "../../../../infrastructure/di/container";
import type { CreateOrderDTO } from "../../../../application/dto/CreateOrderDTO";

const KEYS = {
  order: (id: string) => ["orders", id] as const,
  portfolioOrders: (portfolioId: string) => ["portfolios", portfolioId, "orders"] as const,
};

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: KEYS.order(id ?? ""),
    queryFn: () => container.useCases.orders.get.execute(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderDTO) => container.useCases.orders.create.execute(data),
    onSuccess: (order) => {
      queryClient.setQueryData(KEYS.order(order.id), order);
      queryClient.invalidateQueries({ queryKey: KEYS.portfolioOrders(order.portfolioId) });
    },
  });
}

export function useExecuteOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => container.useCases.orders.execute.execute(orderId),
    onSuccess: (transaction) => {
      // Le backend persiste la Transaction en base (GET
      // /portfolios/{id}/transactions) : on invalide la query pour la
      // faire réapparaître dans l'onglet "Transactions".
      queryClient.invalidateQueries({ queryKey: ["portfolios", transaction.portfolioId, "transactions"] });
      queryClient.invalidateQueries({ queryKey: KEYS.order(transaction.orderId) });
      queryClient.invalidateQueries({ queryKey: KEYS.portfolioOrders(transaction.portfolioId) });
      queryClient.invalidateQueries({ queryKey: ["portfolios", transaction.portfolioId] });
      queryClient.invalidateQueries({ queryKey: ["portfolios", transaction.portfolioId, "positions"] });
      queryClient.invalidateQueries({ queryKey: ["portfolios", transaction.portfolioId, "valuation"] });
      queryClient.invalidateQueries({ queryKey: ["portfolios", transaction.portfolioId, "pnl"] });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => container.useCases.orders.cancel.execute(orderId),
    onSuccess: (order) => {
      queryClient.setQueryData(KEYS.order(order.id), order);
      queryClient.invalidateQueries({ queryKey: KEYS.portfolioOrders(order.portfolioId) });
    },
  });
}

export { usePortfolioOrders } from "./usePortfolios";
