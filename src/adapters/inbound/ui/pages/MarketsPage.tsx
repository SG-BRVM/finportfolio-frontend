import { useMemo, useState } from "react";
import { Search, Landmark } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Input } from "../components/ui/input";
import { Skeleton } from "../components/ui/skeleton";
import { EmptyState } from "../components/common/EmptyState";
import { InstrumentTypeBadge } from "../components/common/InstrumentTypeBadge";
import { InstrumentVariationCell } from "../components/markets/InstrumentVariationCell";
import { useInstruments } from "../hooks/useInstruments";
import { useTranslation } from "react-i18next";

/**
 * MarketsPage - "Marchés". Aucune notion d'indice de marché (le backend
 * n'en a pas dans son Domain - voir app/domain côté finportfolio) ni de
 * volume échangé : ces deux éléments étaient mockés (mocks/markets.ts,
 * supprimé) et ont été retirés plutôt que remplacés, faute de source
 * réelle. La liste des instruments (uniquement ceux suivis, c'est-à-dire
 * existants dans notre référentiel - voir useInstruments) et leur
 * dernier cours sont réels ; la variation l'est désormais aussi,
 * calculée à partir de l'historique de prix de chaque instrument
 * (voir InstrumentVariationCell / GET /instruments/{id}/history).
 */
export function MarketsPage() {
  const { t } = useTranslation();
  const { data: instruments = [], isLoading } = useInstruments();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return instruments;
    return instruments.filter(
      (i) => i.symbol.toLowerCase().includes(query) || i.name.toLowerCase().includes(query),
    );
  }, [instruments, search]);

  return (
    <PageContainer title={t("nav.markets")} description={t("markets.pageDescription")}>
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>{t("markets.trackedMarkets")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("markets.searchPlaceholder")}
              className="pl-9"
            />
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Landmark}
              title={t("instruments.table.emptyTitle")}
              description={t("markets.noResultsDescription")}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("investments.instrument")}</TableHead>
                  <TableHead>{t("common.type")}</TableHead>
                  <TableHead className="text-right">{t("markets.lastPrice")}</TableHead>
                  <TableHead className="text-right">{t("markets.variation")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((instrument) => (
                  <TableRow key={instrument.id}>
                    <TableCell>
                      <div className="font-semibold text-ink-900 dark:text-ink-50">{instrument.symbol}</div>
                      <div className="text-xs text-ink-400 dark:text-ink-500">{instrument.name}</div>
                    </TableCell>
                    <TableCell>
                      <InstrumentTypeBadge type={instrument.instrumentType} />
                    </TableCell>
                    <TableCell className="text-right font-ledger">
                      {instrument.currentPrice.format()}
                    </TableCell>
                    <TableCell className="text-right">
                      <InstrumentVariationCell instrumentId={instrument.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
