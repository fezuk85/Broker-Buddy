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

describe("calculateSecuredLoanCost fees added to the loan", () => {
  const base = {
    loanAmount: 40_000,
    monthlyInterestRatePercent: 0.6,
    termMonths: 24,
    repaymentType: "interest-only" as const,
    lenderFee: 500,
    brokerFee: 800,
    valuationFee: 200,
    otherFees: 0,
  };

  it("keeps every fee upfront by default", () => {
    const r = calculateSecuredLoanCost(base);
    expect(r?.feesAddedToLoan).toBe(0);
    expect(r?.feesPayableUpfront).toBe(1_500);
    expect(r?.totalLoanIncludingFees).toBe(40_000);
    expect(r?.monthlyPayment).toBeCloseTo(240, 5);
  });

  it("capitalises fees marked as added, raising the payment and interest", () => {
    const r = calculateSecuredLoanCost({ ...base, lenderFeeAddedToLoan: true, brokerFeeAddedToLoan: true });
    expect(r?.feesAddedToLoan).toBe(1_300); // lender 500 + broker 800
    expect(r?.feesPayableUpfront).toBe(200); // valuation stays upfront
    expect(r?.totalLoanIncludingFees).toBe(41_300);
    expect(r?.monthlyPayment).toBeCloseTo(41_300 * 0.006, 5); // 247.80
    expect(r?.totalInterest).toBeCloseTo(41_300 * 0.006 * 24, 5);
    expect(r?.totalFees).toBe(1_500);
    expect(r?.totalCostOfBorrowing).toBeCloseTo(41_300 * 0.006 * 24 + 1_500, 5);
    expect(r?.feeLines).toEqual([
      { label: "Lender fee", amount: 500, addedToLoan: true },
      { label: "Broker fee", amount: 800, addedToLoan: true },
      { label: "Valuation fee", amount: 200, addedToLoan: false },
    ]);
  });

  it("amortises the loan including added fees for repayment loans", () => {
    const withFees = calculateSecuredLoanCost({ ...base, repaymentType: "repayment", valuationFeeAddedToLoan: true });
    const direct = calculateSecuredLoanCost({
      ...base,
      repaymentType: "repayment",
      loanAmount: 40_200,
      lenderFee: 0,
      brokerFee: 0,
      valuationFee: 0,
    });
    expect(withFees?.monthlyPayment).toBeCloseTo(direct!.monthlyPayment, 8);
  });
});
