import Link from "next/link";

const NAV_LINKS = [
  { href: "/ltv-calculator", label: "LTV" },
  { href: "/second-charge-calculator", label: "2nd Charge" },
  { href: "/mortgage-repayment-calculator", label: "Repayments" },
  { href: "/btl-icr-calculator", label: "BTL ICR" },
  { href: "/salary-calculator", label: "Salary" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--bb-border)] bg-white/80 backdrop-blur sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg shrink-0">
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white text-sm font-bold"
            style={{ background: "var(--bb-primary)" }}
          >
            BB
          </span>
          <span>Broker Buddy</span>
        </Link>
        <nav className="hidden md:flex items-center gap-5 text-sm text-[var(--bb-muted)] overflow-x-auto">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-[var(--bb-foreground)] whitespace-nowrap">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/mortgage-case-calculator"
          className="bb-tap-target inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-white shrink-0"
          style={{ background: "var(--bb-primary)" }}
        >
          Open Case Calculator
        </Link>
      </div>
    </header>
  );
}
