"use client";

import { useState } from "react";
import type { Transaction, TransactionType } from "@/types/transaction";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/categories";
import { useTransactions } from "@/lib/transactions-context";
import {
  validateTransactionForm,
  type TransactionFormErrors,
} from "@/lib/validation";

interface TransactionFormProps {
  transaction?: Transaction; // present = editing; absent = creating
  onDone: () => void;
}

export default function TransactionForm({
  transaction,
  onDone,
}: TransactionFormProps) {
  const { addTransaction, updateTransaction } = useTransactions();

  const [type, setType] = useState<TransactionType>(
    transaction?.type ?? "expense"
  );
  const [description, setDescription] = useState(
    transaction?.description ?? ""
  );
  const [amount, setAmount] = useState(
    transaction ? String(transaction.amount) : ""
  );
  const [category, setCategory] = useState(transaction?.category ?? "");
  const [date, setDate] = useState(
    transaction?.date ?? new Date().toISOString().slice(0, 10)
  );
  const [errors, setErrors] = useState<TransactionFormErrors>({});

  const categoryOptions =
    type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  function handleTypeChange(nextType: TransactionType) {
    setType(nextType);
    setCategory(""); // categories differ per type, so the old pick may not apply
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationErrors = validateTransactionForm({
      description,
      amount,
      category,
      date,
    });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const payload = {
      description: description.trim(),
      amount: Number(amount),
      category: category as Transaction["category"],
      type,
      date,
    };

    if (transaction) {
      updateTransaction({ ...payload, id: transaction.id });
    } else {
      addTransaction(payload);
    }

    onDone();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type toggle */}
      <div className="flex gap-2">
        {(["expense", "income"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => handleTypeChange(t)}
            className={`flex-1 rounded-card border py-2 text-sm font-medium capitalize transition-colors ${
              type === t
                ? t === "income"
                  ? "border-income bg-income-soft text-income"
                  : "border-expense bg-expense-soft text-expense"
                : "border-line text-ink-soft"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Description */}
      <div>
        <label className="mb-1 block text-sm font-medium text-ink-soft">
          Description
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Groceries"
          className="w-full rounded-card border border-line px-3 py-2 text-sm text-ink outline-none focus:border-ink"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-expense">{errors.description}</p>
        )}
      </div>

      {/* Amount */}
      <div>
        <label className="mb-1 block text-sm font-medium text-ink-soft">
          Amount (₱)
        </label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="amount w-full rounded-card border border-line px-3 py-2 text-sm text-ink outline-none focus:border-ink"
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-expense">{errors.amount}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="mb-1 block text-sm font-medium text-ink-soft">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-card border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-ink"
        >
          <option value="">Select a category</option>
          {categoryOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-expense">{errors.category}</p>
        )}
      </div>

      {/* Date */}
      <div>
        <label className="mb-1 block text-sm font-medium text-ink-soft">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-card border border-line px-3 py-2 text-sm text-ink outline-none focus:border-ink"
        />
        {errors.date && (
          <p className="mt-1 text-sm text-expense">{errors.date}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full rounded-card bg-ink py-2.5 text-sm font-medium text-surface hover:bg-ink/90"
      >
        {transaction ? "Save changes" : "Add transaction"}
      </button>
    </form>
  );
}
