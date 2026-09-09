"use client";

import { useState } from "react";
import { useCase } from "@/lib/case/CaseProvider";
import { useCaseCalculations } from "@/lib/case/useCaseCalculations";
import { CaseInputs } from "./CaseInputs";
import { OverviewPanel, MortgagePanel, PropertyPanel, AffordabilityPanel, RentalPanel, EpcPanel } from "./panels";
import { AdSlot } from "@/components/AdSlot";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "mortgage", label: "Mortgage" },
  { key: "property", label: "Property" },
  { key: "affordability", label: "Affordability" },
  { key: "rental", label: "Rental" },
  { key: "epc", label: "EPC" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function MortgageCaseCalculatorPage() {
  const { caseState, updateCase, resetCase } = useCase();
  const calc = useCaseCalculations(caseState);
  const [tab, setTab] = useState<TabKey>("overview");

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Mortgage Case Calculator</h1>
          <p className="mt-1 text-[var(--bb-muted)] max-w-xl">
            Enter your property and borrower details once — every calculation updates instantly.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Reset the case and clear all entered details?")) resetCase();
          }}
          className="bb-tap-target text-sm font-medium rounded-lg border border-[var(--bb-border)] px-4 py-2"
        >
          Reset case
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <CaseInputs caseState={caseState} updateCase={updateCase} />
        </div>

        <div>
          <div className="flex gap-1 overflow-x-auto pb-2 sticky top-16 z-10 bg-[var(--bb-bg)]/95 backdrop-blur">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium bb-tap-target ${
                  tab === t.key ? "text-white" : "text-[var(--bb-muted)] hover:text-[var(--bb-foreground)]"
                }`}
                style={tab === t.key ? { background: "var(--bb-primary)" } : undefined}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-3">
            {tab === "overview" && <OverviewPanel calc={calc} caseState={caseState} />}
            {tab === "mortgage" && <MortgagePanel calc={calc} caseState={caseState} />}
            {tab === "property" && <PropertyPanel calc={calc} caseState={caseState} />}
            {tab === "affordability" && <AffordabilityPanel calc={calc} caseState={caseState} />}
            {tab === "rental" && <RentalPanel calc={calc} caseState={caseState} />}
            {tab === "epc" && <EpcPanel calc={calc} caseState={caseState} />}
          </div>

          <div className="mt-6">
            <AdSlot />
          </div>
        </div>
      </div>
    </div>
  );
}
