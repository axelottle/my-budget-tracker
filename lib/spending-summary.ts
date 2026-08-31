import type { Transaction } from "@/types/transaction";

export interface CategorySpending {
  category: string;
  amount: number;
  percentage: number; // share of total expenses, 0-100
}

export function getCategorySpending(
  transactions: Transaction[]
): CategorySpending[] {
  const expenses = transactions.filter((t) => t.type === "expense");
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

  const totalsByCategory = new Map<string, number>();
  for (const t of expenses) {
    totalsByCategory.set(
      t.category,
      (totalsByCategory.get(t.category) ?? 0) + t.amount
    );
  }

  return Array.from(totalsByCategory.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}
