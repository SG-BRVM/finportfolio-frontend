import { useTranslation } from "react-i18next";
import type { Sector } from "../../../../../domain/enums/Sector";

/** useSectorLabels - libellés de secteur traduits, réutilisés partout où SECTOR_LABELS l'était (formulaire instrument, exposition sectorielle, risque, conseils). */
export function useSectorLabels(): Record<Sector, string> {
  const { t } = useTranslation();
  return {
    FINANCE: t("enums.sector.finance"),
    TELECOMMUNICATIONS: t("enums.sector.telecommunications"),
    INDUSTRY: t("enums.sector.industry"),
    ENERGY: t("enums.sector.energy"),
    CONSUMER: t("enums.sector.consumer"),
    OTHER: t("enums.sector.other"),
  };
}
