import type { Metadata } from "next";
import { BrokerCaseView } from "@/components/BrokerCaseView";
import { getBrokerCase } from "@/content/brokerCases";

const item = getBrokerCase("right-to-buy-pre-emption-period")!;

export const metadata: Metadata = {
  title: item.title,
  description: item.description,
  alternates: { canonical: "/broker-cases/right-to-buy-pre-emption-period" },
};

export default function Page() {
  return <BrokerCaseView item={item} />;
}
