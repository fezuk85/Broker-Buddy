import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { TalkButton } from "@/components/TalkButton";

export const metadata: Metadata = {
  title: "About This Site: Built by a Mortgage Broker",
  description:
    "Lending Calculator was built by Andrew, a mortgage broker, because he could not find the calculators and plain-English guides he needed. It is an independent personal project.",
  alternates: { canonical: "/about-us" },
};

export default function AboutUsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">About this site</h1>
      <p className="mt-3 text-[var(--bb-muted)]">
        Hi, I&apos;m Andrew. I work as a mortgage broker.
      </p>

      <Section className="mt-8" title="Why I built it">
        <p className="text-sm text-[var(--bb-muted)]">
          I struggled to find the right calculators and plain-English resources online to help me do my job. The tools I
          found were either too basic, too full of adverts, or built for one narrow case. So I built the ones I wanted,
          and wrote the guides I wish my clients had read before they came to me.
        </p>
        <p className="mt-3 text-sm text-[var(--bb-muted)]">
          It is for brokers and homeowners alike. Brokers can run the numbers on a case quickly. Homeowners can find out
          what their options are, in plain English, before they apply anywhere.
        </p>
      </Section>

      <Section className="mt-8" title="Who is behind it">
        <p className="text-sm text-[var(--bb-muted)]">
          This is my own independent project. It is not run by, or on behalf of, any company or lender. If you email me
          through this site, you are contacting me personally, as the person who built it.
        </p>
        <p className="mt-3 text-sm text-[var(--bb-muted)]">
          I will read what you send and tell you honestly what I think the best route is. That may well be a standard
          mortgage broker rather than a specialist. I will only pass your details to anyone else after we have spoken
          and you have agreed.
        </p>
        <div className="mt-4">
          <TalkButton topic="About page">Email Andrew</TalkButton>
        </div>
      </Section>

      <Section className="mt-8" title="How the site works">
        <p className="text-sm text-[var(--bb-muted)]">
          The calculators run as pure maths in your browser using standard, published formulae and rates. See the{" "}
          <Link href="/data-sources" className="underline hover:text-[var(--bb-foreground)]">
            Data Sources
          </Link>{" "}
          page for exactly what each one is based on. The guides are written from published sources such as the FCA,
          GOV.UK, the Financial Ombudsman Service and the credit reference agencies, and every guide lists them at the
          bottom.
        </p>
      </Section>

      <Section className="mt-8" title="My principles">
        <ul className="list-disc pl-5 text-sm text-[var(--bb-muted)] space-y-1">
          <li>Never fabricate or estimate data where real published figures are available</li>
          <li>Always be clear about what&apos;s a precise calculation vs. an illustrative estimate</li>
          <li>Never present a calculator result as a lending decision</li>
          <li>Keep the tools free and usable without an account</li>
        </ul>
      </Section>

      <Section className="mt-8" title="What this site is not">
        <p className="text-sm text-[var(--bb-muted)]">
          It provides calculations and general information only. It is not a lender and does not give a lending
          decision. Always check figures with a qualified mortgage adviser and the lender&apos;s own criteria before
          making decisions. Spotted something that looks wrong?{" "}
          <Link href="/contact-us" className="underline hover:text-[var(--bb-foreground)]">
            Get in touch
          </Link>
          .
        </p>
      </Section>
    </div>
  );
}
