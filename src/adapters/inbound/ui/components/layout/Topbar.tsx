import { Link, useLocation } from "react-router-dom";
import { Bell, Menu, Lock, Settings, UserRound } from "lucide-react";
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
import { useOrderAlerts, ORDER_ALERT_TITLE } from "../../hooks/useOrderAlerts";

interface TopbarProps {
  onOpenMobileNav: () => void;
}

/** Topbar - barre supérieure : navigation mobile, fil d'Ariane, statut discret, notifications, compte. */
export function Topbar({ onOpenMobileNav }: TopbarProps) {
  const { data, isLoading, isError } = useBackendHealth();
  const isUp = !isLoading && !isError && data?.health.status === "ok";

  const location = useLocation();
  const trail = getBreadcrumbTrail(location.pathname);

  const { alerts } = useOrderAlerts();
  const recentAlerts = alerts.slice(0, 5);

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-ink-100 bg-white px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onOpenMobileNav}
        aria-label="Ouvrir la navigation"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 font-ledger text-sm font-bold text-white md:hidden">
        FP
      </div>

      <Breadcrumb className="hidden min-w-0 md:block">
        <BreadcrumbList>
          {trail.map((crumb, index) => (
            <span key={crumb.label} className="flex items-center gap-1.5">
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {crumb.to ? (
                  <BreadcrumbLink asChild>
                    <Link to={crumb.to}>{crumb.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
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
                {isLoading ? "Vérification des services…" : isUp ? "Services opérationnels" : "Services indisponibles"}
              </span>
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {isLoading
              ? "Vérification en cours…"
              : isUp
                ? "● Services opérationnels"
                : "Certains services sont temporairement indisponibles."}
          </TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-[18px] w-[18px]" />
              {recentAlerts.length > 0 && (
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-brand-600" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {recentAlerts.length === 0 ? (
              <p className="px-2 py-3 text-sm text-ink-400">Aucune notification pour le moment.</p>
            ) : (
              recentAlerts.map(({ order, portfolioName, instrumentSymbol }) => (
                <DropdownMenuItem key={order.id} className="flex-col items-start gap-0.5">
                  <span className="text-sm font-medium text-ink-800">
                    {ORDER_ALERT_TITLE[order.status]}
                  </span>
                  <span className="text-xs text-ink-400">
                    {instrumentSymbol} · {portfolioName}
                  </span>
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={ROUTES.alerts} className="justify-center text-sm font-medium text-brand-700">
                Voir toutes les alertes
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="hidden h-6 w-px bg-ink-100 sm:block" />

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
              Mon compte
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={ROUTES.security}>
                <Lock className="h-4 w-4" />
                Sécurité
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={ROUTES.settings}>
                <Settings className="h-4 w-4" />
                Paramètres
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
