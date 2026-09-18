import type { Metadata } from "next";
import OverpaymentCalculatorClient from "./Client";

export const metadata: Metadata = {
  title: "Mortgage Overpayment Calculator UK — Interest & Time Saved",
  description:
    "Free mortgage overpayment calculator. See how much interest and how many years you could save by overpaying monthly or with a lump sum, plus a check against the typical 10% annual overpayment limit.",
  alternates: { canonical: "/mortgage-overpayment-calculator" },
};

export default function Page() {
  return <OverpaymentCalculatorClient />;
}
