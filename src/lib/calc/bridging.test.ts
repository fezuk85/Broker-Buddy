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

describe("calculateBridgingLoan - fees added to the loan or paid upfront", () => {
  const base = {
    netLoanRequired: 200_000,
    monthlyInterestRatePercent: 0.75,
    termMonths: 9,
    arrangementFeePercent: 2,
    brokerFee: 1_000,
    otherFees: 500,
  };

  it("serviced with fees left unset keeps every fee upfront (unchanged behaviour)", () => {
    const r = calculateBridgingLoan({ ...base, interestType: "serviced" });
    expect(r?.grossLoan).toBe(200_000);
    expect(r?.feesAddedToLoan).toBe(0);
    expect(r?.feesPayableUpfront).toBeCloseTo(5_500, 5); // arrangement 4,000 + broker 1,000 + other 500
    expect(r?.totalRepayment).toBeCloseTo(205_500, 5);
  });

  it("retained with fees left unset adds every fee to the loan (unchanged behaviour)", () => {
    const r = calculateBridgingLoan({ ...base, interestType: "retained" });
    expect(r?.feesPayableUpfront).toBeCloseTo(0, 5);
    expect(r?.feesAddedToLoan).toBeCloseTo(r!.totalFees, 5);
    expect(r?.totalRepayment).toBe(r?.grossLoan);
  });

  it("serviced: adding the arrangement and broker fees to the loan grows the gross loan and interest", () => {
    const r = calculateBridgingLoan({
      ...base,
      interestType: "serviced",
      arrangementFeeAddedToLoan: true,
      brokerFeeAddedToLoan: true,
    });
    const gross = 201_000 / 0.98; // (net + broker) / (1 - arrangement 2%)
    expect(r?.grossLoan).toBeCloseTo(gross, 5);
    expect(r?.arrangementFee).toBeCloseTo(gross * 0.02, 5);
    expect(r?.totalInterest).toBeCloseTo(gross * 0.0075 * 9, 5);
    expect(r?.feesAddedToLoan).toBeCloseTo(gross * 0.02 + 1_000, 5);
    expect(r?.feesPayableUpfront).toBeCloseTo(500, 5); // other fees only
    // What reaches the borrower is the net loan: gross minus the fees added to it.
    expect(r!.grossLoan - r!.feesAddedToLoan).toBeCloseTo(200_000, 5);
    expect(r?.totalRepayment).toBeCloseTo(gross + 500, 5);
  });

  it("retained: paying every fee upfront keeps them out of the gross loan", () => {
    const r = calculateBridgingLoan({
      ...base,
      interestType: "retained",
      arrangementFeeAddedToLoan: false,
      brokerFeeAddedToLoan: false,
      valuationFeeAddedToLoan: false,
      otherFeesAddedToLoan: false,
    });
    const gross = 200_000 / (1 - 0.0075 * 9); // only the retained interest is solved for
    expect(r?.grossLoan).toBeCloseTo(gross, 5);
    expect(r?.totalInterest).toBeCloseTo(gross * 0.0075 * 9, 5);
    expect(r?.feesAddedToLoan).toBe(0);
    expect(r?.feesPayableUpfront).toBeCloseTo(gross * 0.02 + 1_500, 5);
  });

  it("returns every fee line, marked added or upfront", () => {
    const r = calculateBridgingLoan({ ...base, interestType: "serviced", brokerFeeAddedToLoan: true });
    expect(r?.feeLines.map((l) => [l.label, l.addedToLoan])).toEqual([
      ["Arrangement fee", false],
      ["Broker fee", true],
      ["Other fees", false],
    ]);
  });
});
