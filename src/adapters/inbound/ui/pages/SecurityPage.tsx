import { useState } from "react";
import { ShieldCheck, Clock, Monitor, LogOut } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import {
  useTwoFactorEnabled,
  useSetTwoFactorEnabled,
  useActiveSessions,
  useRevokeSession,
} from "../hooks/useSecurity";
import { LAST_LOGIN_HOURS_AGO } from "../../../../mocks/security";

/**
 * SecurityPage - "Sécurité". Aucun système d'authentification n'existe
 * côté backend (voir mocks/security.ts) : l'état de la double
 * authentification et les sessions actives viennent de
 * utils/securityStore.ts (démonstration, stockage local). Toute action
 * sensible (changer la double authentification, révoquer une session)
 * passe par une confirmation (voir ConfirmDialog / AlertDialog).
 */
export function SecurityPage() {
  const { data: twoFactorEnabled, isLoading: isTwoFactorLoading } = useTwoFactorEnabled();
  const setTwoFactor = useSetTwoFactorEnabled();
  const { data: sessions = [], isLoading: areSessionsLoading } = useActiveSessions();
  const revokeSession = useRevokeSession();

  const [confirmingTwoFactor, setConfirmingTwoFactor] = useState(false);
  const [revokingSessionId, setRevokingSessionId] = useState<string | null>(null);

  const handleConfirmTwoFactor = async () => {
    await setTwoFactor.mutateAsync(!twoFactorEnabled);
    setConfirmingTwoFactor(false);
  };

  const handleConfirmRevoke = async () => {
    if (!revokingSessionId) return;
    await revokeSession.mutateAsync(revokingSessionId);
    setRevokingSessionId(null);
  };

  const sessionToRevoke = sessions.find((s) => s.id === revokingSessionId);

  return (
    <PageContainer title="Sécurité" description="L'authentification, vos sessions et vos appareils.">
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-brand-600" />
                Authentification à deux facteurs
              </CardTitle>
              <CardDescription className="mt-1">
                Protège votre compte avec un second facteur à la connexion.
              </CardDescription>
            </div>
            {isTwoFactorLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="flex items-center gap-3">
                <Badge variant={twoFactorEnabled ? "success" : "neutral"}>
                  {twoFactorEnabled ? "Activée" : "Désactivée"}
                </Badge>
                <Switch
                  checked={twoFactorEnabled ?? false}
                  onCheckedChange={() => setConfirmingTwoFactor(true)}
                />
              </div>
            )}
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-ink-400" />
              Dernière connexion
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-ink-600">
              Il y a {LAST_LOGIN_HOURS_AGO} heure{LAST_LOGIN_HOURS_AGO > 1 ? "s" : ""}, depuis Chrome / Windows.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-ink-400" />
              Sessions actives
            </CardTitle>
            <CardDescription>Les appareils actuellement connectés à votre compte.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {areSessionsLoading ? (
              Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)
            ) : sessions.length === 0 ? (
              <p className="text-sm text-ink-400">Aucune session active.</p>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-lg border border-ink-100 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-ink-900">{session.device}</p>
                    <p className="text-xs text-ink-400">{session.location}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {session.current ? (
                      <Badge variant="success">Actif maintenant</Badge>
                    ) : (
                      <>
                        <span className="text-xs text-ink-400">
                          {session.minutesSinceActive < 60
                            ? `Il y a ${session.minutesSinceActive} min`
                            : `Il y a ${Math.round(session.minutesSinceActive / 60)} h`}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                          onClick={() => setRevokingSessionId(session.id)}
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          Déconnecter
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmingTwoFactor}
        title={twoFactorEnabled ? "Désactiver la double authentification ?" : "Activer la double authentification ?"}
        description={
          twoFactorEnabled
            ? "Votre compte sera moins protégé sans ce second facteur de connexion."
            : "Un second facteur vous sera demandé à chaque connexion."
        }
        confirmLabel={twoFactorEnabled ? "Désactiver" : "Activer"}
        destructive={Boolean(twoFactorEnabled)}
        pending={setTwoFactor.isPending}
        onConfirm={handleConfirmTwoFactor}
        onCancel={() => setConfirmingTwoFactor(false)}
      />

      <ConfirmDialog
        open={revokingSessionId !== null}
        title="Déconnecter cette session ?"
        description={
          sessionToRevoke
            ? `L'appareil "${sessionToRevoke.device}" sera déconnecté de votre compte.`
            : ""
        }
        confirmLabel="Déconnecter"
        destructive
        pending={revokeSession.isPending}
        onConfirm={handleConfirmRevoke}
        onCancel={() => setRevokingSessionId(null)}
      />
    </PageContainer>
  );
}
