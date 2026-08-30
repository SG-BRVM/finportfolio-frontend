import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTwoFactorEnabled,
  listActiveSessions,
  revokeSession,
  setTwoFactorEnabled,
} from "../utils/securityStore";

const TWO_FACTOR_KEY = ["security", "two-factor"] as const;
const SESSIONS_KEY = ["security", "sessions"] as const;

export function useTwoFactorEnabled() {
  return useQuery({
    queryKey: TWO_FACTOR_KEY,
    queryFn: () => getTwoFactorEnabled(),
    staleTime: Infinity,
  });
}

export function useSetTwoFactorEnabled() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (enabled: boolean) => Promise.resolve(setTwoFactorEnabled(enabled)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TWO_FACTOR_KEY });
    },
  });
}

export function useActiveSessions() {
  return useQuery({
    queryKey: SESSIONS_KEY,
    queryFn: () => listActiveSessions(),
    staleTime: Infinity,
  });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => Promise.resolve(revokeSession(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSIONS_KEY });
    },
  });
}
