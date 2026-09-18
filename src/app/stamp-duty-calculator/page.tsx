import type { Metadata } from "next";
import StampDutyCalculatorClient from "./Client";

export const metadata: Metadata = {
  title: "Stamp Duty Calculator UK — SDLT for Home Movers, First-Time Buyers & Landlords",
  description:
    "Free stamp duty calculator for England & Northern Ireland. Work out SDLT for a standard purchase, first-time buyer relief, or an additional property with the 5% surcharge — with a band-by-band breakdown.",
  alternates: { canonical: "/stamp-duty-calculator" },
};

export default function Page() {
  return <StampDutyCalculatorClient />;
}
