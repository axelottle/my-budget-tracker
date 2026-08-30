"use client";

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { Budget, NewTransaction, Transaction } from "@/types/transaction";
import { DEMO_TRANSACTIONS } from "@/lib/demo-data";

interface State {
  transactions: Transaction[];
  budget: Budget;
}

type Action =
  | { type: "ADD_TRANSACTION"; payload: NewTransaction }
  | { type: "UPDATE_TRANSACTION"; payload: Transaction }
  | { type: "DELETE_TRANSACTION"; payload: { id: string } }
  | { type: "SET_TRANSACTIONS"; payload: Transaction[] }
  | { type: "SET_BUDGET"; payload: Budget };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_TRANSACTION": {
      const newTransaction: Transaction = {
        ...action.payload,
        id: crypto.randomUUID(),
      };
      return { ...state, transactions: [newTransaction, ...state.transactions] };
    }
    case "UPDATE_TRANSACTION": {
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    }
    case "DELETE_TRANSACTION": {
      return {
        ...state,
        transactions: state.transactions.filter(
          (t) => t.id !== action.payload.id
        ),
      };
    }
    case "SET_TRANSACTIONS": {
      return { ...state, transactions: action.payload };
    }
    case "SET_BUDGET": {
      return { ...state, budget: action.payload };
    }
    default:
      return state;
  }
}

interface TransactionsContextValue {
  transactions: Transaction[];
  budget: Budget;
  totalIncome: number;
  totalExpenses: number;
  totalBalance: number;
  remainingBudget: number;
  addTransaction: (transaction: NewTransaction) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  loadDemoData: () => void;
  clearTransactions: () => void;
  setBudget: (budget: Budget) => void;
}

const TransactionsContext = createContext<TransactionsContextValue | null>(
  null
);

// Seeded with demo data for now. Phase 5 changes this initial value to read
// from localStorage instead (falling back to an empty array, not demo data,
// for a real first-time visitor).
const initialState: State = {
  transactions: DEMO_TRANSACTIONS,
  budget: { monthlyLimit: 30000 },
};

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Totals are derived, never stored directly, so they can't drift out of
  // sync with the transaction list.
  const totalIncome = useMemo(
    () =>
      state.transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0),
    [state.transactions]
  );

  const totalExpenses = useMemo(
    () =>
      state.transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0),
    [state.transactions]
  );

  const totalBalance = totalIncome - totalExpenses;
  const remainingBudget = state.budget.monthlyLimit - totalExpenses;

  const value: TransactionsContextValue = {
    transactions: state.transactions,
    budget: state.budget,
    totalIncome,
    totalExpenses,
    totalBalance,
    remainingBudget,
    addTransaction: (transaction) =>
      dispatch({ type: "ADD_TRANSACTION", payload: transaction }),
    updateTransaction: (transaction) =>
      dispatch({ type: "UPDATE_TRANSACTION", payload: transaction }),
    deleteTransaction: (id) =>
      dispatch({ type: "DELETE_TRANSACTION", payload: { id } }),
    loadDemoData: () =>
      dispatch({ type: "SET_TRANSACTIONS", payload: DEMO_TRANSACTIONS }),
    clearTransactions: () =>
      dispatch({ type: "SET_TRANSACTIONS", payload: [] }),
    setBudget: (budget) => dispatch({ type: "SET_BUDGET", payload: budget }),
  };

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions(): TransactionsContextValue {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error(
      "useTransactions must be used within a TransactionsProvider"
    );
  }
  return context;
}
