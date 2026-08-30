import { useMutation, useQuery } from "@tanstack/react-query";
import { container } from "../../../../infrastructure/di/container";

export function useBackendHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: () => container.useCases.health.check.execute(),
    refetchInterval: 15_000,
  });
}

export function useRunFastDemo() {
  return useMutation({
    mutationFn: () => container.useCases.health.demo.executeFast(),
  });
}

export function useRunSlowDemo() {
  return useMutation({
    mutationFn: () => container.useCases.health.demo.executeSlow(),
  });
}
