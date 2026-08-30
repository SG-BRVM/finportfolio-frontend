/**
 * DomainError - erreur métier générique du domaine frontend.
 * Sert de socle commun ; les erreurs applicatives (HTTP, réseau) sont
 * mappées vers ces types dans la couche Adapters, jamais l'inverse.
 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}

export class CurrencyMismatchError extends DomainError {
  constructor(expected: string, actual: string) {
    super(`Devises incompatibles : attendu "${expected}", reçu "${actual}".`);
    this.name = "CurrencyMismatchError";
  }
}
