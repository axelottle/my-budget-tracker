import type { Transaction } from "@/types/transaction";

// Temporary seed data so the dashboard and (soon) transaction list have
// something real to render. Phase 5 replaces this as the localStorage
// fallback for first-time visitors; the "Load Demo Data" button in Phase 15
// reuses it too.
export const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    description: "Salary",
    amount: 35000,
    category: "Salary",
    type: "income",
    date: "2026-08-01",
  },
  {
    id: "2",
    description: "Groceries",
    amount: 2500,
    category: "Food",
    type: "expense",
    date: "2026-08-05",
  },
  {
    id: "3",
    description: "Grab",
    amount: 450,
    category: "Transportation",
    type: "expense",
    date: "2026-08-08",
  },
  {
    id: "4",
    description: "Electric Bill",
    amount: 2100,
    category: "Bills",
    type: "expense",
    date: "2026-08-12",
  },
  {
    id: "5",
    description: "Movie",
    amount: 600,
    category: "Entertainment",
    type: "expense",
    date: "2026-08-20",
  },
];
