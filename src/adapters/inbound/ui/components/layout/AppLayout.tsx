import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileNav } from "./MobileNav";
import { Sheet, SheetContent } from "../ui/sheet";

/** AppLayout - coquille de l'application (sidebar + topbar fixes, contenu scrollable, nav mobile en Sheet). */
export function AppLayout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { i18n } = useTranslation();

  return (
    <div className="flex h-screen overflow-hidden bg-ink-50 dark:bg-ink-950">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMobileNav={() => setIsMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {/* key={i18n.language} : remonte les pages au changement de langue pour
              rafraîchir les dates/montants déjà formatés (Intl.* n'est pas réactif). */}
          <Outlet key={i18n.language} />
        </main>
      </div>

      <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
        <SheetContent side="left" className="w-72 max-w-[85vw] p-0">
          <MobileNav onNavigate={() => setIsMobileNavOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
