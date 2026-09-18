import { describe, it, expect } from "vitest";
import { calculateOverpayment } from "./overpayment";

const base = {
  balance: 200_000,
  annualInterestRatePercent: 5,
  remainingTermYears: 25,
  monthlyOverpayment: 0,
  lumpSumNow: 0,
};

describe("calculateOverpayment", () => {
  it("with no overpayment, matches the standard amortisation (£200k @ 5%, 25 yrs)", () => {
    const r = calculateOverpayment(base)!;
    expect(r.requiredMonthlyPayment).toBeCloseTo(1169.18, 1);
    expect(r.baselineMonths).toBe(300);
    expect(r.withOverpaymentMonths).toBe(300);
    expect(r.interestSaved).toBeCloseTo(0, 2);
    expect(r.monthsSaved).toBe(0);
  });

  it("baseline total interest equals payment × months − balance", () => {
    const r = calculateOverpayment(base)!;
    expect(r.baselineTotalInterest).toBeCloseTo(1169.18 * 300 - 200_000, -1);
  });

  it("a monthly overpayment shortens the term and saves interest", () => {
    const r = calculateOverpayment({ ...base, monthlyOverpayment: 200 })!;
    expect(r.monthsSaved).toBeGreaterThan(48);
    expect(r.interestSaved).toBeGreaterThan(20_000);
    expect(r.withOverpaymentMonths).toBeLessThan(300);
  });

  it("a lump sum also shortens the term and saves interest", () => {
    const r = calculateOverpayment({ ...base, lumpSumNow: 20_000 })!;
    expect(r.monthsSaved).toBeGreaterThan(0);
    expect(r.interestSaved).toBeGreaterThan(0);
  });

  it("caps a lump sum at the outstanding balance", () => {
    const r = calculateOverpayment({ ...base, lumpSumNow: 999_999 })!;
    expect(r.withOverpaymentMonths).toBe(0);
    expect(r.interestSaved).toBeCloseTo(r.baselineTotalInterest, 2);
  });

  it("reports first-year overpayment as a percentage of the balance", () => {
    const r = calculateOverpayment({ ...base, monthlyOverpayment: 500, lumpSumNow: 4_000 })!;
    expect(r.firstYearOverpaymentPercentOfBalance).toBeCloseTo(((4_000 + 6_000) / 200_000) * 100, 5);
  });

  it("handles a 0% rate", () => {
    const r = calculateOverpayment({ ...base, annualInterestRatePercent: 0, monthlyOverpayment: 100 })!;
    expect(r.baselineTotalInterest).toBeCloseTo(0, 2);
    expect(r.interestSaved).toBe(0);
    expect(r.monthsSaved).toBeGreaterThan(0);
  });

  it("returns null for an empty balance or term", () => {
    expect(calculateOverpayment({ ...base, balance: 0 })).toBeNull();
    expect(calculateOverpayment({ ...base, remainingTermYears: 0 })).toBeNull();
  });
});
