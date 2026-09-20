import { getCalculator } from "./calculators";

/** The Case Calculator is not in the standalone-calculator registry, so it is referenced by this slug. */
export const CASE_CALCULATOR_SLUG = "mortgage-case-calculator";

export interface ScenarioTool {
  slug: string;
  /** One line: why this tool matters for this kind of case. */
  note: string;
}

export interface Scenario {
  id: string;
  title: string;
  blurb: string;
  tools: ScenarioTool[];
}

/**
 * The home page asks "What are you working on?" and shows only the tools that fit the chosen case type,
 * in the order they are usually used. Every slug must be a real calculator (scenarios.test.ts enforces this).
 */
export const SCENARIOS: Scenario[] = [
  {
    id: "residential-purchase",
    title: "Residential purchase",
    blurb: "Home mover or first-time buyer",
    tools: [
      { slug: CASE_CALCULATOR_SLUG, note: "Start here: enter the case once and see LTV, payments and affordability together." },
      { slug: "mortgage-affordability-calculator", note: "How much the income could support." },
      { slug: "loan-to-income-calculator", note: "The borrowing as a multiple of income." },
      { slug: "stamp-duty-calculator", note: "The stamp duty due on the purchase." },
      { slug: "ltv-calculator", note: "Loan-to-value and equity at the proposed loan." },
      { slug: "mortgage-repayment-calculator", note: "The monthly cost, repayment or interest-only." },
      { slug: "mortgage-term-age-calculator", note: "Whether age limits the term." },
    ],
  },
  {
    id: "remortgage",
    title: "Remortgage or further advance",
    blurb: "Existing borrower, new deal or extra borrowing",
    tools: [
      { slug: CASE_CALCULATOR_SLUG, note: "Start here: current and proposed LTV, payments and fees in one place." },
      { slug: "ltv-calculator", note: "Loan-to-value, equity and any additional borrowing." },
      { slug: "mortgage-repayment-calculator", note: "The monthly cost of the new loan." },
      { slug: "mortgage-overpayment-calculator", note: "The effect of overpaying monthly or with a lump sum." },
      { slug: "mortgage-term-age-calculator", note: "Whether age limits the term." },
    ],
  },
  {
    id: "buy-to-let",
    title: "Buy-to-let",
    blurb: "Investment property",
    tools: [
      { slug: "btl-icr-calculator", note: "Start here: rental coverage and the rent needed at 125% / 145%." },
      { slug: "rental-yield-calculator", note: "Gross yield from purchase price and rent." },
      { slug: "stamp-duty-calculator", note: "The tax due on an additional property." },
      { slug: "ltv-calculator", note: "Loan-to-value at the proposed loan." },
      { slug: "mortgage-repayment-calculator", note: "The monthly cost, repayment or interest-only." },
    ],
  },
  {
    id: "second-charge",
    title: "Second or third charge",
    blurb: "Secured loan behind an existing mortgage",
    tools: [
      { slug: "second-charge-calculator", note: "Start here: combined LTV across all charges, plus the cost of the new loan." },
      { slug: "ltv-calculator", note: "Loan-to-value and equity on the property." },
      { slug: "mortgage-term-age-calculator", note: "Whether age limits the term." },
      { slug: "mortgage-repayment-calculator", note: "The monthly cost of the loan." },
      { slug: "loan-to-income-calculator", note: "The borrowing as a multiple of income." },
    ],
  },
  {
    id: "bridging",
    title: "Bridging",
    blurb: "Short-term secured finance",
    tools: [
      { slug: "bridging-interest-calculator", note: "Start here: retained or serviced interest, fees and total cost." },
      { slug: "ltv-calculator", note: "Loan-to-value on the security." },
      { slug: "second-charge-calculator", note: "Combined LTV where other charges sit on the property." },
      { slug: "rental-yield-calculator", note: "The yield, if the property will be let." },
    ],
  },
  {
    id: "client-income",
    title: "Working out client income",
    blurb: "Salary, dividends and take-home pay",
    tools: [
      { slug: "salary-calculator", note: "Income tax, National Insurance and net pay." },
      { slug: "dividend-calculator", note: "Combined take-home for salary plus dividends." },
      { slug: "loan-to-income-calculator", note: "The borrowing as a multiple of income." },
      { slug: "mortgage-affordability-calculator", note: "How much the income could support." },
    ],
  },
];

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

export function getToolTitle(slug: string): string {
  if (slug === CASE_CALCULATOR_SLUG) return "Mortgage Case Calculator";
  return getCalculator(slug)?.title ?? slug;
}
