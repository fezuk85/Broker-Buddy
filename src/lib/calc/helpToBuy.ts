/**
 * Help to Buy equity loan (England, 2013 to 2021): the fee that starts after year five and what it
 * costs to repay.
 *
 * Rules used, from the government's Homebuyers' Guide to the Help to Buy equity loan (gov.uk):
 * - Interest-free for the first five years.
 * - After five years a fee of 1.75% a year of the equity loan amount at purchase, rising each year by
 *   the increase in RPI plus 1% (the guide's examples at 5% RPI: 1.75% in year 6, about 1.86% in year
 *   7 and about 2.21% in year 10, i.e. the fee rate is multiplied by 1 + (RPI + 1)% each year).
 * - A £1 monthly management fee from the start until the loan is repaid.
 * - Repaying costs the equity loan share (a percentage) of the home's current market value.
 * Illustrative only: RPI is an assumption you set, the fee is capped by nothing here, and the real
 * charges are set by Homes England's Mortgage Administrator.
 */
export interface HelpToBuyInputs {
  purchasePrice: number;
  /** Equity loan as a % of the purchase price, usually 20% (40% in London). */
  equityLoanPercent: number;
  currentValue: number;
  /** Assumed yearly RPI, as a %. */
  rpiPercent: number;
  /** How many fee-paying years to show, starting at year 6. */
  yearsToShow: number;
}

export interface HelpToBuyFeeYear {
  /** Year of the loan, starting at 6. */
  year: number;
  feeRatePercent: number;
  annualFee: number;
  monthlyFee: number;
}

export interface HelpToBuyResult {
  equityLoanAmount: number;
  /** Cost of repaying the whole equity loan today: loan share x current value. */
  repayInFullToday: number;
  /** Smallest part repayment (staircasing): 10% of the current market value. */
  minimumPartRepayment: number;
  /** Change versus the original loan (positive when the home has gone up in value). */
  repaymentChange: number;
  years: HelpToBuyFeeYear[];
  totalFeesOverPeriod: number;
}

const FIRST_FEE_RATE = 1.75;
const MONTHLY_MANAGEMENT_FEE = 1;

function clean(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function calculateHelpToBuy(inputs: HelpToBuyInputs): HelpToBuyResult | null {
  const price = clean(inputs.purchasePrice);
  const pct = clean(inputs.equityLoanPercent);
  const value = clean(inputs.currentValue);
  const years = Math.min(Math.max(Math.round(clean(inputs.yearsToShow)), 0), 40);
  const rpi = Number.isFinite(inputs.rpiPercent) ? Math.max(inputs.rpiPercent, 0) : 0;
  if (price <= 0 || pct <= 0 || pct >= 100 || value <= 0 || years <= 0) return null;

  const loan = (price * pct) / 100;
  const growth = 1 + (rpi + 1) / 100;

  const rows: HelpToBuyFeeYear[] = [];
  let rate = FIRST_FEE_RATE;
  let total = 0;
  for (let i = 0; i < years; i++) {
    const annualFee = (loan * rate) / 100;
    const monthlyFee = annualFee / 12 + MONTHLY_MANAGEMENT_FEE;
    rows.push({ year: 6 + i, feeRatePercent: rate, annualFee, monthlyFee });
    total += annualFee + MONTHLY_MANAGEMENT_FEE * 12;
    rate *= growth;
  }

  const repay = (value * pct) / 100;
  return {
    equityLoanAmount: loan,
    repayInFullToday: repay,
    minimumPartRepayment: value * 0.1,
    repaymentChange: repay - loan,
    years: rows,
    totalFeesOverPeriod: total,
  };
}
