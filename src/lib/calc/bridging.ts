/**
 * Simple bridging finance calculator. Generic maths only — not specific to any lender's product.
 *
 * "Retained" interest is deducted from the gross loan up front so the borrower receives the
 * net loan required; the gross loan therefore has to be solved for algebraically. "Serviced"
 * interest is paid monthly and does not inflate the loan itself.
 */

export type BridgingInterestType = "retained" | "serviced";

export interface BridgingInputs {
  netLoanRequired: number;
  monthlyInterestRatePercent: number;
  termMonths: number;
  interestType: BridgingInterestType;
  arrangementFeePercent: number;
  brokerFee: number;
  /** Optional — defaults to 0 so existing callers that don't pass it are unaffected. */
  valuationFee?: number;
  otherFees: number;
}

export interface BridgingResult {
  grossLoan: number;
  totalInterest: number;
  arrangementFee: number;
  totalFees: number;
  totalRepayment: number;
  effectiveCost: number;
}

export function calculateBridgingLoan(inputs: BridgingInputs): BridgingResult | null {
  const {
    netLoanRequired,
    monthlyInterestRatePercent,
    termMonths,
    interestType,
    arrangementFeePercent,
    brokerFee,
    valuationFee,
    otherFees,
  } = inputs;

  if (
    !Number.isFinite(netLoanRequired) ||
    netLoanRequired < 0 ||
    !Number.isFinite(monthlyInterestRatePercent) ||
    monthlyInterestRatePercent < 0 ||
    !Number.isFinite(termMonths) ||
    termMonths <= 0 ||
    !Number.isFinite(arrangementFeePercent) ||
    arrangementFeePercent < 0
  ) {
    return null;
  }

  const monthlyRate = monthlyInterestRatePercent / 100;
  const flatFees = Math.max(0, brokerFee || 0) + Math.max(0, valuationFee || 0) + Math.max(0, otherFees || 0);

  if (interestType === "serviced") {
    const grossLoan = netLoanRequired;
    const totalInterest = grossLoan * monthlyRate * termMonths;
    const arrangementFee = grossLoan * (arrangementFeePercent / 100);
    const totalFees = arrangementFee + flatFees;
    return {
      grossLoan,
      totalInterest,
      arrangementFee,
      totalFees,
      totalRepayment: grossLoan + totalFees,
      effectiveCost: totalInterest + totalFees,
    };
  }

  // Retained: gross = (net + flatFees) / (1 - monthlyRate*term - arrangementFeePercent/100)
  const denominator = 1 - monthlyRate * termMonths - arrangementFeePercent / 100;
  if (denominator <= 0) return null; // rate/fees/term combination is not fundable

  const grossLoan = (netLoanRequired + flatFees) / denominator;
  const totalInterest = grossLoan * monthlyRate * termMonths;
  const arrangementFee = grossLoan * (arrangementFeePercent / 100);
  const totalFees = arrangementFee + flatFees;

  return {
    grossLoan,
    totalInterest,
    arrangementFee,
    totalFees,
    totalRepayment: grossLoan,
    effectiveCost: totalInterest + totalFees,
  };
}
