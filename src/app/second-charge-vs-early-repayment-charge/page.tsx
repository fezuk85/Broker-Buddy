import type { Metadata } from "next";
import ErcBreakEvenClient from "./Client";

export const metadata: Metadata = {
  title: "Second Charge vs Early Repayment Charge Calculator — Which Costs Less?",
  description:
    "Free calculator: compare a second charge loan with paying your early repayment charge and remortgaging. See the total cost of each route and the early repayment charge at which they cost the same.",
  alternates: { canonical: "/second-charge-vs-early-repayment-charge" },
};

export default function Page() {
  return <ErcBreakEvenClient />;
}
