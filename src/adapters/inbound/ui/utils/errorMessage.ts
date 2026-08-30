import { ApplicationError } from "../../../outbound/http/errors/ApplicationError";

/** Extrait un message affichable depuis n'importe quelle erreur remontée par un Use Case. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApplicationError) return error.message;
  if (error instanceof Error) return error.message;
  return "Une erreur inattendue est survenue.";
}
