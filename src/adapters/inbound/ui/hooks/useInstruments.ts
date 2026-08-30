import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { container } from "../../../../infrastructure/di/container";
import type { CreateInstrumentDTO } from "../../../../application/dto/CreateInstrumentDTO";
import type { UpdateNominalValueDTO } from "../../../../application/dto/UpdateNominalValueDTO";
import { useDebouncedValue } from "./useDebouncedValue";

const KEYS = {
  all: ["instruments"] as const,
  one: (id: string) => ["instruments", id] as const,
  search: (query: string) => ["instruments", "search", query] as const,
  history: (id: string) => ["instruments", id, "history"] as const,
};

export function useInstruments() {
  return useQuery({
    queryKey: KEYS.all,
    queryFn: () => container.useCases.instruments.getAll.execute(),
  });
}

export function useInstrument(id: string | undefined) {
  return useQuery({
    queryKey: KEYS.one(id ?? ""),
    queryFn: () => container.useCases.instruments.get.execute(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateInstrument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInstrumentDTO) => container.useCases.instruments.create.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.all });
    },
  });
}

/** useInstrumentSearch - autocomplétion sur le symbole/nom d'un instrument. */
export function useInstrumentSearch(query: string) {
  const debouncedQuery = useDebouncedValue(query.trim(), 300);
  return useQuery({
    queryKey: KEYS.search(debouncedQuery),
    queryFn: () => container.useCases.instruments.search.execute(debouncedQuery),
    enabled: debouncedQuery.length >= 1,
    staleTime: 30_000,
  });
}

/** useInstrumentHistory - historique complet (création, cours, valeur
 * nominale) d'un instrument, le plus récent en premier. */
export function useInstrumentHistory(id: string | undefined) {
  return useQuery({
    queryKey: KEYS.history(id ?? ""),
    queryFn: () => container.useCases.instruments.getHistory.execute(id as string),
    enabled: Boolean(id),
  });
}

/** useUpdateNominalValue - modifie la valeur nominale d'un instrument
 * (opération sur titres : division, regroupement d'actions). */
export function useUpdateNominalValue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateNominalValueDTO) =>
      container.useCases.instruments.updateNominalValue.execute(data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: KEYS.all });
      queryClient.invalidateQueries({ queryKey: KEYS.one(variables.instrumentId) });
      queryClient.invalidateQueries({ queryKey: KEYS.history(variables.instrumentId) });
    },
  });
}
