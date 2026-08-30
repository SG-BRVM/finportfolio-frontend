/**
 * HealthRepository - Port pour la page pédagogique Health. Suit la même
 * règle de dépendance que les autres Ports : l'Application ne connaît
 * pas Axios, seulement cette interface.
 */
export interface HealthStatus {
  status: string;
}

export interface DemoResult {
  message: string;
  durationMs: number;
}

export interface HealthRepository {
  checkHealth(): Promise<HealthStatus>;
  checkReady(): Promise<HealthStatus>;
  callFastEndpoint(): Promise<DemoResult>;
  callSlowEndpoint(): Promise<DemoResult>;
}
