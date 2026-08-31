"use client";

import { useMemo } from "react";
import { useTransactions } from "@/lib/transactions-context";
import { getCategorySpending } from "@/lib/spending-summary";

function formatPeso(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
}

// Cycling opacity steps of the expense color, so higher-spending categories
// read as visually "heavier" without needing a separate color per category.
const BAR_OPACITY_STEPS = ["bg-expense", "bg-expense/75", "bg-expense/55", "bg-expense/40"];

export default function SpendingSummary() {
  const { transactions } = useTransactions();
  const categorySpending = useMemo(
    () => getCategorySpending(transactions),
    [transactions]
  );

  return (
    <section className="mt-8">
      <h2 className="mb-3 font-display text-lg font-semibold text-ink">
        Spending by Category
      </h2>

      <div className="rounded-card bg-surface p-5 shadow-card">
        {categorySpending.length === 0 ? (
          <p className="py-4 text-center text-sm text-ink-faint">
            No expenses yet. Add one to see your spending breakdown.
          </p>
        ) : (
          <div className="space-y-4">
            {categorySpending.map((entry, index) => (
              <div key={entry.category}>
                <div className="mb-1 flex items-baseline justify-between">
                  <span className="text-sm font-medium text-ink">
                    {entry.category}
                  </span>
                  <span className="amount text-sm text-ink-soft">
                    {formatPeso(entry.amount)}{" "}
                    <span className="text-ink-faint">
                      ({Math.round(entry.percentage)}%)
                    </span>
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-paper">
                  <div
                    className={`h-full rounded-full ${
                      BAR_OPACITY_STEPS[index % BAR_OPACITY_STEPS.length]
                    }`}
                    style={{ width: `${entry.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
