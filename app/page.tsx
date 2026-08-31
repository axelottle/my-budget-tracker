"use client";

import DashboardCard from "@/components/DashboardCard";
import BudgetProgress from "@/components/BudgetProgress";
import TransactionList from "@/components/TransactionList";
import { useTransactions } from "@/lib/transactions-context";

export default function Home() {
  const { totalBalance, totalIncome, totalExpenses, budget, remainingBudget } =
    useTransactions();

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <h1 className="font-display text-xl font-semibold text-ink">
            Budget Tracker
          </h1>
          <span className="font-body text-sm text-ink-faint">
            {new Date().toLocaleDateString("en-PH", {
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">
          Overview
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            label="Total Balance"
            amount={totalBalance}
            tone="default"
          />
          <DashboardCard label="Income" amount={totalIncome} tone="income" />
          <DashboardCard
            label="Expenses"
            amount={totalExpenses}
            tone="expense"
          />
          <DashboardCard
            label="Monthly Budget"
            amount={budget.monthlyLimit}
            tone="budget"
            helper={`₱${remainingBudget.toLocaleString("en-PH")} remaining`}
          />
        </div>

        <BudgetProgress />
        <TransactionList />
      </main>
    </div>
  );
}
