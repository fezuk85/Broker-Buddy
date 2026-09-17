import type { Metadata } from "next";
import BtlIcrCalculatorClient from "./Client";

export const metadata: Metadata = {
  title: "BTL ICR Calculator — Buy-to-Let Interest Cover",
  description:
    "Free buy-to-let ICR calculator. Check interest coverage at 125% and 145%, required rent, and maximum loan supported by your rent.",
  alternates: { canonical: "/btl-icr-calculator" },
};

export default function Page() {
  return <BtlIcrCalculatorClient />;
}
