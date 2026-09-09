import type { Metadata } from "next";
import BridgingCalculatorClient from "./Client";

export const metadata: Metadata = {
  title: "Bridging Loan Interest Calculator",
  description:
    "Free bridging loan calculator. Estimate gross loan, total interest, fees and total cost for retained or serviced bridging finance.",
};

export default function Page() {
  return <BridgingCalculatorClient />;
}
