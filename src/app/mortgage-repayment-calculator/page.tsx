import type { Metadata } from "next";
import RepaymentCalculatorClient from "./Client";

export const metadata: Metadata = {
  title: "Mortgage Repayment Calculator UK",
  description:
    "Free UK mortgage payment calculator. Compare repayment vs interest-only monthly costs, total interest, and payments at higher rates.",
};

export default function Page() {
  return <RepaymentCalculatorClient />;
}
