import Link from "next/link";
import { CookieSettingsButton } from "@/components/CookieSettingsButton";
import { getGroupedCalculators } from "@/lib/seo/calculators";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--bb-border)] mt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 text-sm text-[var(--bb-muted)]">
        <nav aria-label="All calculators" className="mb-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-6">
          {getGroupedCalculators().map(({ group, calculators }) => (
            <div key={group.id}>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--bb-foreground)] mb-3">
                {group.title}
              </h2>
              <ul className="space-y-2">
                {calculators.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/${c.slug}`} className="hover:text-[var(--bb-foreground)]">
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <p className="max-w-3xl">
          Lending Calculator provides calculations and indicative information only. It does not provide
          mortgage advice, lending decisions or property valuations. Always check figures with a
          qualified mortgage adviser and the lender&apos;s own criteria before making decisions.
        </p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/mortgage-case-calculator" className="hover:text-[var(--bb-foreground)]">Case Calculator</Link>
          <Link href="/data-sources" className="hover:text-[var(--bb-foreground)]">Data Sources</Link>
          <Link href="/about-us" className="hover:text-[var(--bb-foreground)]">About Us</Link>
          <Link href="/contact-us" className="hover:text-[var(--bb-foreground)]">Contact Us</Link>
          <Link href="/privacy-policy" className="hover:text-[var(--bb-foreground)]">Privacy Policy</Link>
          <CookieSettingsButton className="hover:text-[var(--bb-foreground)]" />
        </div>
        <p className="mt-6 text-xs">&copy; {new Date().getFullYear()} Lending Calculator. All calculations are illustrative.</p>
      </div>
    </footer>
  );
}
