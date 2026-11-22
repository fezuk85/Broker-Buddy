/**
 * Simple bridging finance calculator. Generic maths only — not specific to any lender's product.
 *
 * "Retained" interest is deducted from the gross loan up front so the borrower receives the
 * net loan required; the gross loan therefore has to be solved for algebraically. "Serviced"
 * interest is paid monthly and does not inflate the loan itself.
 */

import { summariseFees, type FeeLine } from "./fees";

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
  /**
   * Whether each fee is added to the loan (borrowed, so it is part of the gross loan and bears
   * interest) or paid upfront by the borrower. Each is optional; when left out it follows the
   * traditional behaviour: added to the loan with retained interest, paid upfront with serviced.
   */
  arrangementFeeAddedToLoan?: boolean;
  brokerFeeAddedToLoan?: boolean;
  valuationFeeAddedToLoan?: boolean;
  otherFeesAddedToLoan?: boolean;
}

export interface BridgingResult {
  grossLoan: number;
  totalInterest: number;
  arrangementFee: number;
  totalFees: number;
  /** Retained: the gross loan. Serviced: the gross loan plus the fees paid upfront. */
  totalRepayment: number;
  effectiveCost: number;
  /** The fees broken down line by line (the arrangement fee as an amount), each marked added or upfront. */
  feeLines: FeeLine[];
  feesAddedToLoan: number;
  feesPayableUpfront: number;
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

  const defaultAdded = interestType === "retained";
  const arrangementAdded = inputs.arrangementFeeAddedToLoan ?? defaultAdded;
  const brokerAdded = inputs.brokerFeeAddedToLoan ?? defaultAdded;
  const valuationAdded = inputs.valuationFeeAddedToLoan ?? defaultAdded;
  const otherAdded = inputs.otherFeesAddedToLoan ?? defaultAdded;

  const monthlyRate = monthlyInterestRatePercent / 100;
  const broker = Math.max(0, brokerFee || 0);
  const valuation = Math.max(0, valuationFee || 0);
  const other = Math.max(0, otherFees || 0);
  const flatFees = broker + valuation + other;
  const flatFeesAdded = (brokerAdded ? broker : 0) + (valuationAdded ? valuation : 0) + (otherAdded ? other : 0);

  // gross = (net + flat fees added to the loan) / (1 - retained interest share - arrangement fee share if added)
  // Retained interest is deducted from the gross loan; serviced interest is paid monthly and is not.
  const denominator =
    1 - (interestType === "retained" ? monthlyRate * termMonths : 0) - (arrangementAdded ? arrangementFeePercent / 100 : 0);
  if (denominator <= 0) return null; // rate/fees/term combination is not fundable

  const grossLoan = (netLoanRequired + flatFeesAdded) / denominator;
  const totalInterest = grossLoan * monthlyRate * termMonths;
  const arrangementFee = grossLoan * (arrangementFeePercent / 100);
  const totalFees = arrangementFee + flatFees;

  const fees = summariseFees([
    { label: "Arrangement fee", amount: arrangementFee, addedToLoan: arrangementAdded },
    { label: "Broker fee", amount: broker, addedToLoan: brokerAdded },
    { label: "Valuation fee", amount: valuation, addedToLoan: valuationAdded },
    { label: "Other fees", amount: other, addedToLoan: otherAdded },
  ]);

  return {
    grossLoan,
    totalInterest,
    arrangementFee,
    totalFees,
    totalRepayment: interestType === "retained" ? grossLoan : grossLoan + fees.payableUpfront,
    effectiveCost: totalInterest + totalFees,
    feeLines: fees.lines,
    feesAddedToLoan: fees.addedToLoan,
    feesPayableUpfront: fees.payableUpfront,
  };
}

export interface BridgingRepaymentRow {
  /** Whole months the loan is kept. */
  month: number;
  /** Interest for the months used so far (gross loan x monthly rate x months). */
  interestToDate: number;
  /** All fees; these are the same whichever month the loan is repaid. */
  fees: number;
  /** Interest to date plus fees: what the loan has cost by this month. */
  totalCost: number;
  /**
   * What is owed to the lender to clear the loan at the end of this month. Serviced: the gross loan
   * (interest has been paid monthly). Retained: the gross loan less the retained interest not yet
   * used, which assumes unused retained interest is rebated on early repayment.
   */
  repayLender: number;
}

/**
 * "If you keep it for N months, you owe this." Interest is taken as simple monthly interest on the
 * gross loan for the months used. Generic maths only: real lenders can set a minimum interest period,
 * charge exit fees or calculate interest daily, so the table is an illustration, not a payoff figure.
 */
export function bridgingRepaymentSchedule(
  inputs: Pick<BridgingInputs, "monthlyInterestRatePercent" | "termMonths" | "interestType">,
  result: Pick<BridgingResult, "grossLoan" | "totalFees">
): BridgingRepaymentRow[] {
  const { monthlyInterestRatePercent, termMonths, interestType } = inputs;
  if (!(termMonths > 0) || !(monthlyInterestRatePercent >= 0)) return [];
  const monthlyRate = monthlyInterestRatePercent / 100;
  const monthlyInterest = result.grossLoan * monthlyRate;
  const months: number[] = [];
  for (let m = 1; m < termMonths && m <= 60; m++) months.push(m);
  months.push(termMonths);
  return months.map((month) => {
    const interestToDate = monthlyInterest * month;
    const unusedRetained = interestType === "retained" ? monthlyInterest * (termMonths - month) : 0;
    return {
      month,
      interestToDate,
      fees: result.totalFees,
      totalCost: interestToDate + result.totalFees,
      repayLender: result.grossLoan - unusedRetained,
    };
  });
}
