/**
 * Mortgage fee maths: the one-off costs around a case (lender/product fee, valuation, application,
 * broker fee, other), and how much of that gets paid upfront vs added to the loan itself.
 * Negative inputs are treated as 0 — a fee can't be negative.
 */

export interface FeesInputs {
  /** Lender's product/arrangement fee — the only one of these usually able to be added to the loan. */
  productFee: number;
  addProductFeeToLoan: boolean;
  valuationFee: number;
  applicationFee: number;
  brokerFee: number;
  otherFees: number;
}

export interface FeesResult {
  totalFees: number;
  /** Sum of fees the borrower pays upfront, i.e. everything except a product fee added to the loan. */
  payableUpfront: number;
  /** Amount (if any) added to the loan rather than paid upfront. */
  addedToLoan: number;
}

function nonNegative(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function calculateFees(inputs: FeesInputs): FeesResult {
  const productFee = nonNegative(inputs.productFee);
  const valuationFee = nonNegative(inputs.valuationFee);
  const applicationFee = nonNegative(inputs.applicationFee);
  const brokerFee = nonNegative(inputs.brokerFee);
  const otherFees = nonNegative(inputs.otherFees);

  const totalFees = productFee + valuationFee + applicationFee + brokerFee + otherFees;
  const addedToLoan = inputs.addProductFeeToLoan ? productFee : 0;
  const payableUpfront = totalFees - addedToLoan;

  return { totalFees, payableUpfront, addedToLoan };
}
