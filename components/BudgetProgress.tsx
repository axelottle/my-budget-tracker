"use client";

import { useState } from "react";
import { useTransactions } from "@/lib/transactions-context";
import { formatPeso } from "@/lib/format";

export default function BudgetProgress() {
  const { budget, totalExpenses, remainingBudget, setBudget } =
    useTransactions();

  const [isEditing, setIsEditing] = useState(false);
  const [draftLimit, setDraftLimit] = useState(String(budget.monthlyLimit));
  const [error, setError] = useState("");

  const hasBudget = budget.monthlyLimit > 0;
  const isOverBudget = hasBudget && totalExpenses > budget.monthlyLimit;

  // Real percentage for the label (can exceed 100), separately clamped for
  // the bar's width (a bar wider than the track would just look broken).
  const rawPercentage = hasBudget
    ? (totalExpenses / budget.monthlyLimit) * 100
    : 0;
  const displayPercentage = Math.round(rawPercentage);
  const barWidth = Math.min(rawPercentage, 100);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const parsed = Number(draftLimit);

    if (!draftLimit || Number.isNaN(parsed) || parsed <= 0) {
      setError("Budget must be greater than zero.");
      return;
    }

    setBudget({ monthlyLimit: parsed });
    setError("");
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <section className="mt-8 rounded-card bg-surface p-4 shadow-card sm:p-5">
        <h2 className="mb-3 font-display text-lg font-semibold text-ink">
          Set Monthly Budget
        </h2>
        <form onSubmit={handleSave} className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <div className="flex-1">
            <input
              type="number"
              step="0.01"
              value={draftLimit}
              onChange={(e) => setDraftLimit(e.target.value)}
              autoFocus
              className="amount w-full rounded-card border border-line px-3 py-2 text-sm text-ink outline-none focus:border-ink"
            />
            {error && <p className="mt-1 text-sm text-expense">{error}</p>}
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 rounded-card bg-ink px-3 py-2 text-sm font-medium text-surface hover:bg-ink/90 sm:flex-none"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setDraftLimit(String(budget.monthlyLimit));
                setError("");
                setIsEditing(false);
              }}
              className="flex-1 rounded-card border border-line px-3 py-2 text-sm font-medium text-ink-soft hover:text-ink sm:flex-none"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-card bg-surface p-4 shadow-card sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink">
          Monthly Budget
        </h2>
        <button
          onClick={() => setIsEditing(true)}
          className="text-sm font-medium text-ink-soft hover:text-ink"
        >
          {hasBudget ? "Edit" : "Set budget"}
        </button>
      </div>

      {!hasBudget ? (
        <p className="text-sm text-ink-faint">
          No budget set yet. Click "Set budget" to start tracking your
          monthly spending limit.
        </p>
      ) : (
        <>
          <div className="mb-2 flex items-baseline justify-between">
            <span className="amount text-sm text-ink-soft">
              {formatPeso(totalExpenses)} spent
            </span>
            <span className="amount text-sm text-ink-soft">
              of {formatPeso(budget.monthlyLimit)}
            </span>
          </div>

          <div className="h-2.5 w-full overflow-hidden rounded-full bg-paper">
            <div
              className={`h-full rounded-full transition-all ${
                isOverBudget ? "bg-expense" : "bg-budget"
              }`}
              style={{ width: `${barWidth}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span
              className={`text-sm font-medium ${
                isOverBudget ? "text-expense" : "text-ink-soft"
              }`}
            >
              {displayPercentage}% used
            </span>
            {isOverBudget ? (
              <span className="amount text-sm font-medium text-expense">
                {formatPeso(Math.abs(remainingBudget))} over budget
              </span>
            ) : (
              <span className="amount text-sm font-medium text-income">
                {formatPeso(remainingBudget)} remaining
              </span>
            )}
          </div>
        </>
      )}
    </section>
  );
}
