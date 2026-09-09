import type { Metadata } from "next";
import RentalYieldCalculatorClient from "./Client";

export const metadata: Metadata = {
  title: "Rental Yield Calculator",
  description: "Free rental yield calculator. Work out gross rental yield from property value and monthly rent.",
};

export default function Page() {
  return <RentalYieldCalculatorClient />;
}
