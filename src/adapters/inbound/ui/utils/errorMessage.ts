import { ApplicationError } from "../../../outbound/http/errors/ApplicationError";
import i18n from "../../../../infrastructure/i18n/i18n";

/** Extrait un message affichable depuis n'importe quelle erreur remontée par un Use Case.
 * Les messages provenant du backend (ApplicationError) sont déjà localisés
 * côté serveur via l'en-tête Accept-Language (voir axiosInstance). */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApplicationError) return error.message;
  if (error instanceof Error) return error.message;
  return i18n.t("common.unexpectedError");
}
