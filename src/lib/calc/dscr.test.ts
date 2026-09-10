import { describe, it, expect } from "vitest";
import {
  STANDARD_ICR_PERCENT_BY_TAX_STATUS,
  calculateDscr,
  calculateCombinedDscr,
  calculateMaxSecondChargeLoanFromRent,
} from "./dscr";

describe("STANDARD_ICR_PERCENT_BY_TAX_STATUS", () => {
  it("requires more coverage from higher/additional-rate individual taxpayers", () => {
    expect(STANDARD_ICR_PERCENT_BY_TAX_STATUS["basic-rate"]).toBe(125);
    expect(STANDARD_ICR_PERCENT_BY_TAX_STATUS["higher-additional-rate"]).toBe(145);
    expect(STANDARD_ICR_PERCENT_BY_TAX_STATUS["limited-company"]).toBe(125);
  });
});

describe("calculateDscr", () => {
  it("computes DSCR% and required rent from an actual payment", () => {
    const r = calculateDscr(1000, 1300, 125);
    expect(r.dscrPercent).toBeCloseTo(130, 5);
    expect(r.requiredMonthlyRent).toBeCloseTo(1250, 5);
    expect(r.passes).toBe(true);
    expect(r.surplusOrShortfall).toBeCloseTo(50, 5);
  });

  it("fails when rent doesn't cover the required ICR", () => {
    const r = calculateDscr(1000, 1200, 145);
    expect(r.requiredMonthlyRent).toBeCloseTo(1450, 5);
    expect(r.passes).toBe(false);
    expect(r.surplusOrShortfall).toBeLessThan(0);
  });

  it("handles zero payment (no charge) as undefined DSCR", () => {
    const r = calculateDscr(0, 1000, 125);
    expect(r.dscrPercent).toBeNull();
    expect(r.passes).toBeNull();
  });

  it("handles zero rent", () => {
    const r = calculateDscr(1000, 0, 125);
    expect(r.dscrPercent).toBe(0);
    expect(r.passes).toBe(false);
  });

  it("treats negative inputs as zero", () => {
    const r = calculateDscr(-500, -100, 125);
    expect(r.monthlyPayment).toBe(0);
    expect(r.monthlyRent).toBe(0);
  });

  it("passes exactly at the required threshold", () => {
    const r = calculateDscr(1000, 1250, 125);
    expect(r.passes).toBe(true);
    expect(r.surplusOrShortfall).toBeCloseTo(0, 5);
  });
});

describe("calculateCombinedDscr", () => {
  it("checks rent against the combined 1st + 2nd charge payment, not the 2nd charge alone", () => {
    const r = calculateCombinedDscr(700, 300, 1300, 125);
    expect(r.monthlyPayment).toBe(1000);
    expect(r.dscrPercent).toBeCloseTo(130, 5);
    expect(r.passes).toBe(true);
  });

  it("fails when combined payment is not covered even though the 2nd charge alone would be", () => {
    // 2nd charge alone (£300) at 125% would need £375 rent - easily covered by £1,000 rent.
    // But combined with a large 1st charge, the same rent falls short.
    const r = calculateCombinedDscr(900, 300, 1000, 125);
    expect(r.monthlyPayment).toBe(1200);
    expect(r.requiredMonthlyRent).toBeCloseTo(1500, 5);
    expect(r.passes).toBe(false);
  });

  it("handles zero first charge (effectively a 1st charge DSCR check)", () => {
    const r = calculateCombinedDscr(0, 1000, 1300, 125);
    expect(r.monthlyPayment).toBe(1000);
    expect(r.passes).toBe(true);
  });
});

describe("calculateMaxSecondChargeLoanFromRent", () => {
  it("computes the max 2nd charge loan after accounting for the 1st charge payment", () => {
    // rent capacity at 125% = 1000/1.25 = 800/month total payment capacity
    // minus existing 1st charge payment of 500 = 300/month available for the 2nd charge
    // at 0.5%/month rate: loan = 300 / 0.005 = 60,000
    const maxLoan = calculateMaxSecondChargeLoanFromRent(500, 1000, 125, 0.5);
    expect(maxLoan).toBeCloseTo(60_000, 2);
  });

  it("returns 0-loan-supporting payment when the 1st charge already exceeds capacity", () => {
    const maxLoan = calculateMaxSecondChargeLoanFromRent(2000, 1000, 125, 0.5);
    expect(maxLoan).toBe(0);
  });

  it("returns null for zero ICR", () => {
    expect(calculateMaxSecondChargeLoanFromRent(500, 1000, 0, 0.5)).toBeNull();
  });

  it("returns null for zero rate", () => {
    expect(calculateMaxSecondChargeLoanFromRent(500, 1000, 125, 0)).toBeNull();
  });

  it("round-trips through calculateCombinedDscr at exactly the threshold", () => {
    const maxLoan = calculateMaxSecondChargeLoanFromRent(700, 1300, 125, 0.5)!;
    const secondChargePayment = maxLoan * (0.5 / 100);
    const check = calculateCombinedDscr(700, secondChargePayment, 1300, 125);
    expect(check.surplusOrShortfall).toBeCloseTo(0, 1);
  });
});
