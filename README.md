# Budget Tracker

A personal budget tracker built as a portfolio project to demonstrate React, TypeScript, Next.js, and Tailwind CSS. Track income and expenses, set a monthly budget, and see where your money goes — all stored locally in the browser, with no backend or database.

Built for a Philippine context: all currency is displayed in Philippine Pesos (₱), formatted with the `en-PH` locale.

## Features

- **Dashboard** — total balance, income, expenses, and monthly budget at a glance
- **Transactions** — add, edit, and delete, with predefined income/expense categories
- **Budget tracking** — set a monthly limit, see a progress bar, and get a clear over-budget indicator
- **Filtering & search** — filter by type, category, or month, and search by description, all combinable
- **Spending by category** — a simple visual breakdown of where your expenses go
- **Demo data** — load realistic sample transactions with one click, or clear everything and start fresh
- **Persistence** — everything survives a page refresh via `localStorage`
- **Responsive** — usable on desktop, tablet, and mobile

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- Browser `localStorage` — no backend, no database

## How It Works

**State management.** All transaction and budget state lives in a single React Context (`lib/transactions-context.tsx`), backed by a `useReducer`. Every add/edit/delete/budget-change goes through the reducer as an explicit, named action (`ADD_TRANSACTION`, `DELETE_TRANSACTION`, etc.), which keeps every state transition traceable in one place rather than scattered across components.

**Persistence.** On mount, a `useEffect` reads saved data from `localStorage` and loads it into state via a single `HYDRATE` action. A separate pair of effects writes the current state back to `localStorage` whenever transactions or the budget change — but only *after* that initial load completes, guarded by an `isHydrated` flag kept in the reducer's own state. (Earlier in development, that flag lived in a `useRef` instead, which introduced a real race condition: the save effect could fire with stale, pre-load state and immediately overwrite the data that had just been loaded. Moving the flag into the reducer's state — so it updates atomically together with the loaded data, in the same render — fixed it. This is a good example of a subtle bug that only shows up because React effects don't see state updates from `dispatch()` until the *next* render.)

**Deriving values, not storing them.** Totals (income, expenses, balance, remaining budget, spending by category) are never stored directly — they're computed from the transaction list with `useMemo`. This guarantees they can never drift out of sync with the actual data.

**Why localStorage instead of a database.** This version deliberately skips a backend entirely — data lives only in the browser that created it, and won't sync across devices or survive clearing browser data. That's an intentional trade-off for a portfolio project scoped to demonstrate frontend skills, not a production financial tool. A real version would swap `lib/storage.ts` for API calls to a backend with a proper database, without needing to change any of the components that consume `useTransactions()`.

## Running Locally

```bash
git clone <your-repo-url>
cd budget-tracker
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## What I Learned

- **`useReducer` vs. multiple `useState` calls**: once a piece of state has several distinct ways it can change (add, edit, delete, bulk-replace), centralizing those transitions in a reducer's `switch` statement is far easier to reason about than scattering `setState` calls across components.
- **The gap between "renders correctly" and "hydrates correctly"**: `localStorage` isn't available during server rendering, and reading it too early causes hydration mismatches. Combined with the race condition described above, this phase was a good lesson in how React's effect timing (not just its rendering) has to be reasoned about carefully.
- **Timezone bugs hide in plain sight**: `new Date("2026-08-01")` and `new Date().toISOString()` both round-trip through UTC, which silently shifts dates by a day depending on the viewer's timezone. Two separate bugs from this pattern turned up during testing — one affecting how dates displayed, one affecting what date a new transaction defaulted to. Both are fixed by building `Date` objects from explicit local year/month/day parts instead of parsing/formatting through UTC.
- **Deriving state beats storing it**: keeping totals as `useMemo`-computed values instead of separate pieces of state eliminated an entire category of "the total doesn't match the list" bugs before they could happen.

## Future Improvements

- Sync data across devices with a real backend and database
- Multi-currency support
- Recurring transactions (e.g. monthly subscriptions)
- Export transactions to CSV
- Custom, user-defined categories
- Unit tests for the reducer and filtering/validation helpers
