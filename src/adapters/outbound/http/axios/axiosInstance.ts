import axios, { type AxiosInstance } from "axios";
import { environment } from "../../../../infrastructure/config/environment";

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

  instance.interceptors.request.use((config) => config);

  instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );

  return instance;
}

export const axiosInstance = createAxiosInstance();
