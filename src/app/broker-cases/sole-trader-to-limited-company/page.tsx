import type { Metadata } from "next";
import { BrokerCaseView } from "@/components/BrokerCaseView";
import { getBrokerCase } from "@/content/brokerCases";

const item = getBrokerCase("sole-trader-to-limited-company")!;

export const metadata: Metadata = {
  title: item.title,
  description: item.description,
  alternates: { canonical: "/broker-cases/sole-trader-to-limited-company" },
};

export default function Page() {
  return <BrokerCaseView item={item} />;
}
