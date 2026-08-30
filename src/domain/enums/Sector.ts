/**
 * Secteur d'activité de l'émetteur d'un instrument financier.
 * Miroir exact de l'enum backend `Sector`. Optionnel : les instruments
 * créés avant l'existence de ce champ, ou dont le secteur est simplement
 * inconnu, valent `null`.
 */
export type Sector =
  | "FINANCE"
  | "TELECOMMUNICATIONS"
  | "INDUSTRY"
  | "ENERGY"
  | "CONSUMER"
  | "OTHER";

export const SECTORS: Sector[] = [
  "FINANCE",
  "TELECOMMUNICATIONS",
  "INDUSTRY",
  "ENERGY",
  "CONSUMER",
  "OTHER",
];

export const SECTOR_LABELS: Record<Sector, string> = {
  FINANCE: "Finance",
  TELECOMMUNICATIONS: "Télécommunications",
  INDUSTRY: "Industrie",
  ENERGY: "Énergie",
  CONSUMER: "Consommation",
  OTHER: "Autres",
};

export function isSector(value: string): value is Sector {
  return (SECTORS as string[]).includes(value);
}
