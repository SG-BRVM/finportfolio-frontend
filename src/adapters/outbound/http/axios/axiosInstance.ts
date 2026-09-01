import axios, { type AxiosInstance } from "axios";
import { environment } from "../../../../infrastructure/config/environment";
import i18n from "../../../../infrastructure/i18n/i18n";

/**
 * axiosInstance - instance Axios centralisée. C'est le SEUL endroit de
 * l'application qui configure directement Axios (base URL, timeout,
 * headers, intercepteurs). Toute la logique métier passe par les
 * Http*Repository, jamais par cette instance directement.
 */
export function createAxiosInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL: environment.apiBaseUrl,
    timeout: 10_000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Propage la langue active de l'UI au backend, qui l'utilise pour
  // localiser les messages d'erreur (voir exception_handlers.py côté API).
  instance.interceptors.request.use((config) => {
    config.headers["Accept-Language"] = i18n.language ?? "fr";
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );

  return instance;
}

export const axiosInstance = createAxiosInstance();
