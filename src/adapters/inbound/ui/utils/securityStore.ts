import {
  DEFAULT_SESSIONS,
  DEFAULT_TWO_FACTOR_ENABLED,
  type SecuritySession,
} from "../../../../mocks/security";

/**
 * securityStore - aucun système d'authentification n'existe côté backend
 * (voir mocks/security.ts). En attendant un vrai endpoint, l'état
 * "activée/désactivée" de la double authentification et la liste des
 * sessions révoquées vivent uniquement dans localStorage.
 */
const TWO_FACTOR_KEY = "finportfolio:two-factor-enabled";
const REVOKED_SESSIONS_KEY = "finportfolio:revoked-sessions";

export function getTwoFactorEnabled(): boolean {
  const raw = localStorage.getItem(TWO_FACTOR_KEY);
  return raw === null ? DEFAULT_TWO_FACTOR_ENABLED : raw === "true";
}

export function setTwoFactorEnabled(enabled: boolean): void {
  localStorage.setItem(TWO_FACTOR_KEY, String(enabled));
}

function getRevokedSessionIds(): string[] {
  try {
    const raw = localStorage.getItem(REVOKED_SESSIONS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function listActiveSessions(): SecuritySession[] {
  const revoked = new Set(getRevokedSessionIds());
  return DEFAULT_SESSIONS.filter((s) => !revoked.has(s.id));
}

export function revokeSession(id: string): void {
  const revoked = getRevokedSessionIds();
  if (revoked.includes(id)) return;
  localStorage.setItem(REVOKED_SESSIONS_KEY, JSON.stringify([...revoked, id]));
}
