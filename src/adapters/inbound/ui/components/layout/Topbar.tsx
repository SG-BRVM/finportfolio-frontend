import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, Lock, Settings, UserRound, Sun, Moon } from "lucide-react";
import { useBackendHealth } from "../../hooks/useHealth";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { getBreadcrumbTrail } from "./navigation";
import { ROUTES } from "../../../../../shared/constants/routes";
import { LanguageSwitcher } from "../common/LanguageSwitcher";
import { useTheme } from "../../../../../infrastructure/theme/ThemeContext";

interface TopbarProps {
  onOpenMobileNav: () => void;
}

/** Topbar - barre supérieure : navigation mobile, fil d'Ariane, statut discret, langue, notifications, compte. */
export function Topbar({ onOpenMobileNav }: TopbarProps) {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useBackendHealth();
  const isUp = !isLoading && !isError && data?.health.status === "ok";

  const location = useLocation();
  const trail = getBreadcrumbTrail(location.pathname);

  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-ink-100 bg-white px-4 dark:border-ink-800 dark:bg-ink-900 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onOpenMobileNav}
        aria-label={t("layout.openNavigation")}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 font-ledger text-sm font-bold text-white md:hidden">
        FP
      </div>

      <Breadcrumb className="hidden min-w-0 md:block">
        <BreadcrumbList>
          {trail.map((crumb, index) => (
            <span key={crumb.labelKey} className="flex items-center gap-1.5">
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {crumb.to ? (
                  <BreadcrumbLink asChild>
                    <Link to={crumb.to}>{t(crumb.labelKey)}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{t(crumb.labelKey)}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </span>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        {/* Statut discret : jamais de libellé technique visible par défaut, uniquement au survol. */}
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex h-9 w-9 items-center justify-center">
              <span
                className={`h-2 w-2 rounded-full ${
                  isLoading ? "bg-ink-300" : isUp ? "bg-emerald-500" : "bg-rose-500"
                }`}
              />
              <span className="sr-only">
                {isLoading
                  ? t("layout.status.checking")
                  : isUp
                    ? t("layout.status.up")
                    : t("layout.status.down")}
              </span>
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {isLoading
              ? t("layout.status.checkingInProgress")
              : isUp
                ? t("layout.status.upBullet")
                : t("layout.status.downDetail")}
          </TooltipContent>
        </Tooltip>

        <LanguageSwitcher />

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? t("layout.switchToLight") : t("layout.switchToDark")}
        >
          {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </Button>

        <div className="hidden h-6 w-px bg-ink-100 dark:bg-ink-800 sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <UserRound className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="normal-case text-xs font-normal text-ink-400">
              {t("layout.myAccount")}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={ROUTES.security}>
                <Lock className="h-4 w-4" />
                {t("nav.security")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={ROUTES.settings}>
                <Settings className="h-4 w-4" />
                {t("nav.settings")}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
