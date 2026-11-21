import type { Metadata } from "next";
import HelpToBuyFeeClient from "./Client";

export const metadata: Metadata = {
  title: "Help to Buy Equity Loan Fee Calculator — Year 6 Fee and Cost to Repay",
  description:
    "Free Help to Buy equity loan calculator. See the fee after year five, how it rises with RPI, the total over the years, and the cost to repay the equity loan at your home's current value.",
  alternates: { canonical: "/help-to-buy-fee-calculator" },
};

export default function Page() {
  return <HelpToBuyFeeClient />;
}
