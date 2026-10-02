import { describe, it, expect } from "vitest";
import { calculateBridgingLoan, calculateCombinedCharges, calculateCombinedDscr, calculateSecuredLoanCost } from "@/lib/calc";
import { generateBridgingQuotationPdf } from "./bridgingQuotationPdf";
import { generateSecondChargeQuotationPdf } from "./secondChargeQuotationPdf";

describe("quotation PDFs show how each fee is paid", () => {
  it("second charge quotation lists each fee as added to the loan or paid upfront", () => {
    const cost = calculateSecuredLoanCost({
      loanAmount: 40_000,
      monthlyInterestRatePercent: 0.6,
      termMonths: 24,
      repaymentType: "interest-only",
      lenderFee: 500,
      brokerFee: 800,
      valuationFee: 200,
      otherFees: 0,
      lenderFeeAddedToLoan: true,
    });
    const charges = [{ label: "1st charge", balance: 150_000 }];
    const output = generateSecondChargeQuotationPdf({
      clientReference: "",
      quotationDate: "",
      propertyValue: 400_000,
      charges,
      newChargeAmount: 40_000,
      annualRatePercent: 7.2,
      termMonths: 24,
      repaymentType: "interest-only",
      lenderFee: 500,
      brokerFee: 800,
      valuationFee: 200,
      otherFees: 0,
      lenderFeeAddedToLoan: true,
      brokerFeeAddedToLoan: false,
      valuationFeeAddedToLoan: false,
      otherFeesAddedToLoan: false,
      combined: calculateCombinedCharges(400_000, charges, cost!.totalLoanIncludingFees),
      cost,
      isRental: false,
      firstChargePayment: 0,
      monthlyRent: 0,
      requiredIcrPercent: 125,
      combinedDscr: calculateCombinedDscr(0, 0, 0, 125),
      maxSecondChargeLoanFromRent: null,
    }).output();
    expect(output).toContain("Lender fee");
    expect(output).toContain("Added to the loan");
    expect(output).toContain("Paid upfront");
    expect(output).toContain("Fees added to the loan");
  });

  it("bridging quotation lists each fee as added to the loan or paid upfront", () => {
    const flags = { arrangementFeeAddedToLoan: true, brokerFeeAddedToLoan: false, valuationFeeAddedToLoan: false, otherFeesAddedToLoan: false };
    const result = calculateBridgingLoan({
      netLoanRequired: 200_000,
      monthlyInterestRatePercent: 0.75,
      termMonths: 9,
      interestType: "serviced",
      arrangementFeePercent: 2,
      brokerFee: 1_000,
      valuationFee: 350,
      otherFees: 0,
      ...flags,
    });
    const output = generateBridgingQuotationPdf({
      clientReference: "",
      quotationDate: "",
      netLoan: 200_000,
      monthlyRate: 0.75,
      termMonths: 9,
      interestType: "serviced",
      arrangementFeePercent: 2,
      brokerFee: 1_000,
      valuationFee: 350,
      otherFees: 0,
      ...flags,
      result,
    }).output();
    expect(output).toContain("Arrangement fee");
    expect(output).toContain("Added to the loan");
    expect(output).toContain("Paid upfront");
  });
});
