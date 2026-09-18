/**
 * Mortgage overpayment impact for a repayment (capital & interest) mortgage: months and interest
 * saved by paying extra each month and/or a one-off lump sum now. Assumes a constant rate for the
 * whole remaining term and that overpayments reduce the balance (the term shortens) rather than
 * the monthly payment. Early repayment charges are not modelled.
 */
import { calculateRepaymentPayment } from "./repayment";

export interface OverpaymentInputs {
  balance: number;
  annualInterestRatePercent: number;
  remainingTermYears: number;
  monthlyOverpayment: number;
  lumpSumNow: number;
}

export interface OverpaymentResult {
  requiredMonthlyPayment: number;
  baselineMonths: number;
  baselineTotalInterest: number;
  withOverpaymentMonths: number;
  withOverpaymentTotalInterest: number;
  interestSaved: number;
  monthsSaved: number;
  /** Lump sum + overpayments as a share of the starting balance in year 1, for ERC allowance checks. */
  firstYearOverpaymentPercentOfBalance: number;
}

const MAX_MONTHS = 1200;

function nonNegative(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function simulate(balance: number, monthlyRate: number, payment: number, extraMonthly: number) {
  let remaining = balance;
  let months = 0;
  let interest = 0;
  while (remaining > 0.005 && months < MAX_MONTHS) {
    const monthInterest = remaining * monthlyRate;
    interest += monthInterest;
    const pay = Math.min(remaining + monthInterest, payment + extraMonthly);
    remaining = remaining + monthInterest - pay;
    months += 1;
  }
  return { months, interest };
}

export function calculateOverpayment(inputs: OverpaymentInputs): OverpaymentResult | null {
  const balance = nonNegative(inputs.balance);
  const rate = nonNegative(inputs.annualInterestRatePercent);
  const termMonths = Math.round(nonNegative(inputs.remainingTermYears) * 12);
  if (balance <= 0 || termMonths <= 0) return null;

  const base = calculateRepaymentPayment({
    loanAmount: balance,
    annualInterestRatePercent: rate,
    termMonths,
  });
  if (!base) return null;

  const monthlyRate = rate / 100 / 12;
  const payment = base.monthlyPayment;
  const lump = Math.min(nonNegative(inputs.lumpSumNow), balance);
  const extra = nonNegative(inputs.monthlyOverpayment);

  const baseline = simulate(balance, monthlyRate, payment, 0);
  const withOver = simulate(balance - lump, monthlyRate, payment, extra);

  return {
    requiredMonthlyPayment: payment,
    baselineMonths: baseline.months,
    baselineTotalInterest: baseline.interest,
    withOverpaymentMonths: withOver.months,
    withOverpaymentTotalInterest: withOver.interest,
    interestSaved: Math.max(0, baseline.interest - withOver.interest),
    monthsSaved: Math.max(0, baseline.months - withOver.months),
    firstYearOverpaymentPercentOfBalance: ((lump + extra * 12) / balance) * 100,
  };
}
