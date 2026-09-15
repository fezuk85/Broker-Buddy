import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "About Us",
  description: "About Lending Calculator — free, transparent UK mortgage and property-finance calculators built on real published data.",
};

export default function AboutUsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">About us</h1>
      <p className="mt-3 text-[var(--bb-muted)]">
        Lending Calculator is a free set of UK mortgage and property-finance calculators, built to
        give brokers, advisers and consumers a fast, transparent way to run the numbers on a case —
        without having to sign up, install anything, or hand over personal data.
      </p>

      <Section className="mt-8" title="What we do">
        <p className="text-sm text-[var(--bb-muted)]">
          The site covers residential and buy-to-let mortgage calculations, affordability and
          income-based checks, bridging and second-charge lending, stamp duty, and a range of
          related property and tax calculators. Everything runs as pure maths in your browser using
          standard, published formulae and rates — see our{" "}
          <Link href="/data-sources" className="underline hover:text-[var(--bb-foreground)]">
            Data Sources
          </Link>{" "}
          page for exactly what each calculator is based on.
        </p>
      </Section>

      <Section className="mt-8" title="Our principles">
        <ul className="list-disc pl-5 text-sm text-[var(--bb-muted)] space-y-1">
          <li>Never fabricate or estimate data where real published figures are available</li>
          <li>Always be clear about what&apos;s a precise calculation vs. an illustrative estimate</li>
          <li>Never present a calculator result as mortgage advice or a lending decision</li>
          <li>Keep the tools free and usable without an account</li>
        </ul>
      </Section>

      <Section className="mt-8" title="Not financial advice">
        <p className="text-sm text-[var(--bb-muted)]">
          Lending Calculator provides calculations and indicative information only. It does not
          provide mortgage advice, lending decisions or property valuations. Always check figures
          with a qualified mortgage adviser and the lender&apos;s own criteria before making
          decisions. Have a question, or spotted something that looks wrong?{" "}
          <Link href="/contact-us" className="underline hover:text-[var(--bb-foreground)]">
            Get in touch
          </Link>
          .
        </p>
      </Section>
    </div>
  );
}
