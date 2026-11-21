/**
 * Second charge vs remortgaging now (paying an early repayment charge, ERC).
 *
 * Both routes raise the same extra cash. Route A leaves the existing mortgage untouched and adds a
 * separate second charge loan. Route B pays the ERC, moves the whole balance to a new mortgage and
 * borrows the extra on top. Costs of both routes (fees, and the ERC for route B) are added to the
 * relevant loan so nothing is paid upfront, which keeps the comparison like-for-like.
 *
 * "Cost" over a chosen horizon = everything paid in that period + what is still owed at the end -
 * the money received. That captures interest, fees and the ERC, and it does not matter that the two
 * routes amortise differently. It is an illustration with constant rates, not a quote or advice.
 */
import { calculateRepaymentPayment } from "./repayment";

export interface ErcBreakEvenInputs {
  existingBalance: number;
  existingRatePercent: number;
  remainingTermYears: number;
  extraBorrowing: number;
  /** ERC as a % of the existing balance, charged if the mortgage is replaced now. */
  ercPercent: number;
  newMortgageRatePercent: number;
  secondChargeRatePercent: number;
  secondChargeTermYears: number;
  secondChargeFees: number;
  remortgageFees: number;
  horizonYears: number;
}

export interface ErcBreakEvenResult {
  secondChargeCost: number;
  remortgageCost: number;
  /** Positive: the second charge is cheaper over the horizon by this much. Negative: remortgaging is. */
  secondChargeAdvantage: number;
  cheaperRoute: "second-charge" | "remortgage" | "level";
  ercAmount: number;
  /** Monthly cost of the existing mortgage plus the second charge. */
  secondChargeMonthlyTotal: number;
  /** Monthly cost of the new, larger mortgage. */
  remortgageMonthly: number;
  /**
   * ERC % at which the two routes cost the same over the horizon. null when the second charge is
   * already cheaper with no ERC at all (the rate on the existing mortgage is the reason), or when
   * remortgaging stays cheaper even with a 15% ERC.
   */
  breakEvenErcPercent: number | null;
  horizonMonths: number;
}

const MAX_BREAK_EVEN_ERC = 15;

function clean(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** Fixed payment; returns total paid and what is still owed after `months`. */
function run(principal: number, ratePercent: number, termMonths: number, months: number) {
  const pay = calculateRepaymentPayment({
    loanAmount: principal,
    annualInterestRatePercent: ratePercent,
    termMonths,
  });
  if (!pay) return null;
  const r = ratePercent / 100 / 12;
  let owed = principal;
  let paid = 0;
  for (let m = 0; m < months && owed > 0.005; m++) {
    const interest = owed * r;
    const payment = Math.min(pay.monthlyPayment, owed + interest);
    paid += payment;
    owed = owed + interest - payment;
  }
  return { monthlyPayment: pay.monthlyPayment, paid, owed: Math.max(owed, 0) };
}

function costs(inputs: ErcBreakEvenInputs, ercPercent: number) {
  const bal = clean(inputs.existingBalance);
  const extra = clean(inputs.extraBorrowing);
  const termMonths = Math.round(clean(inputs.remainingTermYears) * 12);
  const scMonths = Math.round(clean(inputs.secondChargeTermYears) * 12);
  const horizon = Math.min(Math.round(clean(inputs.horizonYears) * 12), termMonths);
  if (bal <= 0 || extra <= 0 || termMonths <= 0 || scMonths <= 0 || horizon <= 0) return null;

  const erc = (bal * clean(ercPercent)) / 100;

  const old = run(bal, inputs.existingRatePercent, termMonths, horizon);
  const second = run(extra + clean(inputs.secondChargeFees), inputs.secondChargeRatePercent, scMonths, horizon);
  const fresh = run(bal + extra + erc + clean(inputs.remortgageFees), inputs.newMortgageRatePercent, termMonths, horizon);
  if (!old || !second || !fresh) return null;

  const received = bal + extra;
  return {
    secondChargeCost: old.paid + old.owed + second.paid + second.owed - received,
    remortgageCost: fresh.paid + fresh.owed - received,
    erc,
    secondChargeMonthlyTotal: old.monthlyPayment + second.monthlyPayment,
    remortgageMonthly: fresh.monthlyPayment,
    horizon,
  };
}

export function calculateErcBreakEven(inputs: ErcBreakEvenInputs): ErcBreakEvenResult | null {
  const base = costs(inputs, inputs.ercPercent);
  if (!base) return null;

  const diff = base.remortgageCost - base.secondChargeCost;
  const cheaperRoute = Math.abs(diff) < 1 ? "level" : diff > 0 ? "second-charge" : "remortgage";

  // Bisection on ERC %: remortgage cost rises with the ERC, the second charge cost does not.
  let breakEven: number | null = null;
  const atZero = costs(inputs, 0)!;
  const atMax = costs(inputs, MAX_BREAK_EVEN_ERC)!;
  if (atZero.remortgageCost < atZero.secondChargeCost && atMax.remortgageCost > atMax.secondChargeCost) {
    let lo = 0;
    let hi = MAX_BREAK_EVEN_ERC;
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2;
      const c = costs(inputs, mid)!;
      if (c.remortgageCost < c.secondChargeCost) lo = mid;
      else hi = mid;
    }
    breakEven = (lo + hi) / 2;
  }

  return {
    secondChargeCost: base.secondChargeCost,
    remortgageCost: base.remortgageCost,
    secondChargeAdvantage: diff,
    cheaperRoute,
    ercAmount: base.erc,
    secondChargeMonthlyTotal: base.secondChargeMonthlyTotal,
    remortgageMonthly: base.remortgageMonthly,
    breakEvenErcPercent: breakEven,
    horizonMonths: base.horizon,
  };
}
