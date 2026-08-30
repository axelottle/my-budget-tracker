"use client";

import type { Transaction } from "@/types/transaction";
import { useTransactions } from "@/lib/transactions-context";

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
}

function formatPeso(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TransactionItem({
  transaction,
  onEdit,
}: TransactionItemProps) {
  const { deleteTransaction } = useTransactions();
  const isIncome = transaction.type === "income";

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${transaction.description}"? This can't be undone.`
    );
    if (confirmed) deleteTransaction(transaction.id);
  }

  return (
    <div className="rule flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="truncate font-body text-sm font-medium text-ink">
          {transaction.description}
        </p>
        <p className="text-xs text-ink-faint">
          {transaction.category} · {formatDate(transaction.date)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span
          className={`amount text-sm font-medium ${
            isIncome ? "text-income" : "text-expense"
          }`}
        >
          {isIncome ? "+" : "-"}
          {formatPeso(transaction.amount)}
        </span>
        <button
          onClick={() => onEdit(transaction)}
          className="text-xs font-medium text-ink-soft hover:text-ink"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="text-xs font-medium text-expense hover:text-expense/80"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
