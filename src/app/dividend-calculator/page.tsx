import type { Metadata } from "next";
import DividendCalculatorClient from "./Client";

export const metadata: Metadata = {
  title: "Salary + Dividend Tax Calculator",
  description:
    "Free UK salary and dividend tax calculator for company directors. See combined net take-home pay from salary plus dividends.",
};

export default function Page() {
  return <DividendCalculatorClient />;
}
