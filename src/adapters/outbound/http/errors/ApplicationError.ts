/**
 * ApplicationError - erreur normalisée exposée par la couche Adapters
 * à l'Application/UI. Toute erreur HTTP (400/404/409/500/réseau) est
 * traduite ici en un message utilisateur clair ; jamais de détails
 * techniques bruts (stack trace, URL, code interne) affichés tels quels.
 */
export type ApplicationErrorKind =
  | "NOT_FOUND"
  | "BAD_REQUEST"
  | "CONFLICT"
  | "SERVER_ERROR"
  | "NETWORK_ERROR"
  | "UNKNOWN";

export class ApplicationError extends Error {
  constructor(
    message: string,
    public readonly kind: ApplicationErrorKind,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = "ApplicationError";
  }
}
