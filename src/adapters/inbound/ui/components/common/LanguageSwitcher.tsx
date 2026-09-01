import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "../../../../../shared/utils/cn";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "../../../../../infrastructure/i18n/i18n";

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  fr: "Français",
  en: "English",
};

/** LanguageSwitcher - bascule FR/EN de la plateforme, placée dans la Topbar à côté du compte utilisateur. */
export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const currentLanguage = (i18n.language?.slice(0, 2) as SupportedLanguage) || "fr";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("layout.changeLanguage")}
          title={t("layout.changeLanguage")}
        >
          <Languages className="h-[18px] w-[18px]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onSelect={() => i18n.changeLanguage(lang)}
            className={cn(currentLanguage === lang && "font-semibold text-brand-700")}
          >
            {LANGUAGE_LABELS[lang]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
