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
    expect(r).toMatchObject({ totalFees: 0, payableUpfront: 0, addedToLoan: 0, lines: [] });
  });

  it("lets every fee be added to the loan or paid upfront", () => {
    const r = calculateFees({
      productFee: 1_000,
      addProductFeeToLoan: false,
      valuationFee: 300,
      addValuationFeeToLoan: true,
      applicationFee: 100,
      addApplicationFeeToLoan: false,
      brokerFee: 500,
      addBrokerFeeToLoan: true,
      otherFees: 50,
      addOtherFeesToLoan: true,
    });
    expect(r.totalFees).toBe(1_950);
    expect(r.addedToLoan).toBe(850); // valuation 300 + broker 500 + other 50
    expect(r.payableUpfront).toBe(1_100); // product 1,000 + application 100
    expect(r.lines).toEqual([
      { label: "Lender/product fee", amount: 1_000, addedToLoan: false },
      { label: "Valuation fee", amount: 300, addedToLoan: true },
      { label: "Application fee", amount: 100, addedToLoan: false },
      { label: "Broker fee", amount: 500, addedToLoan: true },
      { label: "Other fees", amount: 50, addedToLoan: true },
    ]);
  });

  it("leaves fees with no amount out of the lines", () => {
    const r = calculateFees({
      productFee: 0,
      addProductFeeToLoan: true,
      valuationFee: 250,
      applicationFee: 0,
      brokerFee: 0,
      otherFees: 0,
    });
    expect(r.lines).toEqual([{ label: "Valuation fee", amount: 250, addedToLoan: false }]);
  });
});
