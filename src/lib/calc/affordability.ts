/**
 * "How much can I borrow" estimate from an income multiple. Lenders decide on income multiples
 * and their own affordability models (commitments, dependants, stress rates), so this is a
 * transparent illustration of the multiple, not a lending decision.
 */
import { calculateRepaymentPayment } from "./repayment";

export const AFFORDABILITY_INCOME_MULTIPLES = [4, 4.5, 5, 5.5] as const;
export const STRESS_TEST_RATE_UPLIFT_PERCENT = 3;

export interface AffordabilityInputs {
  incomeApplicant1: number;
  incomeApplicant2: number;
  monthlyCommitments: number;
  deposit: number;
  incomeMultiple: number;
  annualInterestRatePercent: number;
  termYears: number;
}

export interface AffordabilityScenario {
  multiple: number;
  maxLoan: number;
  maxPropertyPrice: number;
  ltvPercent: number | null;
  monthlyPayment: number | null;
}

export interface AffordabilityResult extends AffordabilityScenario {
  totalIncome: number;
  stressedMonthlyPayment: number | null;
  paymentToGrossIncomePercent: number | null;
  paymentPlusCommitmentsToGrossIncomePercent: number | null;
}

function nonNegative(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function calculateAffordabilityScenario(
  inputs: AffordabilityInputs,
  multiple: number
): AffordabilityScenario {
  const totalIncome = nonNegative(inputs.incomeApplicant1) + nonNegative(inputs.incomeApplicant2);
  const maxLoan = totalIncome * nonNegative(multiple);
  const maxPropertyPrice = maxLoan + nonNegative(inputs.deposit);
  const payment = calculateRepaymentPayment({
    loanAmount: maxLoan,
    annualInterestRatePercent: inputs.annualInterestRatePercent,
    termMonths: nonNegative(inputs.termYears) * 12,
  });
  return {
    multiple,
    maxLoan,
    maxPropertyPrice,
    ltvPercent: maxPropertyPrice > 0 ? (maxLoan / maxPropertyPrice) * 100 : null,
    monthlyPayment: payment ? payment.monthlyPayment : null,
  };
}

export function calculateAffordability(inputs: AffordabilityInputs): AffordabilityResult {
  const totalIncome = nonNegative(inputs.incomeApplicant1) + nonNegative(inputs.incomeApplicant2);
  const scenario = calculateAffordabilityScenario(inputs, inputs.incomeMultiple);

  const stressed = calculateRepaymentPayment({
    loanAmount: scenario.maxLoan,
    annualInterestRatePercent: nonNegative(inputs.annualInterestRatePercent) + STRESS_TEST_RATE_UPLIFT_PERCENT,
    termMonths: nonNegative(inputs.termYears) * 12,
  });

  const grossMonthly = totalIncome / 12;
  const commitments = nonNegative(inputs.monthlyCommitments);

  return {
    ...scenario,
    totalIncome,
    stressedMonthlyPayment: stressed ? stressed.monthlyPayment : null,
    paymentToGrossIncomePercent:
      grossMonthly > 0 && scenario.monthlyPayment !== null ? (scenario.monthlyPayment / grossMonthly) * 100 : null,
    paymentPlusCommitmentsToGrossIncomePercent:
      grossMonthly > 0 && scenario.monthlyPayment !== null
        ? ((scenario.monthlyPayment + commitments) / grossMonthly) * 100
        : null,
  };
}
