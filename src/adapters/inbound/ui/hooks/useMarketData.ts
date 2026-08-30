import { useMutation, useQueryClient } from "@tanstack/react-query";
import { container } from "../../../../infrastructure/di/container";

/** useRefreshMarketPrices - déclenche le connecteur de scraping manuel
 * (BRVM) et invalide la liste des instruments pour refléter les
 * nouveaux cours. Rien n'est planifié : c'est un appel explicite,
 * initié par l'utilisateur depuis l'écran Instruments. */
export function useRefreshMarketPrices() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => container.useCases.marketData.refreshPrices.execute(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instruments"] });
    },
  });
}
