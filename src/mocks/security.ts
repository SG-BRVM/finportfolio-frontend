// TEMPORARY MOCK DATA
// Il n'existe aucune notion de session, d'appareil ni d'authentification
// à deux facteurs côté API (l'entité Investor n'a qu'un nom et un email -
// voir app/domain/entities côté finportfolio, aucun système
// d'authentification n'existe encore). Remplacer par le use case + le
// port applicatifs adéquats (ex. GetActiveSessionsUseCase,
// SetTwoFactorEnabledUseCase) lorsque l'API exposera cette donnée.
// Isolé ici (src/mocks/) pour la définition/le jeu de démonstration ; la
// persistance des préférences modifiées par l'utilisateur (activation de
// la double authentification, révocation d'une session) vit dans
// utils/securityStore.ts.

export interface SecuritySession {
  id: string;
  device: string;
  location: string;
  /** Minutes écoulées depuis la dernière activité (session courante = 0). */
  minutesSinceActive: number;
  current: boolean;
}

export const DEFAULT_TWO_FACTOR_ENABLED = true;

/** Heures écoulées depuis la dernière connexion. */
export const LAST_LOGIN_HOURS_AGO = 3;

export const DEFAULT_SESSIONS: SecuritySession[] = [
  {
    id: "session-current",
    device: "Chrome / Windows",
    location: "Abidjan, Côte d'Ivoire",
    minutesSinceActive: 0,
    current: true,
  },
  {
    id: "session-2",
    device: "Safari / iPhone",
    location: "Abidjan, Côte d'Ivoire",
    minutesSinceActive: 190,
    current: false,
  },
  {
    id: "session-3",
    device: "Chrome / macOS",
    location: "Dakar, Sénégal",
    minutesSinceActive: 2880,
    current: false,
  },
];
