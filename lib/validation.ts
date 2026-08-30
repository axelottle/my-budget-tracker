export interface TransactionFormValues {
  description: string;
  amount: string; // raw input value, parsed to number by the caller
  category: string;
  date: string;
}

export type TransactionFormErrors = Partial<
  Record<keyof TransactionFormValues, string>
>;

export function validateTransactionForm(
  values: TransactionFormValues
): TransactionFormErrors {
  const errors: TransactionFormErrors = {};

  if (!values.description.trim()) {
    errors.description = "Description can't be empty.";
  }

  const parsedAmount = Number(values.amount);
  if (!values.amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
    errors.amount = "Amount must be greater than zero.";
  }

  if (!values.category) {
    errors.category = "Choose a category.";
  }

  if (!values.date || Number.isNaN(Date.parse(values.date))) {
    errors.date = "Enter a valid date.";
  }

  return errors;
}
