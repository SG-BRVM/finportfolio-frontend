import type { TelemetryPort } from "./TelemetryPort";

/**
 * ConsoleTelemetryAdapter - implémentation minimale de TelemetryPort
 * qui journalise dans la console. Sert de socle en attendant un futur
 * OpenTelemetryAdapter (voir README, section observabilité).
 */
export class ConsoleTelemetryAdapter implements TelemetryPort {
  trackEvent(name: string, attributes?: Record<string, string | number | boolean>): void {
    console.info(`[telemetry] event: ${name}`, attributes ?? {});
  }

  trackError(error: unknown, context?: Record<string, string>): void {
    console.error(`[telemetry] error`, error, context ?? {});
  }

  trackPerformance(name: string, durationMs: number): void {
    console.info(`[telemetry] performance: ${name} took ${durationMs.toFixed(1)}ms`);
  }
}
