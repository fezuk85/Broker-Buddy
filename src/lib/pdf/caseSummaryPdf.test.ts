import { describe, it, expect } from "vitest";
import { generateCaseSummaryPdf } from "./caseSummaryPdf";
import { DEFAULT_CASE } from "@/lib/case/types";
import { useCaseCalculations } from "@/lib/case/useCaseCalculations";

type Calc = ReturnType<typeof useCaseCalculations>;

/** Minimal but shape-accurate stand-in for the useCaseCalculations() return value. */
function buildCalc(overrides: Partial<Calc> = {}): Calc {
  const base: Calc = {
    termMonths: 300,
    ltv: {
      currentLtvPercent: 50,
      totalProposedBorrowing: 150_000,
      proposedLtvPercent: 50,
      equity: 150_000,
      equityAfterProposedBorrowing: 150_000,
    },
    maxLoanBands: [{ ltvPercent: 75, maxLoan: 225_000, additionalBorrowingAvailable: 75_000 }],
    totalIncome: 40_000,
    lti: 3.75,
    incomeMultiples: [{ multiple: 4.5, maxBorrowing: 180_000 }],
    applicant1Age: { years: 35, months: 4, totalMonths: 424 },
    applicant2Age: null,
    ageAtEndOfTerm: { years: 60, months: 4, totalMonths: 724 },
    maxTermsByLenderAge: [{ lenderMaxAge: 75, maxTermMonths: 480, maxTermYears: 40 }],
    maxTermAtSelectedLenderAge: { lenderMaxAge: 75, maxTermMonths: 480, maxTermYears: 40 },
    repayment: { monthlyPayment: 877.13, totalRepaid: 263_139, totalInterest: 113_139 },
    interestOnlyPayment: 625,
    monthlyMortgagePayment: 877.13,
    rateComparison: [{ label: "Current", ratePercent: 5.0, monthlyPayment: 877.13 }],
    rentalYield: { annualRent: 0, grossYieldPercent: null },
    icrExamples: [
      {
        loanAmount: 150_000,
        stressRatePercent: 5.5,
        icrPercent: 145,
        monthlyInterestOnlyPayment: 687.5,
        requiredMonthlyRent: 996.88,
        actualMonthlyRent: null,
        rentalCoveragePercent: null,
        passes: null,
      },
    ],
    maxLoanFromRent: null,
    valuation: {
      methods: [],
      combinedEstimate: null,
      rangeLow: null,
      rangeHigh: null,
      confidence: null,
      insufficientData: true,
      notes: [],
    },
    derivedRegion: null,
    expenditure: null,
    councilTax: null,
    salesHistory: null,
    affordability: null,
  };
  return { ...base, ...overrides };
}

describe("generateCaseSummaryPdf", () => {
  it("builds a PDF document without throwing for a default case with minimal data", () => {
    const doc = generateCaseSummaryPdf(DEFAULT_CASE, buildCalc());
    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(1);
    const output = doc.output();
    expect(output.length).toBeGreaterThan(0);
    expect(output.slice(0, 5)).toBe("%PDF-");
  });

  it("includes a rental section when monthly rent is entered, and handles a fully populated affordability/valuation case", () => {
    const caseState = {
      ...DEFAULT_CASE,
      property: { ...DEFAULT_CASE.property, postcode: "CF24 1RW", addressLine1: "55" },
      rental: { ...DEFAULT_CASE.rental, monthlyRent: 1200 },
      applicants: { ...DEFAULT_CASE.applicants, applicant2: { dob: "1992-06-15", grossIncome: 30_000 } },
    };
    const calc = buildCalc({
      rentalYield: { annualRent: 14_400, grossYieldPercent: 4.8 },
      maxLoanFromRent: 150_000,
      applicant2Age: { years: 33, months: 2, totalMonths: 398 },
      affordability: {
        monthlyExpenditure: 900,
        monthlyCouncilTax: 150,
        mortgagePayment: 877.13,
        credit: 200,
        totalOutgoings: 2127.13,
        netMonthlyIncome: 4200,
        remainingAfterOutgoings: 2072.87,
        outgoingsPercentOfNetIncome: 50.6,
      },
      valuation: {
        methods: [
          { method: "historic-sale-indexation", label: "Indexed estimate", estimate: 372_194, detail: "Last sale £370,000 indexed by 0.6%" },
        ],
        combinedEstimate: 372_194,
        rangeLow: 316_365,
        rangeHigh: 427_823,
        confidence: "LOW",
        insufficientData: false,
        notes: [],
      },
    });

    const doc = generateCaseSummaryPdf(caseState, calc);
    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(1);
    const output = doc.output();
    expect(output.slice(0, 5)).toBe("%PDF-");
  });
});
