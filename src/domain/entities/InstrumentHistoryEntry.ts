/** InstrumentHistoryEntry - une ligne de l'historique de modification
 * d'un instrument (création, rafraîchissement de cours, correction de
 * valeur nominale). Immuable côté backend, en lecture seule ici. */
export interface InstrumentHistoryEntry {
  readonly id: string;
  readonly field: "created" | "current_price" | "nominal_value";
  readonly oldValue: string | null;
  readonly newValue: string | null;
  readonly changedAt: Date;
  readonly source: "creation" | "manual_correction" | "market_refresh";
}
