/**
 * Rental DSCR (debt service coverage ratio) maths, matching how BTL lenders actually assess
 * rental coverage: rent is checked against the *real* monthly payment (not a payment derived
 * from a generic stress rate), and the required coverage percentage depends on the borrower's
 * tax position — since Section 24 restricts mortgage interest relief for individual higher/
 * additional-rate taxpayers, lenders typically require more coverage from them than from
 * basic-rate taxpayers or limited company borrowers.
 *
 * Mathematical tool only — not lender criteria. Individual lenders set their own required ICR
 * and may stress the payment differently; always confirm with the lender's own criteria.
 */

export type LandlordTaxStatus = "basic-rate" | "higher-additional-rate" | "limited-company";

/** Standard industry-common required ICR by tax status. Editable in the UI — lenders vary. */
export const STANDARD_ICR_PERCENT_BY_TAX_STATUS: Record<LandlordTaxStatus, number> = {
  "basic-rate": 125,
  "higher-additional-rate": 145,
  "limited-company": 125,
};

export interface DscrResult {
  monthlyPayment: number;
  monthlyRent: number;
  requiredIcrPercent: number;
  dscrPercent: number | null;
  requiredMonthlyRent: number;
  passes: boolean | null;
  surplusOrShortfall: number;
}

/** Coverage of a given monthly payment (any charge) by monthly rent, against a required ICR%. */
export function calculateDscr(monthlyPayment: number, monthlyRent: number, requiredIcrPercent: number): DscrResult {
  const payment = Math.max(0, monthlyPayment || 0);
  const rent = Math.max(0, monthlyRent || 0);
  const requiredMonthlyRent = payment * (requiredIcrPercent / 100);

  return {
    monthlyPayment: payment,
    monthlyRent: rent,
    requiredIcrPercent,
    dscrPercent: payment > 0 ? (rent / payment) * 100 : null,
    requiredMonthlyRent,
    passes: payment > 0 ? rent >= requiredMonthlyRent : null,
    surplusOrShortfall: rent - requiredMonthlyRent,
  };
}

export interface CombinedDscrResult extends DscrResult {
  firstChargePayment: number;
  secondChargePayment: number;
}

/**
 * 2nd (or 3rd) charge coverage: rent has to service the *combined* payment of the existing
 * charge(s) plus the new charge, not the new charge alone.
 */
export function calculateCombinedDscr(
  firstChargePayment: number,
  secondChargePayment: number,
  monthlyRent: number,
  requiredIcrPercent: number
): CombinedDscrResult {
  const first = Math.max(0, firstChargePayment || 0);
  const second = Math.max(0, secondChargePayment || 0);
  const base = calculateDscr(first + second, monthlyRent, requiredIcrPercent);

  return { ...base, firstChargePayment: first, secondChargePayment: second };
}

/**
 * Maximum new (2nd charge) interest-only loan the rent can support, once the existing 1st
 * charge payment is already accounted for. monthlyInterestRatePercent is the 2nd charge's own
 * monthly rate (matches the convention used by the second-charge/bridging calculators).
 */
export function calculateMaxSecondChargeLoanFromRent(
  firstChargePayment: number,
  monthlyRent: number,
  requiredIcrPercent: number,
  monthlyInterestRatePercent: number
): number | null {
  if (!(requiredIcrPercent > 0) || !(monthlyInterestRatePercent > 0)) return null;

  const first = Math.max(0, firstChargePayment || 0);
  const rent = Math.max(0, monthlyRent || 0);

  const totalPaymentCapacity = rent / (requiredIcrPercent / 100);
  const maxSecondChargePayment = Math.max(0, totalPaymentCapacity - first);

  return maxSecondChargePayment / (monthlyInterestRatePercent / 100);
}
