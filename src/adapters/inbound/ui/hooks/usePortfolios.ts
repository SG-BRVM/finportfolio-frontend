import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { container } from "../../../../infrastructure/di/container";
import type { CreatePortfolioDTO } from "../../../../application/dto/CreatePortfolioDTO";
import type { CashOperationDTO } from "../../../../application/dto/CashOperationDTO";
import { useDebouncedValue } from "./useDebouncedValue";

const KEYS = {
  portfolio: (id: string) => ["portfolios", id] as const,
  positions: (id: string) => ["portfolios", id, "positions"] as const,
  valuation: (id: string) => ["portfolios", id, "valuation"] as const,
  pnl: (id: string) => ["portfolios", id, "pnl"] as const,
  orders: (id: string) => ["portfolios", id, "orders"] as const,
  transactions: (id: string) => ["portfolios", id, "transactions"] as const,
  search: (query: string, investorId?: string) =>
    ["portfolios", "search", query, investorId ?? ""] as const,
  list: (limit: number, offset: number) => ["portfolios", "list", limit, offset] as const,
};

export function usePortfolio(id: string | undefined) {
  return useQuery({
    queryKey: KEYS.portfolio(id ?? ""),
    queryFn: () => container.useCases.portfolios.get.execute(id as string),
    enabled: Boolean(id),
  });
}

/**
 * usePortfolios - liste paginée telle que persistée en base de données
 * (GET /api/v1/portfolios). Remplace l'ancien registre localStorage qui ne
 * montrait que les portefeuilles créés/consultés depuis ce poste.
 */
export function usePortfolios(limit = 50, offset = 0) {
  const query = useQuery({
    queryKey: KEYS.list(limit, offset),
    queryFn: () => container.useCases.portfolios.getAll.execute(limit, offset),
  });
  return { portfolios: query.data ?? [], isLoading: query.isLoading };
}

export function useCreatePortfolio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePortfolioDTO) => container.useCases.portfolios.create.execute(data),
    onSuccess: (portfolio) => {
      queryClient.setQueryData(KEYS.portfolio(portfolio.id), portfolio);
      queryClient.invalidateQueries({ queryKey: ["portfolios", "list"] });
    },
  });
}

export function usePortfolioPositions(id: string | undefined) {
  return useQuery({
    queryKey: KEYS.positions(id ?? ""),
    queryFn: () => container.useCases.portfolios.getPositions.execute(id as string),
    enabled: Boolean(id),
  });
}

export function usePortfolioValuation(id: string | undefined) {
  return useQuery({
    queryKey: KEYS.valuation(id ?? ""),
    queryFn: () => container.useCases.portfolios.getValuation.execute(id as string),
    enabled: Boolean(id),
  });
}

export function usePortfolioPnl(id: string | undefined) {
  return useQuery({
    queryKey: KEYS.pnl(id ?? ""),
    queryFn: () => container.useCases.portfolios.getPnl.execute(id as string),
    enabled: Boolean(id),
  });
}

export function usePortfolioOrders(id: string | undefined) {
  return useQuery({
    queryKey: KEYS.orders(id ?? ""),
    queryFn: () => container.useCases.portfolios.getOrders.execute(id as string),
    enabled: Boolean(id),
  });
}

/**
 * usePortfolioTransactions - historique des exécutions (fills) persisté en
 * base pour un portefeuille (GET /api/v1/portfolios/{id}/transactions).
 */
export function usePortfolioTransactions(id: string | undefined) {
  return useQuery({
    queryKey: KEYS.transactions(id ?? ""),
    queryFn: () => container.useCases.portfolios.getTransactions.execute(id as string),
    enabled: Boolean(id),
  });
}

/**
 * usePortfolioSearch - autocomplétion sur le nom d'un portefeuille,
 * optionnellement restreinte à un investisseur déjà sélectionné.
 */
export function usePortfolioSearch(query: string, investorId?: string) {
  const debouncedQuery = useDebouncedValue(query.trim(), 300);
  return useQuery({
    queryKey: KEYS.search(debouncedQuery, investorId),
    queryFn: () => container.useCases.portfolios.search.execute(debouncedQuery, investorId),
    enabled: debouncedQuery.length >= 2,
    staleTime: 30_000,
  });
}

export function useDepositCapital() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CashOperationDTO) => container.useCases.portfolios.deposit.execute(data),
    onSuccess: (portfolio) => {
      queryClient.setQueryData(KEYS.portfolio(portfolio.id), portfolio);
    },
  });
}

export function useWithdrawCapital() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CashOperationDTO) => container.useCases.portfolios.withdraw.execute(data),
    onSuccess: (portfolio) => {
      queryClient.setQueryData(KEYS.portfolio(portfolio.id), portfolio);
    },
  });
}
