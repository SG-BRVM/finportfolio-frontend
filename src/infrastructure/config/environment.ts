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
  return {
    appName: env.VITE_APP_NAME ?? "FinPortfolio",
    apiBaseUrl: env.VITE_API_BASE_URL ?? "http://localhost:8000",
    appEnv: (env.VITE_APP_ENV as Environment["appEnv"]) ?? "development",
  };
}

export const environment: Environment = readEnv();
