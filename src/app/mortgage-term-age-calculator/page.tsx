import type { Metadata } from "next";
import AgeTermCalculatorClient from "./Client";

export const metadata: Metadata = {
  title: "Mortgage Age & Maximum Term Calculator",
  description:
    "Free mortgage age calculator. Find your age at the end of your mortgage term and the maximum term available under common lender maximum-age limits (70–85).",
};

export default function Page() {
  return <AgeTermCalculatorClient />;
}
