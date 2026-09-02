import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "neutral" | "positive" | "negative";
}

const TONE_STYLES: Record<NonNullable<MetricCardProps["tone"]>, string> = {
  neutral: "text-ink-900 dark:text-ink-50",
  positive: "text-emerald-600",
  negative: "text-rose-600",
};

/** MetricCard - indicateur clé du dashboard (nombre, valorisation, P&L…). */
export function MetricCard({ label, value, icon: Icon, tone = "neutral" }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-400 dark:text-ink-500">{label}</span>
        <Icon className="h-4 w-4 text-ink-300 dark:text-ink-600" />
      </div>
      <p className={`font-ledger text-2xl font-semibold ${TONE_STYLES[tone]}`}>{value}</p>
    </div>
  );
}
