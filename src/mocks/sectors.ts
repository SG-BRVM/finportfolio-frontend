// TEMPORARY MOCK DATA
// Il n'existe pas encore de notion de secteur d'activité sur
// FinancialInstrument côté API (voir app/domain/entities côté
// finportfolio : un instrument n'a qu'un symbole, un type, une devise et
// un prix - pas de secteur). Remplacer par le champ backend adéquat
// (ex. FinancialInstrument.sector) lorsqu'il existera.
// Isolé ici (src/mocks/) pour ne jamais fuiter dans les composants UI
// bruts : seule la page Allocation le consomme, pour l'exposition
// sectorielle uniquement (la répartition par classe d'actifs, elle, est
// calculée à partir des vraies positions/instruments).

export type Sector =
  | "Finance"
  | "Télécommunications"
  | "Industrie"
  | "Énergie"
  | "Consommation"
  | "Autres";

const SECTORS: Sector[] = [
  "Finance",
  "Télécommunications",
  "Industrie",
  "Énergie",
  "Consommation",
  "Autres",
];

/**
 * Assigne un secteur de façon déterministe à partir de l'identifiant de
 * l'instrument, pour que l'exposition sectorielle reste stable d'un
 * rendu à l'autre en attendant le vrai champ backend.
 */
export function getInstrumentSector(instrumentId: string): Sector {
  let hash = 0;
  for (let i = 0; i < instrumentId.length; i += 1) {
    hash = (hash * 31 + instrumentId.charCodeAt(i)) % 1000;
  }
  return SECTORS[hash % SECTORS.length];
}
