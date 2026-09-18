import { describe, it, expect } from "vitest";
import { calculateAffordability, calculateAffordabilityScenario } from "./affordability";

const base = {
  incomeApplicant1: 50_000,
  incomeApplicant2: 30_000,
  monthlyCommitments: 200,
  deposit: 40_000,
  incomeMultiple: 4.5,
  annualInterestRatePercent: 5,
  termYears: 25,
};

describe("calculateAffordability", () => {
  it("combines both incomes and applies the multiple", () => {
    const r = calculateAffordability(base);
    expect(r.totalIncome).toBe(80_000);
    expect(r.maxLoan).toBe(360_000);
    expect(r.maxPropertyPrice).toBe(400_000);
    expect(r.ltvPercent).toBeCloseTo(90, 5);
  });

  it("computes the monthly payment consistently with the repayment maths (£360k @ 5%, 25 yrs)", () => {
    const r = calculateAffordability(base);
    expect(r.monthlyPayment).toBeCloseTo(2104.52, 1);
  });

  it("stress payment at +3 percentage points is higher than the base payment", () => {
    const r = calculateAffordability(base);
    expect(r.stressedMonthlyPayment!).toBeGreaterThan(r.monthlyPayment!);
  });

  it("reports payment and payment+commitments as a share of gross monthly income", () => {
    const r = calculateAffordability(base);
    const grossMonthly = 80_000 / 12;
    expect(r.paymentToGrossIncomePercent).toBeCloseTo((r.monthlyPayment! / grossMonthly) * 100, 5);
    expect(r.paymentPlusCommitmentsToGrossIncomePercent).toBeGreaterThan(r.paymentToGrossIncomePercent!);
  });

  it("handles zero income without dividing by zero", () => {
    const r = calculateAffordability({ ...base, incomeApplicant1: 0, incomeApplicant2: 0 });
    expect(r.maxLoan).toBe(0);
    expect(r.ltvPercent).toBe(0);
    expect(r.paymentToGrossIncomePercent).toBeNull();
  });

  it("ignores negative or invalid inputs rather than producing negative borrowing", () => {
    const r = calculateAffordabilityScenario({ ...base, incomeApplicant1: -10_000, incomeApplicant2: Number.NaN }, 4.5);
    expect(r.maxLoan).toBe(0);
  });
});
