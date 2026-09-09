/**
 * Second (and third+) charge secured loan maths. A second/third charge loan sits behind one or
 * more existing charges secured on the same property, so what matters for LTV/equity purposes
 * is the combined balance of everything secured against the property — not just the new loan.
 *
 * This deliberately reuses the same LTV/equity logic as a first-charge mortgage (see ltv.ts):
 * "existing charges" here plays the role "current mortgage balance" plays there. What's added
 * is the per-charge breakdown brokers doing second-charge business actually want to see — how
 * the combined LTV builds up charge by charge.
 */

export interface ExistingCharge {
  label: string; // e.g. "1st charge (existing mortgage)", "2nd charge"
  balance: number;
}

export interface ChargeBreakdownRow {
  label: string;
  balance: number;
  cumulativeBalance: number;
  cumulativeLtvPercent: number | null;
}

export interface CombinedChargeResult {
  propertyValue: number;
  existingCharges: ChargeBreakdownRow[];
  combinedExistingBalance: number;
  currentCombinedLtvPercent: number | null;
  newChargeAmount: number;
  totalProposedBalance: number;
  proposedCombinedLtvPercent: number | null;
  equity: number;
  equityAfterNewCharge: number;
}

function safeLtv(balance: number, propertyValue: number): number | null {
  if (!(propertyValue > 0)) return null;
  return (balance / propertyValue) * 100;
}

export function calculateCombinedCharges(
  propertyValue: number,
  existingCharges: ExistingCharge[],
  newChargeAmount: number
): CombinedChargeResult {
  let cumulative = 0;
  const breakdown: ChargeBreakdownRow[] = existingCharges.map((c) => {
    cumulative += Math.max(0, c.balance || 0);
    return {
      label: c.label,
      balance: c.balance,
      cumulativeBalance: cumulative,
      cumulativeLtvPercent: safeLtv(cumulative, propertyValue),
    };
  });

  const combinedExistingBalance = cumulative;
  const totalProposedBalance = combinedExistingBalance + Math.max(0, newChargeAmount || 0);

  return {
    propertyValue,
    existingCharges: breakdown,
    combinedExistingBalance,
    currentCombinedLtvPercent: safeLtv(combinedExistingBalance, propertyValue),
    newChargeAmount,
    totalProposedBalance,
    proposedCombinedLtvPercent: safeLtv(totalProposedBalance, propertyValue),
    equity: propertyValue - combinedExistingBalance,
    equityAfterNewCharge: propertyValue - totalProposedBalance,
  };
}

export interface SecuredLoanCostInputs {
  loanAmount: number;
  monthlyInterestRatePercent: number; // pay-rate charged on the new charge, per month
  termMonths: number;
  repaymentType: "repayment" | "interest-only";
  lenderFee: number;
  brokerFee: number;
  valuationFee: number;
  otherFees: number;
}

export interface SecuredLoanCostResult {
  monthlyPayment: number;
  totalInterest: number;
  totalFees: number;
  totalCostOfBorrowing: number;
}

/**
 * Total cost of a second/third charge loan: monthly payment (repayment or interest-only, same
 * amortisation maths as a first-charge mortgage) plus typical secured-loan fees. This is a
 * total-cost illustration, not a mandatory APRC calculation — quote the lender's own APRC for
 * regulatory disclosure.
 */
export function calculateSecuredLoanCost(inputs: SecuredLoanCostInputs): SecuredLoanCostResult | null {
  const { loanAmount, monthlyInterestRatePercent, termMonths, repaymentType, lenderFee, brokerFee, valuationFee, otherFees } = inputs;
  if (!Number.isFinite(loanAmount) || loanAmount < 0) return null;
  if (!Number.isFinite(termMonths) || termMonths <= 0) return null;
  if (!Number.isFinite(monthlyInterestRatePercent) || monthlyInterestRatePercent < 0) return null;

  const totalFees = Math.max(0, lenderFee || 0) + Math.max(0, brokerFee || 0) + Math.max(0, valuationFee || 0) + Math.max(0, otherFees || 0);

  let monthlyPayment: number;
  let totalInterest: number;

  if (repaymentType === "interest-only") {
    monthlyPayment = loanAmount * (monthlyInterestRatePercent / 100);
    totalInterest = monthlyPayment * termMonths;
  } else {
    const monthlyRate = monthlyInterestRatePercent / 100;
    if (loanAmount === 0) {
      monthlyPayment = 0;
      totalInterest = 0;
    } else if (monthlyRate === 0) {
      monthlyPayment = loanAmount / termMonths;
      totalInterest = 0;
    } else {
      const factor = Math.pow(1 + monthlyRate, termMonths);
      monthlyPayment = (loanAmount * monthlyRate * factor) / (factor - 1);
      totalInterest = monthlyPayment * termMonths - loanAmount;
    }
  }

  return {
    monthlyPayment,
    totalInterest,
    totalFees,
    totalCostOfBorrowing: totalInterest + totalFees,
  };
}
