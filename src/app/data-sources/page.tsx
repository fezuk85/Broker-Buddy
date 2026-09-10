import type { Metadata } from "next";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "Data Sources",
  description: "What data Broker Buddy's calculations and property information are based on — and what's real vs. illustrative in Phase 1.",
};

function StatusPill({ status }: { status: "live" | "manual" | "planned" }) {
  const styles: Record<typeof status, string> = {
    live: "bg-emerald-50 text-emerald-700 border-emerald-200",
    manual: "bg-sky-50 text-sky-700 border-sky-200",
    planned: "bg-amber-50 text-amber-700 border-amber-200",
  };
  const label = { live: "Connected", manual: "Manual entry", planned: "Planned (Phase 2)" }[status];
  return <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>{label}</span>;
}

const SOURCES = [
  {
    name: "Mortgage & property maths (LTV, LTI, repayments, age/term, ICR, yield, bridging, second/third charge)",
    status: "live" as const,
    detail: "Calculated directly from the numbers you enter using standard, published formulae. No external data required.",
  },
  {
    name: "Salary & dividend tax calculators (income tax, National Insurance, dividend tax)",
    status: "live" as const,
    detail:
      "Calculated using published HMRC rates and thresholds for the 2025/26 tax year (England, Wales & Northern Ireland — Scotland has different bands). Rates are reviewed periodically rather than pulled from a live feed; see the calculator pages for the exact assumptions used.",
  },
  {
    name: "Child Benefit & Marriage Allowance",
    status: "live" as const,
    detail:
      "Calculated using published 2025/26 Child Benefit rates and the High Income Child Benefit Charge thresholds (£60,000–£80,000), and the standard Marriage Allowance transfer rules. Deterministic, rule-based calculations — not means-tested benefits like Universal Credit, which are out of scope due to their many household-specific components.",
  },
  {
    name: "Illustrative household cash-flow snapshot (net income vs. outgoings)",
    status: "live" as const,
    detail:
      "Net monthly income is calculated from each applicant's gross income using the same salary take-home engine as the Salary Calculator — it assumes straightforward PAYE employment income with no pension contributions, benefits or other income. This is compared against the ONS benchmark expenditure, Council Tax, mortgage payment and credit commitments to show an indicative monthly surplus or deficit. This is explicitly not a lender affordability assessment — lenders apply their own stress rates, expenditure assumptions, income verification and policy rules, and a positive figure here does not indicate any lender would approve the borrowing.",
  },
  {
    name: "HM Land Registry Price Paid Data",
    status: "live" as const,
    detail:
      "Historic sale prices for England & Wales (from 1995, updated monthly) via HM Land Registry's live, unauthenticated Linked Data API — no bulk file import. Matched by postcode only, not full address/UPRN (the API has no UPRN field), so results shown for a property are best-effort address-text matches within that postcode's sales, and 'comparable sales' means other sales at the same postcode rather than a true geographic radius search. Open Government Licence for prices; the address fields carry a separate Royal Mail/Ordnance Survey restriction limiting use to displaying residential property price information, which is what this does — see the attribution note below.",
  },
  {
    name: "MHCLG Get Energy Performance Data (domestic EPC)",
    status: "live" as const,
    detail:
      "Provides current/potential EPC rating and score, floor area, property type, main heating and (as a raw, undecoded code) construction age band, for domestic properties in England & Wales — Scotland and Northern Ireland run separate EPC registers not covered by this API. Matched by postcode only, not full address/UPRN, so a postcode covering multiple flats returns the most recently registered EPC for any of them. Requires an EPC_API_TOKEN to be configured on the server; if it isn't set, or no certificate is found, the property panel shows that plainly rather than fabricating data.",
  },
  {
    name: "ONS Family Spending (household expenditure benchmark)",
    status: "manual" as const,
    detail:
      "Phase 1 uses a simplified, rule-based approximation modelled on published ONS Family Spending category patterns — clearly labelled as a benchmark, not your actual expenditure, and not a lender affordability assessment. It excludes mortgage/rent payments and Council Tax to avoid double-counting. If a property postcode is entered, its region is derived from the postcode's area code and used to apply an illustrative regional cost-of-living adjustment (London/South East scaled up, North/Wales/NI scaled down) — this is a modelled adjustment based on general regional spending patterns, not the official ONS region-level Family Spending breakdown. With no postcode, the UK average is used.",
  },
  {
    name: "Council Tax",
    status: "live" as const,
    detail:
      "An automatic estimate appears as soon as a postcode is entered — no lookup or manual entry required. Covers England and Wales (Scotland and Northern Ireland aren't connected yet — different valuation and billing systems). Individual property bands are legally restricted data (the Valuation Office Agency treats them as personal property data under the Commissioners for Revenue and Customs Act 2005, with no open bulk source), so the estimate uses the most common Council Tax band among properties in that postcode's local area (VOA 'Council Tax: stock of properties' release), priced using official per-authority, per-band charges — MHCLG's 'Council Tax levels set by local authorities in England' for English postcodes, or the Welsh Government/StatsWales 'Council tax levels by billing authority and band' release for Welsh postcodes (Wales has a ninth band, I, that England doesn't). This is clearly labelled as an area-typical estimate, not the confirmed band for the specific property. You can still enter your own figure manually if you know the actual band/charge, which always takes priority over the estimate.",
  },
  {
    name: "Rental estimates",
    status: "manual" as const,
    detail:
      "You enter your own monthly rent. Broker Buddy does not scrape Rightmove, Zoopla or any other listings site. A licensed rental-data provider may be added in future via the RentalEstimateProvider interface.",
  },
];

export default function DataSourcesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Data sources</h1>
      <p className="mt-3 text-[var(--bb-muted)]">
        This page explains exactly which parts of Broker Buddy are pure calculation, which use
        real public data, and which are currently manual entry or planned — so nothing is ever
        presented as more authoritative than it is.
      </p>

      <div className="mt-8 space-y-4">
        {SOURCES.map((s) => (
          <Section key={s.name}>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-sm font-semibold">{s.name}</h2>
              <StatusPill status={s.status} />
            </div>
            <p className="mt-2 text-sm text-[var(--bb-muted)]">{s.detail}</p>
          </Section>
        ))}
      </div>

      <Section className="mt-8" title="HM Land Registry attribution">
        <p className="text-sm text-[var(--bb-muted)]">
          Wherever HM Land Registry Price Paid Data is shown or derived, Broker Buddy will display
          the required attribution:
        </p>
        <blockquote className="mt-3 border-l-2 pl-4 text-sm italic" style={{ borderColor: "var(--bb-border)" }}>
          &quot;Contains HM Land Registry data © Crown copyright and database right {new Date().getFullYear()}.
          This data is licensed under the Open Government Licence v3.0.&quot;
        </blockquote>
        <p className="mt-3 text-xs text-[var(--bb-muted)]">
          Price Paid Data itself is freely reusable, including commercially, under the Open
          Government Licence. The address fields (postcode, house name/number, street, locality,
          town, district, county) are additionally licensed by Royal Mail/Ordnance Survey for
          personal/non-commercial use and for &quot;display for the purpose of providing residential
          property price information services&quot; — which is what this page and the case calculator
          do. Using that address data for any other purpose (e.g. marketing, CRM enrichment) would
          need separate permission from Royal Mail.
        </p>
      </Section>

      <Section className="mt-8" title="What we will never do">
        <ul className="list-disc pl-5 text-sm text-[var(--bb-muted)] space-y-1">
          <li>Scrape Rightmove, Zoopla, or council-tax websites</li>
          <li>Present an indicative estimate as a formal valuation or lender AVM</li>
          <li>Invent missing property data</li>
          <li>Disguise public-data outputs as proprietary Broker Buddy data</li>
        </ul>
      </Section>
    </div>
  );
}
