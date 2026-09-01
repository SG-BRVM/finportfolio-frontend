import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { PerformancePoint, PerformancePeriod } from "../../../../../domain/entities/PerformanceHistory";
import { PERFORMANCE_PERIODS } from "../../../../../domain/entities/PerformanceHistory";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Skeleton } from "../ui/skeleton";
import { useTranslation } from "react-i18next";
import { getIntlLocale } from "../../../../../infrastructure/i18n/i18n";

interface PerformanceChartProps {
  points: PerformancePoint[];
  currency: string;
  period: PerformancePeriod;
  onPeriodChange: (period: PerformancePeriod) => void;
  isLoading?: boolean;
}

function formatCompactAmount(value: number, currency: string): string {
  return new Intl.NumberFormat(getIntlLocale(), {
    notation: "compact",
    maximumFractionDigits: 1,
    style: "currency",
    currency,
    currencyDisplay: "code",
  })
    .format(value)
    .replace(/\u202f/g, " ");
}

function formatFullAmount(value: number, currency: string): string {
  return new Intl.NumberFormat(getIntlLocale(), {
    maximumFractionDigits: 0,
    style: "currency",
    currency,
    currencyDisplay: "code",
  })
    .format(value)
    .replace(/\u202f/g, " ");
}

function formatAxisDate(date: Date): string {
  return new Intl.DateTimeFormat(getIntlLocale(), { day: "2-digit", month: "short" }).format(date);
}

/**
 * PerformanceChart - courbe d'évolution du patrimoine (Recharts), avec
 * sélecteur de période. La série provient de la valorisation réelle,
 * reconstituée côté backend à partir des transactions exécutées et de
 * l'historique de prix des instruments (voir usePerformanceHistory /
 * GET /portfolios/{id}/valuation-history) - aucune donnée simulée.
 */
export function PerformanceChart({
  points,
  currency,
  period,
  onPeriodChange,
  isLoading,
}: PerformanceChartProps) {
  const { t } = useTranslation();
  const periodLabels: Record<PerformancePeriod, string> = {
    "1M": t("performance.period.1M"),
    "3M": t("performance.period.3M"),
    "6M": t("performance.period.6M"),
    "1A": t("performance.period.1Y"),
    "3A": t("performance.period.3Y"),
    MAX: t("performance.period.origin"),
  };
  return (
    <div>
      <div className="mb-4 flex justify-end">
        <ToggleGroup
          type="single"
          value={period}
          onValueChange={(value) => value && onPeriodChange(value as PerformancePeriod)}
          className="w-auto"
        >
          {PERFORMANCE_PERIODS.map((p) => (
            <ToggleGroupItem key={p.value} value={p.value} className="px-3 py-1 text-xs">
              {periodLabels[p.value]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {isLoading ? (
        <Skeleton className="h-72 w-full" />
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3765f0" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#3765f0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickFormatter={(v: Date) => formatAxisDate(v)}
                tick={{ fontSize: 11, fill: "#8591a8" }}
                axisLine={{ stroke: "#eceef2" }}
                tickLine={false}
                minTickGap={40}
              />
              <YAxis
                tickFormatter={(v: number) => formatCompactAmount(v, currency)}
                tick={{ fontSize: 11, fill: "#8591a8" }}
                axisLine={false}
                tickLine={false}
                width={72}
                domain={["auto", "auto"]}
              />
              <Tooltip
                formatter={(value: number) => [formatFullAmount(value, currency), t("performance.value")]}
                labelFormatter={(label: Date) =>
                  new Intl.DateTimeFormat(getIntlLocale(), { day: "2-digit", month: "long", year: "numeric" }).format(label)
                }
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #eceef2",
                  fontSize: 13,
                  boxShadow: "0 4px 16px rgba(20, 27, 51, 0.08)",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#2547e4"
                strokeWidth={2}
                fill="url(#performanceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
