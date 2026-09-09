/** Income multiple / loan-to-income maths. Mathematical illustrations only — see disclaimers. */

export interface IncomeInputs {
  applicant1GrossIncome: number;
  applicant2GrossIncome?: number;
}

export function totalHouseholdGrossIncome(inputs: IncomeInputs): number {
  return (inputs.applicant1GrossIncome || 0) + (inputs.applicant2GrossIncome || 0);
}

/** Returns null when income is 0/negative — LTI is undefined, not Infinity. */
export function calculateLoanToIncome(
  totalProposedBorrowing: number,
  totalGrossIncome: number
): number | null {
  if (!(totalGrossIncome > 0)) return null;
  return totalProposedBorrowing / totalGrossIncome;
}

export const STANDARD_INCOME_MULTIPLES = [4.0, 4.5, 5.0, 5.5, 6.0] as const;

export interface MaxBorrowingAtMultiple {
  multiple: number;
  maxBorrowing: number;
}

export function calculateMaxBorrowingByMultiple(
  totalGrossIncome: number,
  multiples: readonly number[] = STANDARD_INCOME_MULTIPLES
): MaxBorrowingAtMultiple[] {
  return multiples.map((multiple) => ({
    multiple,
    maxBorrowing: Math.max(0, totalGrossIncome) * multiple,
  }));
}
