/**
 * TelemetryPort - abstraction d'observabilité frontend.
 *
 * Le backend instrumente ses traces avec OpenTelemetry. Le frontend n'a
 * pas encore besoin de cette complexité, mais la couche UI ne doit
 * dépendre que de cette interface : demain, remplacer
 * `ConsoleTelemetryAdapter` par un `OpenTelemetryAdapter` (web-sdk) ne
 * changera aucune ligne dans les composants ou les hooks.
 */
export interface TelemetryPort {
  trackEvent(name: string, attributes?: Record<string, string | number | boolean>): void;
  trackError(error: unknown, context?: Record<string, string>): void;
  trackPerformance(name: string, durationMs: number): void;
}
