"use client";

import { useState } from "react";
import { useCase } from "@/lib/case/CaseProvider";
import { useCaseCalculations } from "@/lib/case/useCaseCalculations";
import { CaseInputs } from "./CaseInputs";
import { OverviewPanel, MortgagePanel, PropertyPanel, AffordabilityPanel, RentalPanel } from "./panels";
import { CaseCalculatorSidebar } from "@/components/CaseCalculatorSidebar";
import { PieChart, Home, Building2, TrendingUp, Wallet, RotateCcw, FileDown } from "lucide-react";

const TABS = [
  { key: "overview", label: "Overview", icon: PieChart },
  { key: "mortgage", label: "Mortgage", icon: Home },
  { key: "property", label: "Property", icon: Building2 },
  { key: "affordability", label: "Affordability", icon: TrendingUp },
  { key: "rental", label: "Rental", icon: Wallet },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function MortgageCaseCalculatorPage() {
  const { caseState, updateCase, resetCase } = useCase();
  const calc = useCaseCalculations(caseState);
  const [tab, setTab] = useState<TabKey>("overview");
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    setGeneratingPdf(true);
    try {
      const { downloadCaseSummaryPdf } = await import("@/lib/pdf/caseSummaryPdf");
      downloadCaseSummaryPdf(caseState, calc);
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--bb-primary)" }}>
            Mortgage tools for professionals
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight">Mortgage Case Calculator</h1>
          <p className="mt-1 text-[var(--bb-muted)] max-w-xl">
            Enter your property and borrower details once — every calculation updates instantly.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={generatingPdf}
            className="bb-tap-target inline-flex items-center gap-1.5 text-sm font-medium rounded-lg px-4 py-2 text-white disabled:opacity-60"
            style={{ background: "var(--bb-primary)" }}
          >
            <FileDown size={15} strokeWidth={2.25} />
            {generatingPdf ? "Generating…" : "Download PDF summary"}
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Reset the case and clear all entered details?")) resetCase();
            }}
            className="bb-tap-target inline-flex items-center gap-1.5 text-sm font-medium rounded-lg border border-[var(--bb-border)] px-4 py-2"
          >
            <RotateCcw size={15} strokeWidth={2.25} />
            Reset case
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_280px] gap-6">
        <div>
          <CaseInputs caseState={caseState} updateCase={updateCase} />
        </div>

        <div>
          <div className="flex flex-wrap gap-1 pb-2 sticky top-16 z-10 bg-[var(--bb-bg)]/95 backdrop-blur">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium bb-tap-target ${
                  tab === t.key ? "text-white" : "text-[var(--bb-muted)] hover:text-[var(--bb-foreground)]"
                }`}
                style={tab === t.key ? { background: "var(--bb-primary)" } : undefined}
              >
                <t.icon size={15} strokeWidth={2.25} />
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
          </div>
        </div>

        <div className="hidden 2xl:block">
          <CaseCalculatorSidebar />
        </div>
      </div>
    </div>
  );
}
