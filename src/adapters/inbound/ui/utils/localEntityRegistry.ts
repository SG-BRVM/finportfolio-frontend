/**
 * localEntityRegistry - le backend FinPortfolio n'expose volontairement
 * aucun endpoint de liste pour les Investors ou les Portfolios (seulement
 * `POST` et `GET /{id}`) : sur une vraie API financière, lister TOUS les
 * investisseurs ou portefeuilles est rarement une opération publique
 * anodine - voir /docs Swagger du backend.
 *
 * Pour offrir une page "liste" malgré tout, l'UI mémorise localement
 * (localStorage du navigateur) les identifiants créés ou consultés dans
 * cette session, puis récupère chaque entité via le Use Case `getById`
 * existant. Ceci est une préoccupation d'adapter UI (stockage
 * navigateur), pas une règle métier : elle ne pollue ni le Domain ni
 * l'Application.
 */
const STORAGE_PREFIX = "finportfolio:known:";

export function rememberEntityId(entityType: "investors" | "portfolios", id: string): void {
  const known = listKnownIds(entityType);
  if (!known.includes(id)) {
    localStorage.setItem(STORAGE_PREFIX + entityType, JSON.stringify([...known, id]));
  }
}

export function listKnownIds(entityType: "investors" | "portfolios"): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + entityType);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}
