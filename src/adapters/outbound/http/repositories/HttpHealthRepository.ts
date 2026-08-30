import type { HealthRepository, HealthStatus, DemoResult } from "../../../../application/ports/HealthRepository";
import type { HttpClient } from "../axios/HttpClient";

interface DemoApiResponse {
  message: string;
}

export class HttpHealthRepository implements HealthRepository {
  constructor(private readonly http: HttpClient) {}

  async checkHealth(): Promise<HealthStatus> {
    return this.http.get<HealthStatus>("/health");
  }

  async checkReady(): Promise<HealthStatus> {
    return this.http.get<HealthStatus>("/ready");
  }

  async callFastEndpoint(): Promise<DemoResult> {
    return this.timed(() => this.http.get<DemoApiResponse>("/api/v1/demo/fast"));
  }

  async callSlowEndpoint(): Promise<DemoResult> {
    return this.timed(() => this.http.get<DemoApiResponse>("/api/v1/demo/slow"));
  }

  private async timed(fn: () => Promise<DemoApiResponse>): Promise<DemoResult> {
    const start = performance.now();
    const response = await fn();
    const durationMs = performance.now() - start;
    return { message: response.message, durationMs };
  }
}
