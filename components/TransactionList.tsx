"use client";

import { useState } from "react";
import type { Transaction } from "@/types/transaction";
import { useTransactions } from "@/lib/transactions-context";
import TransactionItem from "@/components/TransactionItem";
import TransactionForm from "@/components/TransactionForm";
import Modal from "@/components/Modal";

export default function TransactionList() {
  const { transactions } = useTransactions();
  const [isAdding, setIsAdding] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between">
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

      <div className="rounded-card bg-surface px-4 shadow-card">
        {sorted.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-faint">
            No transactions yet. Add your first one to get started.
          </p>
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
