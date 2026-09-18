import type { Metadata } from "next";
import MortgageCaseCalculatorClient from "./Client";

export const metadata: Metadata = {
  title: "Mortgage Case Calculator — LTV, Affordability, Rental & Repayments",
  description:
    "Enter your property and borrower details once and get LTV, repayments, loan-to-income, BTL rental coverage, and affordability all together — free, no account needed.",
  alternates: { canonical: "/mortgage-case-calculator" },
};

export default function Page() {
  return <MortgageCaseCalculatorClient />;
}
