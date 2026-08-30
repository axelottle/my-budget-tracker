export const STORAGE_KEYS = {
  transactions: "budget-tracker:transactions",
  budget: "budget-tracker:budget",
} as const;

/**
 * Reads and parses a value from localStorage. Returns `fallback` if the key
 * is missing, if localStorage isn't available (server-side render), or if
 * the stored value is malformed JSON.
 */
export function readFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Writes a value to localStorage as JSON. Silently no-ops on the server or
 * if storage is unavailable (e.g. private browsing quota errors).
 */
export function writeToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or disabled — fail silently rather than crash the app.
  }
}
