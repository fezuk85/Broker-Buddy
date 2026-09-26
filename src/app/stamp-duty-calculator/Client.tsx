"use client";

import { useMemo, useState } from "react";
import { calculateStampDuty, type BuyerType, type TaxRegion } from "@/lib/calc";
import { formatGbp, formatPercent } from "@/lib/format";
import { CalculatorPage } from "@/components/CalculatorPage";
import { CheckboxInput, Field, NumberInput, SelectInput } from "@/components/Field";
import { Section } from "@/components/Section";
import { StatTile } from "@/components/StatTile";
import { StampDutyGuide } from "@/content/guides/stampDuty";

const REGION_EXPLANATION: Record<TaxRegion, string> = {
  "england-ni":
    "SDLT is charged in slices: each portion of the price is taxed at the rate for its own band. First-time buyers get a higher zero-rate band (up to £300,000) but lose the relief entirely above £500,000. Additional-property purchases add a 5% surcharge on the whole price, and non-UK residents pay a further 2%.",
  wales:
    "LTT is charged in slices. The main rates start at 6% above £225,000. There is no first-time buyer relief in Wales. Buying an additional dwelling of £40,000 or more replaces the main rates with the higher residential rates, which are also charged band by band and start at 5% on the first pound.",
  scotland:
    "LBTT is charged in slices, with a £145,000 zero-rate band. First-time buyers get a £175,000 zero-rate band, worth up to £600, at any price. Buying an additional dwelling of £40,000 or more adds the Additional Dwelling Supplement, 8% of the whole price, on top of the LBTT.",
};

export default function StampDutyCalculatorClient() {
  const [price, setPrice] = useState(350_000);
  const [region, setRegion] = useState<TaxRegion>("england-ni");
  const [buyerType, setBuyerType] = useState<BuyerType>("standard");
  const [nonUkResident, setNonUkResident] = useState(false);

  const result = useMemo(
    () => calculateStampDuty({ price, buyerType, nonUkResident, region }),
    [price, buyerType, nonUkResident, region]
  );

  return (
    <CalculatorPage
      slug="stamp-duty-calculator"
      h1="Stamp Duty Calculator (England, Wales & Scotland)"
      intro="Work out the tax on a residential purchase anywhere in the UK — Stamp Duty Land Tax in England & Northern Ireland, Land Transaction Tax in Wales, or LBTT in Scotland — for a home mover, a first-time buyer, or an additional property such as a buy-to-let or second home."
      disclaimer="Illustrative only. Rates checked against GOV.UK, GOV.WALES and Revenue Scotland in September 2026 — confirm the exact figure with your conveyancer."
      inputs={
        <Section title="The purchase">
          <div className="grid grid-cols-1 gap-3">
            <Field label="Where is the property?">
              <SelectInput
                value={region}
                onChange={setRegion}
                options={[
                  { value: "england-ni", label: "England or Northern Ireland (SDLT)" },
                  { value: "wales", label: "Wales (LTT)" },
                  { value: "scotland", label: "Scotland (LBTT)" },
                ]}
              />
            </Field>
            <Field label="Purchase price">
              <NumberInput prefix="£" value={price} onChange={setPrice} />
            </Field>
            <Field label="Who is buying?">
              <SelectInput
                value={buyerType}
                onChange={setBuyerType}
                options={[
                  { value: "standard", label: "Home mover (buying my main home)" },
                  {
                    value: "first-time",
                    label: region === "wales" ? "First-time buyer (no relief in Wales)" : "First-time buyer",
                  },
                  { value: "additional", label: "Additional property (buy-to-let / second home)" },
                ]}
              />
            </Field>
            {region === "england-ni" && (
              <CheckboxInput
                checked={nonUkResident}
                onChange={setNonUkResident}
                label="Buyer is not UK resident (2% surcharge)"
              />
            )}
          </div>
        </Section>
      }
      results={
        <>
          <Section title={`${result.taxShortName} to pay`}>
            <div className="grid grid-cols-2 gap-3">
              <StatTile label={`Total ${result.taxShortName}`} value={formatGbp(result.totalTax)} accent="primary" />
              <StatTile
                label="Effective rate"
                value={result.effectiveRatePercent === null ? "—" : formatPercent(result.effectiveRatePercent, 2)}
                subValue="of the purchase price"
              />
            </div>
            <p className="mt-3 text-sm text-[var(--bb-muted)]">{result.taxName}</p>
            {result.firstTimeBuyerReliefApplied && (
              <p className="mt-3 text-sm text-[var(--bb-muted)]">First-time buyer relief applied.</p>
            )}
            {result.higherRatesApplied && (
              <p className="mt-3 text-sm text-[var(--bb-muted)]">
                Higher residential rates applied for an additional dwelling.
              </p>
            )}
            {result.firstTimeBuyerReliefNote && (
              <p className="mt-3 text-sm" style={{ color: "var(--bb-warning-text)" }}>
                {result.firstTimeBuyerReliefNote}
              </p>
            )}
            {result.notes.map((n) => (
              <p key={n} className="mt-3 text-sm text-[var(--bb-muted)]">
                {n}
              </p>
            ))}
          </Section>

          <Section title="Band-by-band breakdown">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[var(--bb-muted)]">
                  <th scope="col" className="font-medium py-1 pr-3">Band</th>
                  <th scope="col" className="font-medium py-1 pr-3">Rate</th>
                  <th scope="col" className="font-medium py-1 pr-3">Taxable</th>
                  <th scope="col" className="font-medium py-1 text-right">Tax</th>
                </tr>
              </thead>
              <tbody>
                {result.bands.map((b) => (
                  <tr key={b.label} className="border-t border-[var(--bb-border)]">
                    <td className="py-1.5 pr-3">{b.label}</td>
                    <td className="py-1.5 pr-3">{b.ratePercent}%</td>
                    <td className="py-1.5 pr-3">{formatGbp(b.amountInBand)}</td>
                    <td className="py-1.5 text-right">{formatGbp(b.taxDue)}</td>
                  </tr>
                ))}
                {result.additionalPropertySurcharge > 0 && (
                  <tr className="border-t border-[var(--bb-border)]">
                    <td className="py-1.5 pr-3" colSpan={3}>{result.additionalPropertySurchargeLabel}</td>
                    <td className="py-1.5 text-right">{formatGbp(result.additionalPropertySurcharge)}</td>
                  </tr>
                )}
                {result.nonResidentSurcharge > 0 && (
                  <tr className="border-t border-[var(--bb-border)]">
                    <td className="py-1.5 pr-3" colSpan={3}>Non-UK resident surcharge (2% of price)</td>
                    <td className="py-1.5 text-right">{formatGbp(result.nonResidentSurcharge)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </Section>
        </>
      }
      explanation={<p>{REGION_EXPLANATION[region]}</p>}
      guide={<StampDutyGuide />}
      faqs={[
        {
          question: "How much stamp duty will I pay on a £300,000 house?",
          answer:
            "In England a home mover pays £5,000 (2% of £125,000 plus 5% of £50,000), a first-time buyer pays nothing, and an additional property costs £20,000 (£5,000 plus the 5% surcharge). In Wales the LTT is £4,500 for a home mover and £19,950 for an additional dwelling, with no first-time buyer relief. In Scotland the LBTT is £4,600 for a home mover, £4,000 for a first-time buyer, and £28,600 for an additional dwelling including the 8% ADS.",
        },
        {
          question: "Do first-time buyers pay stamp duty?",
          answer:
            "In England they pay no SDLT up to £300,000 and 5% on the portion from £300,001 to £500,000; above £500,000 there is no relief at all. In Scotland the LBTT zero-rate band rises from £145,000 to £175,000, saving up to £600 at any price. Wales has no first-time buyer relief, though the Welsh zero-rate band is £225,000 for everyone.",
        },
        {
          question: "What is different for Wales and Scotland?",
          answer:
            "Wales charges Land Transaction Tax (LTT) and Scotland charges Land and Buildings Transaction Tax (LBTT), each with its own bands and rules. Wales replaces its rates with higher residential rates for additional dwellings, whereas England adds 5% and Scotland adds 8% to the whole price. Only England and Northern Ireland have a 2% non-UK resident surcharge.",
        },
        {
          question: "When do I have to pay stamp duty?",
          answer:
            "In England the SDLT return and payment are normally due within 14 days of completion. Wales and Scotland have their own filing deadlines, which your solicitor or conveyancer will manage for you and pay from the money you send them.",
        },
      ]}
    />
  );
}
