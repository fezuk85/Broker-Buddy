"use client";

import { useMemo, useState } from "react";
import { calculateGrossYield } from "@/lib/calc";
import { formatGbp, formatPercent } from "@/lib/format";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Field, NumberInput } from "@/components/Field";
import { Section } from "@/components/Section";
import { StatTile } from "@/components/StatTile";

export default function RentalYieldCalculatorClient() {
  const [propertyValue, setPropertyValue] = useState(250_000);
  const [monthlyRent, setMonthlyRent] = useState(1_200);

  const result = useMemo(() => calculateGrossYield(propertyValue, monthlyRent), [propertyValue, monthlyRent]);

  return (
    <CalculatorPage
      h1="Rental Yield Calculator"
      intro="Calculate the gross rental yield on a property from its value and monthly rent."
      disclaimer="Gross yield only — it does not account for costs such as mortgage interest, void periods, management fees, maintenance or tax."
      inputs={
        <Section title="Your details">
          <div className="grid grid-cols-1 gap-3">
            <Field label="Property value">
              <NumberInput value={propertyValue} onChange={setPropertyValue} />
            </Field>
            <Field label="Monthly rent">
              <NumberInput value={monthlyRent} onChange={setMonthlyRent} />
            </Field>
          </div>
        </Section>
      }
      results={
        <Section title="Results">
          <div className="grid grid-cols-2 gap-3">
            <StatTile label="Annual rent" value={formatGbp(result.annualRent)} />
            <StatTile label="Gross yield" value={formatPercent(result.grossYieldPercent)} accent="primary" />
          </div>
        </Section>
      }
      explanation={
        <p>
          Gross rental yield = annual rent ÷ property value × 100. It&apos;s a quick way to
          compare properties, but it ignores running costs — for a fuller picture, deduct
          mortgage interest, management fees, maintenance, insurance and void periods to reach a
          net yield.
        </p>
      }
      faqs={[
        {
          question: "What is a good rental yield?",
          answer:
            "This varies significantly by area and property type — many investors look for gross yields in the 5-8% range, but local market context matters more than a single benchmark.",
        },
        {
          question: "Is this gross or net yield?",
          answer: "This calculator shows gross yield only — before costs, fees, tax and void periods.",
        },
      ]}
    />
  );
}
