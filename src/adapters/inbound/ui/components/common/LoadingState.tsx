import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface LoadingStateProps {
  label?: string;
}

/** LoadingState - indicateur de chargement réutilisable pour toute requête en cours. */
export function LoadingState({ label }: LoadingStateProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-500">
      <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
      <p className="text-sm">{label ?? t("common.loadingInProgress")}</p>
    </div>
  );
}
