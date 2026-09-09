import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--bb-border)] mt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 text-sm text-[var(--bb-muted)]">
        <p className="max-w-3xl">
          Broker Buddy provides calculations and indicative information only. It does not provide
          mortgage advice, lending decisions or property valuations. Always check figures with a
          qualified mortgage adviser and the lender&apos;s own criteria before making decisions.
        </p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/" className="hover:text-[var(--bb-foreground)]">Home</Link>
          <Link href="/mortgage-case-calculator" className="hover:text-[var(--bb-foreground)]">Case Calculator</Link>
          <Link href="/data-sources" className="hover:text-[var(--bb-foreground)]">Data Sources</Link>
        </div>
        <p className="mt-6 text-xs">&copy; {new Date().getFullYear()} Broker Buddy. All calculations are illustrative.</p>
      </div>
    </footer>
  );
}
