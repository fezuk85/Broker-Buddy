import type { Metadata } from "next";
import LtvCalculatorClient from "./Client";

export const metadata: Metadata = {
  title: "LTV Calculator — Loan-to-Value & Equity",
  description:
    "Free UK LTV calculator. Work out your current and proposed loan-to-value, equity, and how much extra you could borrow at each LTV band from 50% to 95%.",
};

export default function Page() {
  return <LtvCalculatorClient />;
}
