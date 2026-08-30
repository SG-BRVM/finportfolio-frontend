// TEMPORARY MOCK DATA
// Il n'existe pas encore d'endpoint d'authentification / profil côté API.
// Remplacer par le use case + le port applicatifs adéquats
// (ex. GetCurrentInvestorUseCase) lorsque l'API exposera cette donnée.
// Isolé ici (src/mocks/) pour ne jamais fuiter dans les composants UI
// bruts : seul le Topbar (et plus tard le Dashboard) le consomme.

export interface CurrentUser {
  name: string;
  email: string;
  initials: string;
}

export const CURRENT_USER: CurrentUser = {
  name: "Adama Diallo",
  email: "adama.diallo@example.com",
  initials: "AD",
};
