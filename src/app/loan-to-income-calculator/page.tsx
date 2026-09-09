import type { Metadata } from "next";
import LtiCalculatorClient from "./Client";

export const metadata: Metadata = {
  title: "Loan-to-Income (LTI) Calculator",
  description:
    "Free loan-to-income calculator. See your mortgage as a multiple of income and compare illustrative borrowing at 4x-6x income multiples.",
};

export default function Page() {
  return <LtiCalculatorClient />;
}
