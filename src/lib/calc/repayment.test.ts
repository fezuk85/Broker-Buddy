import { describe, it, expect } from "vitest";
import {
  calculateRepaymentPayment,
  calculateInterestOnlyPayment,
  calculateRateComparison,
} from "./repayment";

describe("calculateRepaymentPayment", () => {
  it("matches a known amortisation result (£200,000 @ 5% over 25yrs)", () => {
    const r = calculateRepaymentPayment({
      loanAmount: 200_000,
      annualInterestRatePercent: 5,
      termMonths: 300,
    });
    expect(r?.monthlyPayment).toBeCloseTo(1169.18, 1);
    expect(r?.totalRepaid).toBeCloseTo(1169.18 * 300, 0);
    expect(r?.totalInterest).toBeCloseTo(r!.totalRepaid - 200_000, 5);
  });

  it("handles 0% interest as straight-line repayment", () => {
    const r = calculateRepaymentPayment({ loanAmount: 120_000, annualInterestRatePercent: 0, termMonths: 120 });
    expect(r?.monthlyPayment).toBeCloseTo(1000, 5);
    expect(r?.totalInterest).toBeCloseTo(0, 5);
  });

  it("handles zero loan amount", () => {
    const r = calculateRepaymentPayment({ loanAmount: 0, annualInterestRatePercent: 5, termMonths: 120 });
    expect(r).toEqual({ monthlyPayment: 0, totalRepaid: 0, totalInterest: 0 });
  });

  it("returns null for zero term", () => {
    expect(calculateRepaymentPayment({ loanAmount: 100_000, annualInterestRatePercent: 5, termMonths: 0 })).toBeNull();
  });

  it("returns null for negative loan amount", () => {
    expect(calculateRepaymentPayment({ loanAmount: -100, annualInterestRatePercent: 5, termMonths: 120 })).toBeNull();
  });

  it("handles decimal interest rates", () => {
    const r = calculateRepaymentPayment({ loanAmount: 250_000, annualInterestRatePercent: 5.49, termMonths: 300 });
    expect(r?.monthlyPayment).toBeGreaterThan(0);
    expect(Number.isFinite(r?.monthlyPayment)).toBe(true);
  });
});

describe("calculateInterestOnlyPayment", () => {
  it("computes simple monthly interest", () => {
    expect(calculateInterestOnlyPayment(200_000, 6)).toBeCloseTo(1000, 5);
  });

  it("handles zero rate", () => {
    expect(calculateInterestOnlyPayment(200_000, 0)).toBe(0);
  });

  it("returns null for negative rate", () => {
    expect(calculateInterestOnlyPayment(200_000, -1)).toBeNull();
  });
});

describe("calculateRateComparison", () => {
  it("produces 4 rows with increasing payment as rate rises (repayment)", () => {
    const rows = calculateRateComparison(200_000, 5, 300, "repayment");
    expect(rows).toHaveLength(4);
    const payments = rows.map((r) => r.monthlyPayment!);
    for (let i = 1; i < payments.length; i++) {
      expect(payments[i]).toBeGreaterThan(payments[i - 1]);
    }
  });

  it("produces increasing payment for interest-only", () => {
    const rows = calculateRateComparison(200_000, 5, 300, "interest-only");
    expect(rows[0].monthlyPayment).toBeCloseTo(200_000 * 0.05 / 12, 5);
    expect(rows[3].ratePercent).toBeCloseTo(7, 5);
  });
});
