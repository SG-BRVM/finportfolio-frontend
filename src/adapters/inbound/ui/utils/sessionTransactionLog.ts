import { Decimal } from "../../../../domain/value-objects/Decimal";
import { Money } from "../../../../domain/value-objects/Money";
import type { Transaction } from "../../../../domain/entities/Transaction";

/**
 * sessionTransactionLog - le backend FinPortfolio n'expose AUCUN endpoint
 * de liste de transactions (ni globalement, ni par portefeuille) : seule
 * l'exécution d'un ordre (`POST /api/v1/orders/{id}/execute`) retourne la
 * Transaction résultante, sans aucun moyen de la retrouver ensuite.
 *
 * Endpoint qui serait réellement nécessaire pour un historique fiable :
 *   GET /api/v1/portfolios/{portfolio_id}/transactions -> TransactionResponse[]
 *
 * En attendant, et à l'image de `localEntityRegistry` pour les
 * portefeuilles/investisseurs, l'UI mémorise localement (localStorage) la
 * transaction reçue lors de chaque exécution d'ordre. C'est une
 * préoccupation d'adapter UI (stockage navigateur), pas une règle
 * métier : elle ne pollue ni le Domain ni l'Application.
 */
const STORAGE_KEY = "finportfolio:session-transactions";

interface StoredTransaction {
  id: string;
  portfolioId: string;
  instrumentId: string;
  orderId: string;
  side: Transaction["side"];
  quantity: string;
  priceAmount: string;
  priceCurrency: string;
  executedAt: string;
}

function readStored(): StoredTransaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredTransaction[]) : [];
  } catch {
    return [];
  }
}

/** Mémorise une transaction reçue suite à l'exécution d'un ordre. Idempotent. */
export function recordTransaction(transaction: Transaction): void {
  const existing = readStored();
  if (existing.some((t) => t.id === transaction.id)) return;

  const stored: StoredTransaction = {
    id: transaction.id,
    portfolioId: transaction.portfolioId,
    instrumentId: transaction.instrumentId,
    orderId: transaction.orderId,
    side: transaction.side,
    quantity: transaction.quantity.toFixed(8),
    priceAmount: transaction.price.amount.toFixed(8),
    priceCurrency: transaction.price.currency.toString(),
    executedAt: transaction.executedAt.toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([stored, ...existing]));
}

/** Transactions exécutées dans cette session, la plus récente en premier. */
export function listSessionTransactions(): Transaction[] {
  return readStored().map((t) => ({
    id: t.id,
    portfolioId: t.portfolioId,
    instrumentId: t.instrumentId,
    orderId: t.orderId,
    side: t.side,
    quantity: Decimal.fromString(t.quantity),
    price: Money.of(t.priceAmount, t.priceCurrency),
    executedAt: new Date(t.executedAt),
  }));
}
