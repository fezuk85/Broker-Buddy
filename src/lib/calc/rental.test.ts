import { describe, it, expect } from "vitest";
import {
  calculateGrossYield,
  calculateIcr,
  calculateIcrExamples,
  calculateMaxLoanFromRent,
} from "./rental";

describe("calculateGrossYield", () => {
  it("computes annual rent and gross yield", () => {
    const r = calculateGrossYield(250_000, 1_200);
    expect(r.annualRent).toBe(14_400);
    expect(r.grossYieldPercent).toBeCloseTo(5.76, 3);
  });

  it("returns null yield when property value is zero", () => {
    expect(calculateGrossYield(0, 1_000).grossYieldPercent).toBeNull();
  });

  it("handles zero rent", () => {
    const r = calculateGrossYield(250_000, 0);
    expect(r.annualRent).toBe(0);
    expect(r.grossYieldPercent).toBe(0);
  });
});

describe("calculateIcr", () => {
  it("computes required rent at a given ICR and stress rate", () => {
    const r = calculateIcr(250_000, 5.5, 145);
    const monthlyStressInterest = (250_000 * 0.055) / 12;
    expect(r.monthlyInterestOnlyPayment).toBeCloseTo(monthlyStressInterest, 5);
    expect(r.requiredMonthlyRent).toBeCloseTo(monthlyStressInterest * 1.45, 5);
  });

  it("reports coverage and pass/fail against an actual rent figure", () => {
    const r = calculateIcr(250_000, 5.5, 125, 1_500);
    expect(r.actualMonthlyRent).toBe(1_500);
    expect(r.passes).toBe(r.actualMonthlyRent! >= r.requiredMonthlyRent);
    expect(r.rentalCoveragePercent).toBeCloseTo((1500 / r.requiredMonthlyRent) * 100, 5);
  });

  it("leaves pass/coverage null when no actual rent supplied", () => {
    const r = calculateIcr(250_000, 5.5, 125);
    expect(r.passes).toBeNull();
    expect(r.rentalCoveragePercent).toBeNull();
  });

  it("handles zero loan amount", () => {
    const r = calculateIcr(0, 5.5, 125);
    expect(r.requiredMonthlyRent).toBe(0);
  });
});

describe("calculateIcrExamples", () => {
  it("returns rows for 125% and 145% by default", () => {
    const rows = calculateIcrExamples(250_000, 5.5, 1_500);
    expect(rows.map((r) => r.icrPercent)).toEqual([125, 145]);
    expect(rows[1].requiredMonthlyRent).toBeGreaterThan(rows[0].requiredMonthlyRent);
  });
});

describe("calculateMaxLoanFromRent", () => {
  it("computes maximum supported loan from rent", () => {
    const maxLoan = calculateMaxLoanFromRent(1_500, 5.5, 145);
    // sanity check: feeding max loan back into ICR should reproduce ~the same required rent
    const back = calculateIcr(maxLoan!, 5.5, 145);
    expect(back.requiredMonthlyRent).toBeCloseTo(1_500, 1);
  });

  it("returns null for zero stress rate", () => {
    expect(calculateMaxLoanFromRent(1_500, 0, 145)).toBeNull();
  });

  it("returns null for zero ICR", () => {
    expect(calculateMaxLoanFromRent(1_500, 5.5, 0)).toBeNull();
  });
});
