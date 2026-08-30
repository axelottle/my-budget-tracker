export type TransactionType = "income" | "expense";

export type ExpenseCategory =
  | "Food"
  | "Transportation"
  | "Bills"
  | "Shopping"
  | "Entertainment"
  | "Health"
  | "Education"
  | "Other";

export type IncomeCategory = "Salary" | "Freelance" | "Business" | "Other";

// A transaction's category depends on its type, but for simplicity in this
// version we store category as a plain string constrained to either list.
// (Keeping this as a union of the two, rather than a single wide string,
// still gives autocomplete + a compile error on a typo'd category name.)
export type Category = ExpenseCategory | IncomeCategory;

export interface Transaction {
  id: string;
  description: string;
  amount: number; // always stored as a positive number; `type` carries the sign
  category: Category;
  type: TransactionType;
  date: string; // ISO date string, e.g. "2026-08-30"
}

// Fields a form collects before an id has been assigned.
export type NewTransaction = Omit<Transaction, "id">;

export interface Budget {
  monthlyLimit: number;
}
