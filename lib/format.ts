export function formatPeso(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a "YYYY-MM-DD" date string for display.
 *
 * Deliberately does NOT use `new Date(isoString)` directly — that parses the
 * string as UTC midnight, and converting back to local time can shift the
 * displayed date by a day depending on the viewer's timezone. Building the
 * Date from explicit local year/month/day parts avoids that round-trip.
 */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const localDate = new Date(year, month - 1, day);
  return localDate.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Today's date as "YYYY-MM-DD", in the browser's LOCAL calendar day.
 *
 * `new Date().toISOString()` converts to UTC first, which can report
 * "yesterday" for users in timezones ahead of UTC (like the Philippines,
 * UTC+8) during the first few hours after local midnight. This builds the
 * string from local date parts instead.
 */
export function getTodayLocalISO(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
