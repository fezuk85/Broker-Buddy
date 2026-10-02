/**
 * Mortgage fee maths: the one-off costs around a case (lender/product fee, valuation, application,
 * broker fee, other), and how much of that gets paid upfront vs added to the loan itself.
 * Every fee can be either paid upfront or added to the loan. Negative inputs are treated as 0 —
 * a fee can't be negative.
 */

/** One fee as entered by the user, with whether it is added to the loan or paid upfront. */
export interface FeeItem {
  label: string;
  amount: number;
  addedToLoan: boolean;
}

/** A fee line ready for display or PDF output (amount already cleaned to a non-negative number). */
export interface FeeLine {
  label: string;
  amount: number;
  addedToLoan: boolean;
}

export interface FeeSummary {
  /** Only fees with an amount above zero, in the order given. */
  lines: FeeLine[];
  totalFees: number;
  /** Sum of the fees the borrower pays upfront, i.e. everything not added to the loan. */
  payableUpfront: number;
  /** Sum of the fees added to the loan rather than paid upfront. */
  addedToLoan: number;
}

function nonNegative(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function summariseFees(items: FeeItem[]): FeeSummary {
  const lines: FeeLine[] = items
    .map((i) => ({ label: i.label, amount: nonNegative(i.amount), addedToLoan: i.addedToLoan }))
    .filter((l) => l.amount > 0);
  const totalFees = lines.reduce((sum, l) => sum + l.amount, 0);
  const addedToLoan = lines.reduce((sum, l) => sum + (l.addedToLoan ? l.amount : 0), 0);
  return { lines, totalFees, payableUpfront: totalFees - addedToLoan, addedToLoan };
}

export interface FeesInputs {
  /** Lender's product/arrangement fee. */
  productFee: number;
  addProductFeeToLoan: boolean;
  valuationFee: number;
  applicationFee: number;
  brokerFee: number;
  otherFees: number;
  /** Each of these is optional and defaults to false (paid upfront), so existing callers are unaffected. */
  addValuationFeeToLoan?: boolean;
  addApplicationFeeToLoan?: boolean;
  addBrokerFeeToLoan?: boolean;
  addOtherFeesToLoan?: boolean;
}

export type FeesResult = FeeSummary;

export function calculateFees(inputs: FeesInputs): FeesResult {
  return summariseFees([
    { label: "Lender/product fee", amount: inputs.productFee, addedToLoan: inputs.addProductFeeToLoan },
    { label: "Valuation fee", amount: inputs.valuationFee, addedToLoan: inputs.addValuationFeeToLoan ?? false },
    { label: "Application fee", amount: inputs.applicationFee, addedToLoan: inputs.addApplicationFeeToLoan ?? false },
    { label: "Broker fee", amount: inputs.brokerFee, addedToLoan: inputs.addBrokerFeeToLoan ?? false },
    { label: "Other fees", amount: inputs.otherFees, addedToLoan: inputs.addOtherFeesToLoan ?? false },
  ]);
}
