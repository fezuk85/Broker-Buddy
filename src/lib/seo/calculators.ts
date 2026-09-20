// Registry of every standalone calculator. Drives the homepage grid, footer links, "related
// calculators" blocks, breadcrumbs/structured data and the sitemap — add new calculators here.

export interface CalculatorInfo {
  slug: string;
  title: string;
  shortTitle: string;
  desc: string;
  related: string[];
}

export const CALCULATORS: CalculatorInfo[] = [
  {
    slug: "stamp-duty-calculator",
    title: "Stamp Duty Calculator",
    shortTitle: "Stamp Duty",
    desc: "SDLT, Land Transaction Tax (Wales) and LBTT (Scotland) — standard, first-time buyer and additional-property rates.",
    related: ["mortgage-affordability-calculator", "ltv-calculator", "mortgage-repayment-calculator"],
  },
  {
    slug: "mortgage-affordability-calculator",
    title: "How Much Can I Borrow?",
    shortTitle: "Affordability",
    desc: "Estimate borrowing from your income and see the monthly cost, LTV and a stress-tested payment.",
    related: ["loan-to-income-calculator", "mortgage-repayment-calculator", "stamp-duty-calculator"],
  },
  {
    slug: "mortgage-overpayment-calculator",
    title: "Mortgage Overpayment Calculator",
    shortTitle: "Overpayments",
    desc: "How much interest and time you save by overpaying monthly or with a lump sum.",
    related: ["mortgage-repayment-calculator", "ltv-calculator", "mortgage-term-age-calculator"],
  },
  {
    slug: "ltv-calculator",
    title: "LTV Calculator",
    shortTitle: "LTV",
    desc: "Loan-to-value, equity and additional borrowing at a glance.",
    related: ["mortgage-repayment-calculator", "second-charge-calculator", "stamp-duty-calculator"],
  },
  {
    slug: "mortgage-repayment-calculator",
    title: "Repayment Calculator",
    shortTitle: "Repayments",
    desc: "Monthly cost for repayment or interest-only mortgages.",
    related: ["mortgage-overpayment-calculator", "mortgage-affordability-calculator", "loan-to-income-calculator"],
  },
  {
    slug: "mortgage-term-age-calculator",
    title: "Age / Max Term Calculator",
    shortTitle: "Age & Term",
    desc: "How age limits your maximum mortgage term.",
    related: ["mortgage-repayment-calculator", "mortgage-affordability-calculator", "loan-to-income-calculator"],
  },
  {
    slug: "loan-to-income-calculator",
    title: "Loan-to-Income Calculator",
    shortTitle: "Loan-to-Income",
    desc: "See your borrowing as a multiple of income.",
    related: ["mortgage-affordability-calculator", "mortgage-repayment-calculator", "salary-calculator"],
  },
  {
    slug: "btl-icr-calculator",
    title: "BTL ICR Calculator",
    shortTitle: "BTL ICR",
    desc: "Rental coverage and required rent at 125%/145%.",
    related: ["rental-yield-calculator", "mortgage-repayment-calculator", "stamp-duty-calculator"],
  },
  {
    slug: "rental-yield-calculator",
    title: "Rental Yield Calculator",
    shortTitle: "Rental Yield",
    desc: "Gross yield from purchase price and rent.",
    related: ["btl-icr-calculator", "stamp-duty-calculator", "bridging-interest-calculator"],
  },
  {
    slug: "bridging-interest-calculator",
    title: "Bridging Calculator",
    shortTitle: "Bridging",
    desc: "Retained or serviced interest, fees and total cost.",
    related: ["ltv-calculator", "second-charge-calculator", "rental-yield-calculator"],
  },
  {
    slug: "second-charge-calculator",
    title: "Second & Third Charge Calculator",
    shortTitle: "2nd Charge",
    desc: "Combined LTV across all charges, plus new loan cost.",
    related: ["ltv-calculator", "bridging-interest-calculator", "mortgage-repayment-calculator"],
  },
  {
    slug: "salary-calculator",
    title: "Salary Take-Home Calculator",
    shortTitle: "Salary",
    desc: "Income tax, National Insurance and net pay.",
    related: ["dividend-calculator", "mortgage-affordability-calculator", "loan-to-income-calculator"],
  },
  {
    slug: "dividend-calculator",
    title: "Salary + Dividend Calculator",
    shortTitle: "Salary + Dividends",
    desc: "Combined take-home for salary plus dividends.",
    related: ["salary-calculator", "loan-to-income-calculator", "mortgage-affordability-calculator"],
  },
];

export function getCalculator(slug: string): CalculatorInfo | undefined {
  return CALCULATORS.find((c) => c.slug === slug);
}
