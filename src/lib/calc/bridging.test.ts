import { describe, it, expect } from "vitest";
import { calculateBridgingLoan } from "./bridging";

describe("calculateBridgingLoan - serviced interest", () => {
  it("computes interest and fees without inflating the loan", () => {
    const r = calculateBridgingLoan({
      netLoanRequired: 200_000,
      monthlyInterestRatePercent: 0.75,
      termMonths: 9,
      interestType: "serviced",
      arrangementFeePercent: 2,
      brokerFee: 1_000,
      otherFees: 500,
    });
    expect(r?.grossLoan).toBe(200_000);
    expect(r?.totalInterest).toBeCloseTo(200_000 * 0.0075 * 9, 5);
    expect(r?.arrangementFee).toBeCloseTo(4_000, 5);
    expect(r?.totalFees).toBeCloseTo(4_000 + 1_500, 5);
    expect(r?.totalRepayment).toBeCloseTo(200_000 + 5_500, 5);
  });
});

describe("calculateBridgingLoan - retained interest", () => {
  it("solves gross loan so the net advance matches the amount required", () => {
    const r = calculateBridgingLoan({
      netLoanRequired: 200_000,
      monthlyInterestRatePercent: 0.75,
      termMonths: 9,
      interestType: "retained",
      arrangementFeePercent: 2,
      brokerFee: 1_000,
      otherFees: 500,
    });
    expect(r).not.toBeNull();
    const net = r!.grossLoan - r!.totalInterest - r!.totalFees;
    expect(net).toBeCloseTo(200_000, 2);
    expect(r!.totalRepayment).toBeCloseTo(r!.grossLoan, 5);
  });

  it("returns null when the rate/term/fees make the loan unfundable", () => {
    const r = calculateBridgingLoan({
      netLoanRequired: 200_000,
      monthlyInterestRatePercent: 5,
      termMonths: 24,
      interestType: "retained",
      arrangementFeePercent: 2,
      brokerFee: 0,
      otherFees: 0,
    });
    expect(r).toBeNull();
  });
});

describe("calculateBridgingLoan - invalid inputs", () => {
  it("returns null for zero term", () => {
    expect(
      calculateBridgingLoan({
        netLoanRequired: 100_000,
        monthlyInterestRatePercent: 1,
        termMonths: 0,
        interestType: "serviced",
        arrangementFeePercent: 2,
        brokerFee: 0,
        otherFees: 0,
      })
    ).toBeNull();
  });

  it("returns null for negative net loan", () => {
    expect(
      calculateBridgingLoan({
        netLoanRequired: -1,
        monthlyInterestRatePercent: 1,
        termMonths: 6,
        interestType: "serviced",
        arrangementFeePercent: 2,
        brokerFee: 0,
        otherFees: 0,
      })
    ).toBeNull();
  });

  it("handles zero fees", () => {
    const r = calculateBridgingLoan({
      netLoanRequired: 100_000,
      monthlyInterestRatePercent: 1,
      termMonths: 6,
      interestType: "serviced",
      arrangementFeePercent: 0,
      brokerFee: 0,
      otherFees: 0,
    });
    expect(r?.totalFees).toBe(0);
  });

  it("treats a missing valuationFee the same as zero (existing callers unaffected)", () => {
    const r = calculateBridgingLoan({
      netLoanRequired: 100_000,
      monthlyInterestRatePercent: 1,
      termMonths: 6,
      interestType: "serviced",
      arrangementFeePercent: 0,
      brokerFee: 0,
      otherFees: 0,
    });
    expect(r?.totalFees).toBe(0);
  });

  it("includes the valuation fee in total fees and effective cost", () => {
    const r = calculateBridgingLoan({
      netLoanRequired: 200_000,
      monthlyInterestRatePercent: 0.75,
      termMonths: 9,
      interestType: "serviced",
      arrangementFeePercent: 2,
      brokerFee: 1_000,
      valuationFee: 350,
      otherFees: 500,
    });
    expect(r?.totalFees).toBeCloseTo(4_000 + 1_850, 5);
    expect(r?.totalRepayment).toBeCloseTo(200_000 + 5_850, 5);
  });
});
