// TEMPORARY MOCK DATA
// Le backend n'expose ni indices de marché (BRVM Composite / BRVM 30 -
// aucune notion d'indice dans le Domain, voir app/domain côté
// finportfolio), ni volume échangé sur un instrument. La variation de
// cours pourrait en théorie être dérivée de `GET
// /instruments/{id}/history`, mais cet endpoint est par instrument
// (un appel par ligne du tableau) : pour la liste "Marchés suivis", on
// mock donc aussi la variation/tendance plutôt que déclencher un N+1.
// Remplacer par de vrais indices + un endpoint de variation/volume
// lorsqu'ils existeront côté API. Isolé ici (src/mocks/) : seule la page
// "Marchés" le consomme.

export interface MarketIndex {
  id: string;
  name: string;
  value: number;
  changePercent: number;
}

export const MARKET_INDICES: MarketIndex[] = [
  { id: "brvm-composite", name: "BRVM Composite", value: 227.84, changePercent: 1.32 },
  { id: "brvm-30", name: "BRVM 30", value: 132.51, changePercent: -0.42 },
];

export interface InstrumentMarketStats {
  changePercent: number;
  volume: number;
}

/**
 * Dérive une variation de cours et un volume déterministes à partir de
 * l'id de l'instrument, pour que le tableau des marchés reste stable
 * d'un rendu à l'autre en attendant les vraies données de marché.
 */
export function getInstrumentMarketStats(instrumentId: string): InstrumentMarketStats {
  let hash = 0;
  for (let i = 0; i < instrumentId.length; i += 1) {
    hash = (hash * 31 + instrumentId.charCodeAt(i)) % 10000;
  }
  const changePercent = ((hash % 800) - 400) / 100; // -4.00 .. +4.00
  const volume = 500 + (hash % 15) * 1500; // 500 .. ~21 500

  return { changePercent, volume };
}
