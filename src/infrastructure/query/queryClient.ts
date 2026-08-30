import { QueryClient } from "@tanstack/react-query";

/**
 * queryClient - configuration centralisée de TanStack Query. TanStack
 * Query reste cantonné à la couche UI (hooks) : ni le Domain, ni
 * l'Application n'en ont connaissance.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
