import { describe, it, expect } from "vitest";
import { calculateHelpToBuy } from "./helpToBuy";

const base = {
  purchasePrice: 200_000,
  equityLoanPercent: 20,
  currentValue: 200_000,
  rpiPercent: 5,
  yearsToShow: 5,
};

describe("calculateHelpToBuy", () => {
  it("equity loan is the percentage of the purchase price", () => {
    expect(calculateHelpToBuy(base)!.equityLoanAmount).toBe(40_000);
  });

  it("year 6 fee is 1.75% of the loan, with the £1 monthly management fee on top (the government's £40,000 example gives about £59 a month)", () => {
    const r = calculateHelpToBuy(base)!;
    expect(r.years[0].year).toBe(6);
    expect(r.years[0].feeRatePercent).toBeCloseTo(1.75, 6);
    expect(r.years[0].annualFee).toBeCloseTo(700, 6);
    expect(r.years[0].monthlyFee).toBeCloseTo(59.33, 2);
  });

  it("matches the guide's examples at 5% RPI: about 1.86% in year 7 and 2.21% in year 10", () => {
    const r = calculateHelpToBuy({ ...base, yearsToShow: 5 })!;
    expect(r.years[1].feeRatePercent).toBeCloseTo(1.855, 3);
    expect(r.years[4].feeRatePercent).toBeCloseTo(2.209, 3);
  });

  it("repaying costs the loan share of the current value; the minimum part repayment is 10% of value", () => {
    const r = calculateHelpToBuy({ ...base, currentValue: 250_000 })!;
    expect(r.repayInFullToday).toBe(50_000);
    expect(r.repaymentChange).toBe(10_000);
    expect(r.minimumPartRepayment).toBe(25_000);
  });

  it("totals the fees over the period including the management fee", () => {
    const r = calculateHelpToBuy({ ...base, yearsToShow: 1 })!;
    expect(r.totalFeesOverPeriod).toBeCloseTo(700 + 12, 6);
  });

  it("returns null for unusable inputs", () => {
    expect(calculateHelpToBuy({ ...base, purchasePrice: 0 })).toBeNull();
    expect(calculateHelpToBuy({ ...base, equityLoanPercent: 100 })).toBeNull();
    expect(calculateHelpToBuy({ ...base, yearsToShow: 0 })).toBeNull();
  });
});
