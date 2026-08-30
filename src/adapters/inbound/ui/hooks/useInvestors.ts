import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { container } from "../../../../infrastructure/di/container";
import type { CreateInvestorDTO } from "../../../../application/dto/CreateInvestorDTO";
import { useDebouncedValue } from "./useDebouncedValue";

const KEYS = {
  investor: (id: string) => ["investors", id] as const,
  search: (query: string) => ["investors", "search", query] as const,
  list: (limit: number, offset: number) => ["investors", "list", limit, offset] as const,
};

/**
 * useInvestor - Hook TanStack Query. Appelle le Use Case, jamais Axios
 * directement. TanStack Query reste confiné à cette couche UI/inbound.
 */
export function useInvestor(id: string | undefined) {
  return useQuery({
    queryKey: KEYS.investor(id ?? ""),
    queryFn: () => container.useCases.investors.get.execute(id as string),
    enabled: Boolean(id),
  });
}

/**
 * useInvestors - liste paginée telle que persistée en base de données
 * (GET /api/v1/investors). Remplace l'ancien registre localStorage qui ne
 * montrait que les investisseurs créés/consultés depuis ce poste.
 */
export function useInvestors(limit = 50, offset = 0) {
  return useQuery({
    queryKey: KEYS.list(limit, offset),
    queryFn: () => container.useCases.investors.getAll.execute(limit, offset),
  });
}

export function useCreateInvestor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInvestorDTO) => container.useCases.investors.create.execute(data),
    onSuccess: (investor) => {
      queryClient.setQueryData(KEYS.investor(investor.id), investor);
      queryClient.invalidateQueries({ queryKey: ["investors", "list"] });
    },
  });
}

/**
 * useInvestorSearch - autocomplétion sur le nom/email d'un investisseur.
 * Débounce la saisie et n'interroge le backend qu'à partir de 2 caractères.
 */
export function useInvestorSearch(query: string) {
  const debouncedQuery = useDebouncedValue(query.trim(), 300);
  return useQuery({
    queryKey: KEYS.search(debouncedQuery),
    queryFn: () => container.useCases.investors.search.execute(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 30_000,
  });
}
