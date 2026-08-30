import DashboardCard from "@/components/DashboardCard";

// Phase 2: layout only — these numbers are placeholders.
// Phase 3+ replaces them with real transaction state.
const placeholderData = {
  totalBalance: 25500,
  income: 35000,
  expenses: 9500,
  monthlyBudget: 30000,
  remainingBudget: 20500,
};

export default function Home() {
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
            amount={placeholderData.totalBalance}
            tone="default"
          />
          <DashboardCard
            label="Income"
            amount={placeholderData.income}
            tone="income"
          />
          <DashboardCard
            label="Expenses"
            amount={placeholderData.expenses}
            tone="expense"
          />
          <DashboardCard
            label="Monthly Budget"
            amount={placeholderData.monthlyBudget}
            tone="budget"
            helper={`₱${placeholderData.remainingBudget.toLocaleString(
              "en-PH"
            )} remaining`}
          />
        </div>
      </main>
    </div>
  );
}
