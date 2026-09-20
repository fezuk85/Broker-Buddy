import Link from "next/link";
import { Home, ArrowRight } from "lucide-react";
import { AllCalculatorsMenu } from "@/components/AllCalculatorsMenu";

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--bb-border)] bg-white/80 backdrop-blur sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-white shrink-0"
            style={{ background: "var(--bb-primary)" }}
          >
            <Home size={18} strokeWidth={2.25} />
          </span>
          <span className="leading-tight">
            <span className="block font-semibold text-[15px] tracking-tight">
              Lending<span style={{ color: "var(--bb-primary)" }}> Calculator</span>
            </span>
            <span className="hidden sm:block text-[10px] font-medium uppercase tracking-widest text-[var(--bb-muted)]">
              Smarter lending decisions
            </span>
          </span>
        </Link>
        <nav aria-label="Main" className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/about-us"
            className="hidden md:inline-block rounded-lg px-2.5 py-1.5 text-sm text-[var(--bb-muted)] hover:text-[var(--bb-foreground)]"
          >
            About
          </Link>
          <AllCalculatorsMenu />
          <Link
            href="/mortgage-case-calculator"
            className="bb-tap-target inline-flex items-center gap-1.5 rounded-lg px-3 sm:px-4 py-2 text-sm font-medium text-white shrink-0"
            style={{ background: "var(--bb-primary)" }}
          >
            <span className="hidden sm:inline">Case Calculator</span>
            <span className="sm:hidden">Case</span>
            <ArrowRight size={15} strokeWidth={2.25} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
