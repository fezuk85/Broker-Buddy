/** Mortgage payment maths: capital & interest (repayment) and interest-only. */

export type RepaymentType = "repayment" | "interest-only";

export interface PaymentInputs {
  loanAmount: number;
  annualInterestRatePercent: number;
  termMonths: number;
}

export interface PaymentResult {
  monthlyPayment: number;
  totalRepaid: number;
  totalInterest: number;
}

/** Standard capital & interest amortisation. Handles 0% rate (straight-line) and 0 loan/term. */
export function calculateRepaymentPayment(inputs: PaymentInputs): PaymentResult | null {
  const { loanAmount, annualInterestRatePercent, termMonths } = inputs;
  if (!Number.isFinite(loanAmount) || loanAmount < 0) return null;
  if (!Number.isFinite(termMonths) || termMonths <= 0) return null;
  if (!Number.isFinite(annualInterestRatePercent) || annualInterestRatePercent < 0) return null;

  if (loanAmount === 0) {
    return { monthlyPayment: 0, totalRepaid: 0, totalInterest: 0 };
  }

  const monthlyRate = annualInterestRatePercent / 100 / 12;
  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = loanAmount / termMonths;
  } else {
    const factor = Math.pow(1 + monthlyRate, termMonths);
    monthlyPayment = (loanAmount * monthlyRate * factor) / (factor - 1);
  }

  const totalRepaid = monthlyPayment * termMonths;
  const totalInterest = totalRepaid - loanAmount;

  return { monthlyPayment, totalRepaid, totalInterest };
}

export function calculateInterestOnlyPayment(
  loanAmount: number,
  annualInterestRatePercent: number
): number | null {
  if (!Number.isFinite(loanAmount) || loanAmount < 0) return null;
  if (!Number.isFinite(annualInterestRatePercent) || annualInterestRatePercent < 0) return null;
  return (loanAmount * (annualInterestRatePercent / 100)) / 12;
}

export interface RateComparisonRow {
  label: string;
  ratePercent: number;
  monthlyPayment: number | null;
}

/** Payment at current rate and at +0.5 / +1.0 / +2.0 percentage points, for both payment types. */
export function calculateRateComparison(
  loanAmount: number,
  baseRatePercent: number,
  termMonths: number,
  repaymentType: RepaymentType
): RateComparisonRow[] {
  const bumps = [
    { label: "Current rate", delta: 0 },
    { label: "+0.5%", delta: 0.5 },
    { label: "+1.0%", delta: 1.0 },
    { label: "+2.0%", delta: 2.0 },
  ];

  return bumps.map(({ label, delta }) => {
    const ratePercent = Math.max(0, baseRatePercent + delta);
    const monthlyPayment =
      repaymentType === "interest-only"
        ? calculateInterestOnlyPayment(loanAmount, ratePercent)
        : calculateRepaymentPayment({ loanAmount, annualInterestRatePercent: ratePercent, termMonths })
            ?.monthlyPayment ?? null;
    return { label, ratePercent, monthlyPayment };
  });
}
