type DashboardCardProps = {
  label: string;
  amount: number;
  tone?: "default" | "income" | "expense" | "budget";
  helper?: string;
};

// Maps each tone to a text color + a soft background for the label chip.
// Keeping this as a lookup (not inline ternaries) makes it easy to add a
// new tone later without touching the JSX below.
const toneStyles: Record<
  NonNullable<DashboardCardProps["tone"]>,
  { text: string; chip: string }
> = {
  default: { text: "text-ink", chip: "bg-paper" },
  income: { text: "text-income", chip: "bg-income-soft" },
  expense: { text: "text-expense", chip: "bg-expense-soft" },
  budget: { text: "text-budget", chip: "bg-budget-soft" },
};

function formatPeso(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function DashboardCard({
  label,
  amount,
  tone = "default",
  helper,
}: DashboardCardProps) {
  const styles = toneStyles[tone];

  return (
    <div className="rounded-card bg-surface p-4 shadow-card sm:p-5">
      <span
        className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium uppercase tracking-wide ${styles.chip} ${styles.text}`}
      >
        {label}
      </span>
      <p className={`amount mt-3 text-2xl font-semibold ${styles.text}`}>
        {formatPeso(amount)}
      </p>
      {helper && <p className="mt-1 text-sm text-ink-soft">{helper}</p>}
    </div>
  );
}
