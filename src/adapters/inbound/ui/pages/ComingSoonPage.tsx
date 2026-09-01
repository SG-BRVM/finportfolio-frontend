import type { LucideIcon } from "lucide-react";
import { Construction } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { useTranslation } from "react-i18next";

interface ComingSoonPageProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

/**
 * ComingSoonPage - contenu temporaire pour les sections déjà présentes
 * dans la navigation métier (Sidebar/Topbar) mais dont la refonte
 * fonctionnelle arrive dans une phase ultérieure. Évite un lien de nav
 * mort ou une page blanche tant que la section correspondante n'est pas
 * construite - aucune donnée métier n'y est affichée.
 */
export function ComingSoonPage({ title, description, icon: Icon = Construction }: ComingSoonPageProps) {
  const { t } = useTranslation();
  return (
    <PageContainer title={title}>
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-ink-200 bg-white px-6 py-20 text-center">
        <Icon className="h-8 w-8 text-ink-300" />
        <p className="text-sm font-semibold text-ink-700">{t("comingSoon.underConstruction")}</p>
        <p className="max-w-sm text-sm text-ink-400">{description}</p>
      </div>
    </PageContainer>
  );
}
