/**
 * environment.ts - point d'accès UNIQUE à `import.meta.env`.
 * Rien d'autre dans l'application ne doit lire `import.meta.env`
 * directement : ça permet de changer la source de config (env vars,
 * fichier JSON servi par le backend, etc.) sans toucher au reste du code.
 */
export interface Environment {
  appName: string;
  apiBaseUrl: string;
  appEnv: "development" | "production" | "test";
}

function readEnv(): Environment {
  const env = import.meta.env;
  const appEnv = (env.VITE_APP_ENV as Environment["appEnv"]) || "development";

  if (!env.VITE_API_BASE_URL && env.PROD) {
    // eslint-disable-next-line no-console
    console.error(
      "[environment] VITE_API_BASE_URL est vide en production : " +
        "vérifie le secret GitHub Actions correspondant. " +
        "Repli sur http://localhost:8000, qui ne fonctionnera pas depuis GitHub Pages."
    );
  }

  return {
    appName: env.VITE_APP_NAME || "FinPortfolio",
    apiBaseUrl: env.VITE_API_BASE_URL || "http://localhost:8000",
    appEnv,
  };
}

export const environment: Environment = readEnv();
