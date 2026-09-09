/** Rental yield and BTL interest-coverage-ratio (ICR) maths. Mathematical tool only, not lender criteria. */

export interface YieldResult {
  annualRent: number;
  grossYieldPercent: number | null;
}

export function calculateGrossYield(propertyValue: number, monthlyRent: number): YieldResult {
  const annualRent = Math.max(0, monthlyRent) * 12;
  const grossYieldPercent = propertyValue > 0 ? (annualRent / propertyValue) * 100 : null;
  return { annualRent, grossYieldPercent };
}

export interface IcrResult {
  loanAmount: number;
  stressRatePercent: number;
  icrPercent: number;
  monthlyInterestOnlyPayment: number;
  requiredMonthlyRent: number;
  actualMonthlyRent: number | null;
  rentalCoveragePercent: number | null;
  passes: boolean | null;
}

/** Required monthly rent = monthly stressed interest-only payment x ICR. */
export function calculateIcr(
  loanAmount: number,
  stressRatePercent: number,
  icrPercent: number,
  actualMonthlyRent?: number
): IcrResult {
  const monthlyInterestOnlyPayment = (Math.max(0, loanAmount) * (stressRatePercent / 100)) / 12;
  const requiredMonthlyRent = monthlyInterestOnlyPayment * (icrPercent / 100);
  const rentalCoveragePercent =
    actualMonthlyRent != null && requiredMonthlyRent > 0
      ? (actualMonthlyRent / requiredMonthlyRent) * 100
      : null;

  return {
    loanAmount,
    stressRatePercent,
    icrPercent,
    monthlyInterestOnlyPayment,
    requiredMonthlyRent,
    actualMonthlyRent: actualMonthlyRent ?? null,
    rentalCoveragePercent,
    passes: actualMonthlyRent != null ? actualMonthlyRent >= requiredMonthlyRent : null,
  };
}

export const STANDARD_ICR_BANDS = [125, 145] as const;

export function calculateIcrExamples(
  loanAmount: number,
  stressRatePercent: number,
  actualMonthlyRent?: number,
  icrBands: readonly number[] = STANDARD_ICR_BANDS
): IcrResult[] {
  return icrBands.map((icrPercent) =>
    calculateIcr(loanAmount, stressRatePercent, icrPercent, actualMonthlyRent)
  );
}

/** Maximum loan supported by a given monthly rent under a stress rate and ICR requirement. */
export function calculateMaxLoanFromRent(
  monthlyRent: number,
  stressRatePercent: number,
  icrPercent: number
): number | null {
  if (!(stressRatePercent > 0) || !(icrPercent > 0)) return null;
  const monthlyStressInterestPerPound = stressRatePercent / 100 / 12;
  const requiredMonthlyInterestCapacity = Math.max(0, monthlyRent) / (icrPercent / 100);
  return requiredMonthlyInterestCapacity / monthlyStressInterestPerPound;
}
