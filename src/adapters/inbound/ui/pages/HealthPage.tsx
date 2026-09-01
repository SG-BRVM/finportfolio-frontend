import { PageContainer } from "../components/layout/PageContainer";
import { useBackendHealth, useRunFastDemo, useRunSlowDemo } from "../hooks/useHealth";
import { CheckCircle2, XCircle, Zap, Hourglass } from "lucide-react";
import { useTranslation } from "react-i18next";

/** HealthPage - page pédagogique pour tester l'état du backend et comparer 2 endpoints démo. */
export function HealthPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useBackendHealth();
  const fastDemo = useRunFastDemo();
  const slowDemo = useRunSlowDemo();

  return (
    <PageContainer
      title="Health"
      description={t("health.pageDescription")}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatusCard
          label={t("health.apiStatus")}
          ok={!isLoading && !isError && data?.health.status === "ok"}
          loading={isLoading}
        />
        <StatusCard
          label={t("health.readyStatus")}
          ok={!isLoading && !isError && data?.ready.status === "ready"}
          loading={isLoading}
        />
      </div>

      <button
        onClick={() => refetch()}
        className="mt-4 rounded-lg border border-ink-200 px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-ink-50"
      >
        {t("health.refresh")}
      </button>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-ink-100 bg-white p-5">
          <div className="mb-3 flex items-center gap-2 text-ink-700">
            <Zap className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-semibold">{t("health.fastEndpoint")}</span>
          </div>
          <button
            onClick={() => fastDemo.mutate()}
            disabled={fastDemo.isPending}
            className="mb-3 rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {fastDemo.isPending ? t("health.calling") : t("health.callFast")}
          </button>
          {fastDemo.data && (
            <p className="font-ledger text-xs text-ink-500">
              {fastDemo.data.message} - {fastDemo.data.durationMs.toFixed(0)} ms
            </p>
          )}
        </div>

        <div className="rounded-xl border border-ink-100 bg-white p-5">
          <div className="mb-3 flex items-center gap-2 text-ink-700">
            <Hourglass className="h-4 w-4 text-brand-500" />
            <span className="text-sm font-semibold">{t("health.slowEndpoint")}</span>
          </div>
          <button
            onClick={() => slowDemo.mutate()}
            disabled={slowDemo.isPending}
            className="mb-3 rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {slowDemo.isPending ? t("health.calling") : t("health.callSlow")}
          </button>
          {slowDemo.data && (
            <p className="font-ledger text-xs text-ink-500">
              {slowDemo.data.message} - {slowDemo.data.durationMs.toFixed(0)} ms
            </p>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

function StatusCard({ label, ok, loading }: { label: string; ok: boolean; loading: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-5">
      {loading ? (
        <div className="h-5 w-5 animate-pulse rounded-full bg-ink-200" />
      ) : ok ? (
        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
      ) : (
        <XCircle className="h-5 w-5 text-rose-500" />
      )}
      <span className="text-sm font-medium text-ink-700">{label}</span>
    </div>
  );
}
