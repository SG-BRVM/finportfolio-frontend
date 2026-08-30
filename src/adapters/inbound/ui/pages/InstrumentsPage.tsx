import { PageContainer } from "../components/layout/PageContainer";
import { InstrumentForm } from "../components/instruments/InstrumentForm";
import { InstrumentsTable } from "../components/instruments/InstrumentsTable";
import { RefreshPricesButton } from "../components/instruments/RefreshPricesButton";
import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";
import { useInstruments } from "../hooks/useInstruments";
import { getErrorMessage } from "../utils/errorMessage";

export function InstrumentsPage() {
  const { data: instruments = [], isLoading, isError, error, refetch } = useInstruments();

  return (
    <PageContainer
      title="Instruments"
      description="Instruments financiers disponibles pour composer des portefeuilles."
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-1">
          <InstrumentForm />
          <RefreshPricesButton />
        </div>
        <div className="min-w-0 lg:col-span-2">
          {isLoading && <LoadingState />}
          {isError && <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />}
          {!isLoading && !isError && <InstrumentsTable instruments={instruments} />}
        </div>
      </div>
    </PageContainer>
  );
}
