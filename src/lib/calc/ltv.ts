/**
 * LTV, equity and borrowing-capacity maths.
 * All monetary inputs are plain numbers (GBP). No currency formatting here.
 */

export interface LtvInputs {
  propertyValue: number;
  currentMortgageBalance: number;
  additionalBorrowingRequired: number;
}

export interface LtvResult {
  currentLtvPercent: number | null;
  totalProposedBorrowing: number;
  proposedLtvPercent: number | null;
  equity: number;
  equityAfterProposedBorrowing: number;
}

/** Returns null LTV when property value is 0/negative — LTV is undefined, not Infinity. */
function safeLtv(borrowing: number, propertyValue: number): number | null {
  if (!(propertyValue > 0)) return null;
  return (borrowing / propertyValue) * 100;
}

export function calculateLtv(inputs: LtvInputs): LtvResult {
  const { propertyValue, currentMortgageBalance, additionalBorrowingRequired } = inputs;
  const totalProposedBorrowing = currentMortgageBalance + additionalBorrowingRequired;

  return {
    currentLtvPercent: safeLtv(currentMortgageBalance, propertyValue),
    totalProposedBorrowing,
    proposedLtvPercent: safeLtv(totalProposedBorrowing, propertyValue),
    equity: propertyValue - currentMortgageBalance,
    equityAfterProposedBorrowing: propertyValue - totalProposedBorrowing,
  };
}

export const STANDARD_LTV_BANDS = [50, 60, 65, 70, 75, 80, 85, 90, 95] as const;

export interface MaxLoanAtLtv {
  ltvPercent: number;
  maxLoan: number;
  additionalBorrowingAvailable: number;
}

/** Additional borrowing available is floored at 0 — you can't "release" negative equity. */
export function calculateMaxLoanAtLtvBands(
  propertyValue: number,
  currentMortgageBalance: number,
  bands: readonly number[] = STANDARD_LTV_BANDS
): MaxLoanAtLtv[] {
  return bands.map((ltvPercent) => {
    const maxLoan = propertyValue > 0 ? (ltvPercent / 100) * propertyValue : 0;
    return {
      ltvPercent,
      maxLoan,
      additionalBorrowingAvailable: Math.max(0, maxLoan - currentMortgageBalance),
    };
  });
}
