"use client";

import { useTransactions } from "@/lib/transactions-context";

export default function DemoDataControls() {
  const { transactions, loadDemoData, clearTransactions } = useTransactions();

  function handleLoadDemoData() {
    if (transactions.length > 0) {
      const confirmed = window.confirm(
        "This will replace your current transactions with demo data. Continue?"
      );
      if (!confirmed) return;
    }
    loadDemoData();
  }

  function handleClearData() {
    const confirmed = window.confirm(
      "This will delete all transactions. This can't be undone. Continue?"
    );
    if (confirmed) clearTransactions();
  }

  return (
    <div className="flex items-center gap-4 text-sm">
      <button
        onClick={handleLoadDemoData}
        className="font-medium text-ink-soft hover:text-ink"
      >
        Load Demo Data
      </button>
      {transactions.length > 0 && (
        <button
          onClick={handleClearData}
          className="font-medium text-expense hover:text-expense/80"
        >
          Clear All Data
        </button>
      )}
    </div>
  );
}
