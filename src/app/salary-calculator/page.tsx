import type { Metadata } from "next";
import SalaryCalculatorClient from "./Client";

export const metadata: Metadata = {
  title: "Salary Take-Home Pay Calculator UK",
  description:
    "Free UK salary calculator. Work out income tax, National Insurance and net take-home pay — annual, monthly and weekly.",
  alternates: { canonical: "/salary-calculator" },
};

export default function Page() {
  return <SalaryCalculatorClient />;
}
