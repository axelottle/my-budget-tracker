"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { Budget, NewTransaction, Transaction } from "@/types/transaction";
import { DEMO_TRANSACTIONS } from "@/lib/demo-data";
import { STORAGE_KEYS, readFromStorage, writeToStorage } from "@/lib/storage";

interface State {
  transactions: Transaction[];
  budget: Budget;
  isHydrated: boolean;
}

type Action =
  | { type: "ADD_TRANSACTION"; payload: NewTransaction }
  | { type: "UPDATE_TRANSACTION"; payload: Transaction }
  | { type: "DELETE_TRANSACTION"; payload: { id: string } }
  | { type: "SET_TRANSACTIONS"; payload: Transaction[] }
  | { type: "SET_BUDGET"; payload: Budget }
  | { type: "HYDRATE"; payload: { transactions: Transaction[]; budget: Budget } };

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
    case "HYDRATE": {
      return {
        ...state,
        transactions: action.payload.transactions,
        budget: action.payload.budget,
        isHydrated: true,
      };
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

// Default, pre-hydration state. This is what both the server render and the
// very first client render show — it must NOT read localStorage directly
// (that would cause a hydration mismatch). The effect in the provider below
// loads the real saved data right after mount.
const initialState: State = {
  transactions: [],
  budget: { monthlyLimit: 30000 },
  isHydrated: false,
};

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load once, right after mount (client-only — see comment on initialState).
  // Transactions, budget, and the "loaded" flag are dispatched together in a
  // single HYDRATE action, so they land in the same render. If they were
  // three separate dispatches (or a ref flipped outside the reducer), the
  // save effects below could fire in between with stale, pre-load state and
  // overwrite the very data we just loaded.
  useEffect(() => {
    const storedTransactions = readFromStorage<Transaction[]>(
      STORAGE_KEYS.transactions,
      []
    );
    const storedBudget = readFromStorage<Budget>(STORAGE_KEYS.budget, {
      monthlyLimit: 30000,
    });

    dispatch({
      type: "HYDRATE",
      payload: { transactions: storedTransactions, budget: storedBudget },
    });
  }, []);

  // Persist on every change, once we're past the initial load.
  useEffect(() => {
    if (!state.isHydrated) return;
    writeToStorage(STORAGE_KEYS.transactions, state.transactions);
  }, [state.transactions, state.isHydrated]);

  useEffect(() => {
    if (!state.isHydrated) return;
    writeToStorage(STORAGE_KEYS.budget, state.budget);
  }, [state.budget, state.isHydrated]);

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
