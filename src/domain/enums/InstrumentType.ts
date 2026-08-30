/**
 * Type d'instrument financier détenu dans un portefeuille.
 * Miroir exact de l'enum backend `InstrumentType` (STOCK/BOND/ETF/FUND).
 */
export type InstrumentType = "STOCK" | "BOND" | "ETF" | "FUND";

export const INSTRUMENT_TYPES: InstrumentType[] = ["STOCK", "BOND", "ETF", "FUND"];

export function isInstrumentType(value: string): value is InstrumentType {
  return (INSTRUMENT_TYPES as string[]).includes(value);
}
