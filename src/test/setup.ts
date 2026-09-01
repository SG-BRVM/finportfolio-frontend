import "@testing-library/jest-dom/vitest";
import i18n from "../infrastructure/i18n/i18n";

// Langue déterministe en test, indépendamment de la détection navigateur/jsdom.
void i18n.changeLanguage("fr");
