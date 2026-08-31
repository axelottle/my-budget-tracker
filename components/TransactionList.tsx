"use client";

import { useMemo, useState } from "react";
import type { Transaction } from "@/types/transaction";
import { useTransactions } from "@/lib/transactions-context";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/categories";
import {
  DEFAULT_FILTERS,
  filterTransactions,
  getAvailableMonths,
  hasActiveFilters,
  type TransactionFilters,
} from "@/lib/filtering";
import TransactionItem from "@/components/TransactionItem";
import TransactionForm from "@/components/TransactionForm";
import Modal from "@/components/Modal";

// Both category lists share "Other", so dedupe with a Set for the combined
// filter dropdown (the add/edit form still uses the type-specific lists).
const ALL_CATEGORIES = Array.from(
  new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])
);

export default function TransactionList() {
  const { transactions } = useTransactions();
  const [isAdding, setIsAdding] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [filters, setFilters] = useState<TransactionFilters>(DEFAULT_FILTERS);

  const availableMonths = useMemo(
    () => getAvailableMonths(transactions),
    [transactions]
  );

  const filtered = useMemo(
    () => filterTransactions(transactions, filters),
    [transactions, filters]
  );

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  function updateFilter<K extends keyof TransactionFilters>(
    key: K,
    value: TransactionFilters[K]
  ) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  const filtersActive = hasActiveFilters(filters);

  return (
    <section className="mt-8">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-lg font-semibold text-ink">
          Transactions
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          className="rounded-card bg-ink px-3 py-1.5 text-sm font-medium text-surface hover:bg-ink/90"
        >
          + Add Transaction
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="mb-3 space-y-3 rounded-card bg-surface p-4 shadow-card">
        <input
          type="text"
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          placeholder="Search by description..."
          className="w-full rounded-card border border-line px-3 py-2 text-sm text-ink outline-none focus:border-ink"
        />

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <select
            value={filters.type}
            onChange={(e) =>
              updateFilter(
                "type",
                e.target.value as TransactionFilters["type"]
              )
            }
            className="rounded-card border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-ink"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) => updateFilter("category", e.target.value)}
            className="rounded-card border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-ink"
          >
            <option value="all">All Categories</option>
            {ALL_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={filters.month}
            onChange={(e) => updateFilter("month", e.target.value)}
            className="rounded-card border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-ink"
          >
            <option value="all">All Months</option>
            {availableMonths.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {filtersActive && (
          <button
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="text-sm font-medium text-ink-soft hover:text-ink"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="rounded-card bg-surface px-4 shadow-card">
        {transactions.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-faint">
            No transactions yet. Add your first one to get started.
          </p>
        ) : sorted.length === 0 ? (
          <div className="py-8 text-center text-sm text-ink-faint">
            <p>No transactions match your filters.</p>
            <button
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="mt-1 font-medium text-ink-soft underline hover:text-ink"
            >
              Clear filters
            </button>
          </div>
        ) : (
          sorted.map((t) => (
            <TransactionItem
              key={t.id}
              transaction={t}
              onEdit={setEditingTransaction}
            />
          ))
        )}
      </div>

      {isAdding && (
        <Modal title="Add Transaction" onClose={() => setIsAdding(false)}>
          <TransactionForm onDone={() => setIsAdding(false)} />
        </Modal>
      )}

      {editingTransaction && (
        <Modal
          title="Edit Transaction"
          onClose={() => setEditingTransaction(null)}
        >
          <TransactionForm
            transaction={editingTransaction}
            onDone={() => setEditingTransaction(null)}
          />
        </Modal>
      )}
    </section>
  );
}
