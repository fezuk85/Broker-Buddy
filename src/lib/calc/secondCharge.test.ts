import { describe, it, expect } from "vitest";
import { calculateCombinedCharges, calculateSecuredLoanCost } from "./secondCharge";

describe("calculateCombinedCharges", () => {
  it("computes combined LTV across first and second charge, plus a new third charge", () => {
    const r = calculateCombinedCharges(
      400_000,
      [
        { label: "1st charge", balance: 150_000 },
        { label: "2nd charge", balance: 50_000 },
      ],
      40_000
    );
    expect(r.combinedExistingBalance).toBe(200_000);
    expect(r.currentCombinedLtvPercent).toBeCloseTo(50, 5);
    expect(r.totalProposedBalance).toBe(240_000);
    expect(r.proposedCombinedLtvPercent).toBeCloseTo(60, 5);
    expect(r.equity).toBe(200_000);
    expect(r.equityAfterNewCharge).toBe(160_000);
  });

  it("builds a correct per-charge cumulative breakdown", () => {
    const r = calculateCombinedCharges(
      200_000,
      [
        { label: "1st charge", balance: 100_000 },
        { label: "2nd charge", balance: 20_000 },
      ],
      0
    );
    expect(r.existingCharges[0].cumulativeBalance).toBe(100_000);
    expect(r.existingCharges[0].cumulativeLtvPercent).toBeCloseTo(50, 5);
    expect(r.existingCharges[1].cumulativeBalance).toBe(120_000);
    expect(r.existingCharges[1].cumulativeLtvPercent).toBeCloseTo(60, 5);
  });

  it("handles no existing charges (first charge scenario)", () => {
    const r = calculateCombinedCharges(300_000, [], 100_000);
    expect(r.combinedExistingBalance).toBe(0);
    expect(r.currentCombinedLtvPercent).toBe(0);
    expect(r.proposedCombinedLtvPercent).toBeCloseTo(33.333, 2);
  });

  it("returns null LTV when property value is zero", () => {
    const r = calculateCombinedCharges(0, [{ label: "1st", balance: 100_000 }], 0);
    expect(r.currentCombinedLtvPercent).toBeNull();
  });

  it("handles negative equity across combined charges", () => {
    const r = calculateCombinedCharges(150_000, [{ label: "1st", balance: 140_000 }], 30_000);
    expect(r.equityAfterNewCharge).toBe(-20_000);
    expect(r.proposedCombinedLtvPercent).toBeCloseTo((170_000 / 150_000) * 100, 5);
  });
});

describe("calculateSecuredLoanCost", () => {
  it("computes interest-only monthly payment and total cost with fees", () => {
    const r = calculateSecuredLoanCost({
      loanAmount: 40_000,
      monthlyInterestRatePercent: 0.6,
      termMonths: 24,
      repaymentType: "interest-only",
      lenderFee: 500,
      brokerFee: 800,
      valuationFee: 200,
      otherFees: 0,
    });
    expect(r?.monthlyPayment).toBeCloseTo(240, 5);
    expect(r?.totalInterest).toBeCloseTo(240 * 24, 5);
    expect(r?.totalFees).toBe(1_500);
    expect(r?.totalCostOfBorrowing).toBeCloseTo(240 * 24 + 1_500, 5);
  });

  it("computes repayment monthly payment via standard amortisation", () => {
    const r = calculateSecuredLoanCost({
      loanAmount: 40_000,
      monthlyInterestRatePercent: 0.6,
      termMonths: 24,
      repaymentType: "repayment",
      lenderFee: 0,
      brokerFee: 0,
      valuationFee: 0,
      otherFees: 0,
    });
    expect(r?.monthlyPayment).toBeGreaterThan(0);
    expect(r?.totalInterest).toBeGreaterThan(0);
    expect(r?.totalFees).toBe(0);
  });

  it("returns null for zero term", () => {
    expect(
      calculateSecuredLoanCost({
        loanAmount: 40_000,
        monthlyInterestRatePercent: 0.6,
        termMonths: 0,
        repaymentType: "repayment",
        lenderFee: 0,
        brokerFee: 0,
        valuationFee: 0,
        otherFees: 0,
      })
    ).toBeNull();
  });

  it("handles zero loan amount", () => {
    const r = calculateSecuredLoanCost({
      loanAmount: 0,
      monthlyInterestRatePercent: 0.6,
      termMonths: 12,
      repaymentType: "repayment",
      lenderFee: 100,
      brokerFee: 0,
      valuationFee: 0,
      otherFees: 0,
    });
    expect(r?.monthlyPayment).toBe(0);
    expect(r?.totalCostOfBorrowing).toBe(100);
  });

  it("returns null for negative loan amount", () => {
    expect(
      calculateSecuredLoanCost({
        loanAmount: -100,
        monthlyInterestRatePercent: 0.6,
        termMonths: 12,
        repaymentType: "repayment",
        lenderFee: 0,
        brokerFee: 0,
        valuationFee: 0,
        otherFees: 0,
      })
    ).toBeNull();
  });
});
