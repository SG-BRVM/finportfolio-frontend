import { type AxiosInstance, isAxiosError } from "axios";
import { ApplicationError } from "../errors/ApplicationError";

/**
 * HttpClient - adapter HTTP générique au-dessus d'Axios.
 *
 * C'est la SEULE classe qui connaît Axios directement dans toute
 * l'application. Les Http*Repository dépendent de `HttpClient`, pas
 * d'Axios : remplacer Axios par `fetch` demain ne consiste qu'à réécrire
 * cette classe avec la même interface publique (get/post).
 *
 * Traduit systématiquement les erreurs de transport (HTTP + réseau) en
 * `ApplicationError`, avec un message utilisateur clair et sans détail
 * technique inutile - voir le backend `exception_handlers.py` pour le
 * mapping domaine -> code HTTP (`{ detail: string }`, 400/404/409).
 */
export class HttpClient {
  constructor(private readonly axios: AxiosInstance) {}

  async get<T>(url: string): Promise<T> {
    try {
      const response = await this.axios.get<T>(url);
      return response.data;
    } catch (error) {
      throw HttpClient.toApplicationError(error);
    }
  }

  async post<T>(url: string, body?: unknown): Promise<T> {
    try {
      const response = await this.axios.post<T>(url, body ?? {});
      return response.data;
    } catch (error) {
      throw HttpClient.toApplicationError(error);
    }
  }

  /** POST multipart/form-data (upload de fichier) - le boundary est géré
   * par Axios/le navigateur, ne jamais fixer le Content-Type à la main. */
  async postForm<T>(url: string, formData: FormData): Promise<T> {
    try {
      const response = await this.axios.post<T>(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      throw HttpClient.toApplicationError(error);
    }
  }

  /** GET dont la réponse est le contenu binaire brut d'un fichier. */
  async getBlob(url: string): Promise<Blob> {
    try {
      const response = await this.axios.get<Blob>(url, { responseType: "blob" });
      return response.data;
    } catch (error) {
      throw HttpClient.toApplicationError(error);
    }
  }

  async patch<T>(url: string, body?: unknown): Promise<T> {
    try {
      const response = await this.axios.patch<T>(url, body ?? {});
      return response.data;
    } catch (error) {
      throw HttpClient.toApplicationError(error);
    }
  }

  private static toApplicationError(error: unknown): ApplicationError {
    if (isAxiosError(error)) {
      if (!error.response) {
        return new ApplicationError(
          "Impossible de contacter le serveur. Vérifiez votre connexion.",
          "NETWORK_ERROR"
        );
      }

      const status = error.response.status;
      const detail =
        (error.response.data as { detail?: string } | undefined)?.detail ?? undefined;

      switch (status) {
        case 400:
          return new ApplicationError(
            detail ?? "La requête envoyée est invalide.",
            "BAD_REQUEST",
            status
          );
        case 404:
          return new ApplicationError(
            detail ?? "La ressource demandée est introuvable.",
            "NOT_FOUND",
            status
          );
        case 409:
          return new ApplicationError(
            detail ?? "Cette opération entre en conflit avec l'état actuel des données.",
            "CONFLICT",
            status
          );
        default:
          return new ApplicationError(
            detail ?? "Une erreur inattendue est survenue côté serveur.",
            "SERVER_ERROR",
            status
          );
      }
    }

    return new ApplicationError("Une erreur inattendue est survenue.", "UNKNOWN");
  }
}
