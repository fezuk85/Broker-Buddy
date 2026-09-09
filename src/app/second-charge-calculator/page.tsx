import type { Metadata } from "next";
import SecondChargeCalculatorClient from "./Client";

export const metadata: Metadata = {
  title: "Second & Third Charge Loan Calculator",
  description:
    "Free second/third charge secured loan calculator. See combined LTV across all charges, monthly cost, and total cost of borrowing including fees.",
};

export default function Page() {
  return <SecondChargeCalculatorClient />;
}
