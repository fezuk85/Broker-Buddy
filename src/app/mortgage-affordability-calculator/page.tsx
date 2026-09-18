import type { Metadata } from "next";
import AffordabilityCalculatorClient from "./Client";

export const metadata: Metadata = {
  title: "How Much Can I Borrow? Mortgage Affordability Calculator UK",
  description:
    "Free mortgage affordability calculator. Enter your income (and a partner's) to estimate how much you could borrow at 4x to 5.5x income, the property price your deposit supports, and the monthly payment including a stress test.",
  alternates: { canonical: "/mortgage-affordability-calculator" },
};

export default function Page() {
  return <AffordabilityCalculatorClient />;
}
