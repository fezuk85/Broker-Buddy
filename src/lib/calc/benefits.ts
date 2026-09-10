/**
 * Standardised, deterministic UK benefit calculations — Child Benefit (with the High Income
 * Child Benefit Charge) and Marriage Allowance. These are rule-based on published rates, not
 * means-tested/discretionary benefits like Universal Credit, which have too many household-
 * specific components (housing element, work allowances, taper against multiple income types)
 * to model reliably here.
 *
 * Rates are 2025/26 figures — Child Benefit is typically uprated every April, so re-verify
 * before relying on this long-term (same caveat as tax.ts).
 */

import { PERSONAL_ALLOWANCE, BASIC_RATE_LIMIT } from "./tax";

export const BENEFITS_YEAR_LABEL = "2025/26";

export interface ChildBenefitRates {
  eldestWeekly: number;
  additionalWeekly: number;
}

export const CHILD_BENEFIT_RATES: ChildBenefitRates = {
  eldestWeekly: 26.05,
  additionalWeekly: 17.25,
};

/** Gross annual Child Benefit before any High Income Child Benefit Charge. */
export function calculateAnnualChildBenefit(numberOfChildren: number, rates: ChildBenefitRates = CHILD_BENEFIT_RATES): number {
  const children = Math.max(0, Math.floor(numberOfChildren || 0));
  if (children === 0) return 0;

  const weeklyTotal = rates.eldestWeekly + (children - 1) * rates.additionalWeekly;
  return weeklyTotal * 52;
}

const HICBC_THRESHOLD = 60_000;
const HICBC_TAPER_END = 80_000; // charge reaches 100% of the benefit here

export interface ChildBenefitResult {
  numberOfChildren: number;
  grossAnnualChildBenefit: number;
  higherEarnerIncome: number;
  chargePercent: number;
  annualCharge: number;
  netAnnualChildBenefit: number;
}

/**
 * Child Benefit net of the High Income Child Benefit Charge (HICBC). The charge is based on
 * whichever partner in the household has the higher income — not household income combined —
 * and regardless of whose name the benefit is claimed under. 1% of the benefit is clawed back
 * for every £200 of income between £60,000 and £80,000; above £80,000 the full amount is
 * clawed back.
 */
export function calculateChildBenefitWithCharge(
  numberOfChildren: number,
  higherEarnerIncome: number,
  rates: ChildBenefitRates = CHILD_BENEFIT_RATES
): ChildBenefitResult {
  const grossAnnualChildBenefit = calculateAnnualChildBenefit(numberOfChildren, rates);
  const income = Math.max(0, higherEarnerIncome || 0);

  const chargePercent = income > HICBC_THRESHOLD ? Math.min(100, ((income - HICBC_THRESHOLD) / (HICBC_TAPER_END - HICBC_THRESHOLD)) * 100) : 0;
  const annualCharge = grossAnnualChildBenefit * (chargePercent / 100);

  return {
    numberOfChildren: Math.max(0, Math.floor(numberOfChildren || 0)),
    grossAnnualChildBenefit,
    higherEarnerIncome: income,
    chargePercent,
    annualCharge,
    netAnnualChildBenefit: grossAnnualChildBenefit - annualCharge,
  };
}

const MARRIAGE_ALLOWANCE_TRANSFER = 1_260; // 10% of the standard Personal Allowance, rounded to the nearest £10
const MARRIAGE_ALLOWANCE_TAX_RATE = 0.2; // always relieved at basic rate, regardless of the recipient's own marginal rate

export interface MarriageAllowanceResult {
  eligible: boolean;
  reason: string | null;
  transferAmount: number;
  annualTaxSaving: number;
}

/**
 * Marriage Allowance: a spouse/civil partner earning £12,570 or less can transfer £1,260 of
 * their unused Personal Allowance to a basic-rate-taxpayer partner, saving the recipient £252/
 * year in tax. Both conditions must hold — it's a fixed transfer, not tapered.
 */
export function calculateMarriageAllowance(lowerEarnerIncome: number, higherEarnerIncome: number): MarriageAllowanceResult {
  const lower = Math.max(0, lowerEarnerIncome || 0);
  const higher = Math.max(0, higherEarnerIncome || 0);

  if (lower > PERSONAL_ALLOWANCE) {
    return {
      eligible: false,
      reason: "The lower-earning partner's income must be £12,570 or less to have unused Personal Allowance to transfer.",
      transferAmount: 0,
      annualTaxSaving: 0,
    };
  }

  if (higher <= PERSONAL_ALLOWANCE || higher > BASIC_RATE_LIMIT) {
    return {
      eligible: false,
      reason: "The higher-earning partner must be a basic-rate taxpayer (income between £12,571 and £50,270).",
      transferAmount: 0,
      annualTaxSaving: 0,
    };
  }

  return {
    eligible: true,
    reason: null,
    transferAmount: MARRIAGE_ALLOWANCE_TRANSFER,
    annualTaxSaving: MARRIAGE_ALLOWANCE_TRANSFER * MARRIAGE_ALLOWANCE_TAX_RATE,
  };
}
