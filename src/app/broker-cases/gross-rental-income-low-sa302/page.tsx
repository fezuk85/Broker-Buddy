import type { Metadata } from "next";
import { BrokerCaseView } from "@/components/BrokerCaseView";
import { getBrokerCase } from "@/content/brokerCases";

const item = getBrokerCase("gross-rental-income-low-sa302")!;

export const metadata: Metadata = {
  title: item.title,
  description: item.description,
  alternates: { canonical: "/broker-cases/gross-rental-income-low-sa302" },
};

export default function Page() {
  return <BrokerCaseView item={item} />;
}
