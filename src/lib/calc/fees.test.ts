import { describe, it, expect } from "vitest";
import { calculateFees } from "./fees";

describe("calculateFees", () => {
  it("sums all fees when nothing is added to the loan", () => {
    const r = calculateFees({
      productFee: 999,
      addProductFeeToLoan: false,
      valuationFee: 300,
      applicationFee: 100,
      brokerFee: 500,
      otherFees: 50,
    });
    expect(r.totalFees).toBe(1949);
    expect(r.payableUpfront).toBe(1949);
    expect(r.addedToLoan).toBe(0);
  });

  it("moves the product fee out of the upfront total when added to the loan", () => {
    const r = calculateFees({
      productFee: 999,
      addProductFeeToLoan: true,
      valuationFee: 300,
      applicationFee: 0,
      brokerFee: 0,
      otherFees: 0,
    });
    expect(r.totalFees).toBe(1299);
    expect(r.addedToLoan).toBe(999);
    expect(r.payableUpfront).toBe(300);
  });

  it("treats negative fee inputs as zero", () => {
    const r = calculateFees({
      productFee: -100,
      addProductFeeToLoan: false,
      valuationFee: -50,
      applicationFee: 0,
      brokerFee: 0,
      otherFees: 0,
    });
    expect(r.totalFees).toBe(0);
    expect(r.payableUpfront).toBe(0);
    expect(r.addedToLoan).toBe(0);
  });

  it("returns all zeros when no fees are entered", () => {
    const r = calculateFees({
      productFee: 0,
      addProductFeeToLoan: false,
      valuationFee: 0,
      applicationFee: 0,
      brokerFee: 0,
      otherFees: 0,
    });
    expect(r).toEqual({ totalFees: 0, payableUpfront: 0, addedToLoan: 0 });
  });
});
