import type { Transaction, TransactionType } from "@/types/transaction";

export interface TransactionFilters {
  type: "all" | TransactionType;
  category: string; // "all" or a specific Category
  month: string; // "all" or "YYYY-MM"
  search: string;
}

export const DEFAULT_FILTERS: TransactionFilters = {
  type: "all",
  category: "all",
  month: "all",
  search: "",
};

export function hasActiveFilters(filters: TransactionFilters): boolean {
  return (
    filters.type !== "all" ||
    filters.category !== "all" ||
    filters.month !== "all" ||
    filters.search.trim() !== ""
  );
}

export function filterTransactions(
  transactions: Transaction[],
  filters: TransactionFilters
): Transaction[] {
  const query = filters.search.trim().toLowerCase();

  return transactions.filter((t) => {
    if (filters.type !== "all" && t.type !== filters.type) return false;
    if (filters.category !== "all" && t.category !== filters.category)
      return false;
    if (filters.month !== "all" && !t.date.startsWith(filters.month))
      return false;
    if (query && !t.description.toLowerCase().includes(query)) return false;
    return true;
  });
}

export interface MonthOption {
  value: string; // "YYYY-MM"
  label: string; // "August 2026"
}

/** Builds the month dropdown options from whatever dates actually exist. */
export function getAvailableMonths(transactions: Transaction[]): MonthOption[] {
  const uniqueMonths = new Set(transactions.map((t) => t.date.slice(0, 7)));

  return Array.from(uniqueMonths)
    .sort()
    .reverse()
    .map((value) => ({
      value,
      label: new Date(`${value}-01`).toLocaleDateString("en-PH", {
        month: "long",
        year: "numeric",
      }),
    }));
}
