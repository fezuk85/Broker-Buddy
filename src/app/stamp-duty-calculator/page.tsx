import type { Metadata } from "next";
import StampDutyCalculatorClient from "./Client";

export const metadata: Metadata = {
  title: "Stamp Duty Calculator UK — England (SDLT), Wales (LTT) & Scotland (LBTT)",
  description:
    "Free UK stamp duty calculator covering England & Northern Ireland (SDLT), Wales (Land Transaction Tax) and Scotland (LBTT). Standard purchases, first-time buyers and additional properties, with a band-by-band breakdown.",
  alternates: { canonical: "/stamp-duty-calculator" },
};

export default function Page() {
  return <StampDutyCalculatorClient />;
}
