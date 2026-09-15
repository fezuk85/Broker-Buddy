import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Lending Calculator handles your data, cookies and advertising.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Privacy policy</h1>
      <p className="mt-3 text-[var(--bb-muted)]">
        Last updated {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.
        This page explains what data Lending Calculator collects, how cookies are used, and your
        rights under UK data protection law.
      </p>

      <Section className="mt-8" title="Calculator data stays on your device">
        <p className="text-sm text-[var(--bb-muted)]">
          The figures you enter into any calculator — income, property values, loan amounts, client
          references and so on — are stored only in your own browser&apos;s local storage. They are
          never sent to, or stored on, our servers. Clearing your browser data or using a different
          device/browser will remove them. PDF quotations and summaries you generate are created and
          downloaded entirely on your device.
        </p>
      </Section>

      <Section className="mt-8" title="Contact form">
        <p className="text-sm text-[var(--bb-muted)]">
          If you use the{" "}
          <Link href="/contact-us" className="underline hover:text-[var(--bb-foreground)]">
            Contact Us
          </Link>{" "}
          form, the details you enter are sent, via your own email client, directly to us as a
          normal email — we don&apos;t store form submissions on a server or add you to any mailing
          list.
        </p>
      </Section>

      <Section className="mt-8" title="Cookies and advertising">
        <p className="text-sm text-[var(--bb-muted)]">
          We use Google AdSense to show adverts, which may use cookies to serve ads based on your
          visits to this and other sites. We only load AdSense, and only after you accept cookies
          via the banner shown on your first visit — you can reject non-essential cookies instead,
          or change your choice at any time using the &quot;Cookie settings&quot; link in the footer.
        </p>
        <p className="mt-3 text-sm text-[var(--bb-muted)]">
          You can also control or opt out of personalised advertising directly with Google via{" "}
          <a
            href="https://myaccount.google.com/data-and-privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[var(--bb-foreground)]"
          >
            Google&apos;s Ad Settings
          </a>{" "}
          or{" "}
          <a
            href="https://www.youronlinechoices.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[var(--bb-foreground)]"
          >
            Your Online Choices
          </a>
          .
        </p>
      </Section>

      <Section className="mt-8" title="Analytics">
        <p className="text-sm text-[var(--bb-muted)]">
          We use Vercel Analytics to see how many people visit the site and which pages are popular.
          It counts page views in aggregate without using cookies or tracking you individually
          across sites.
        </p>
      </Section>

      <Section className="mt-8" title="Your rights">
        <p className="text-sm text-[var(--bb-muted)]">
          Under UK GDPR, you have the right to ask what personal data we hold about you, to have it
          corrected, or to have it deleted. Since calculator data stays on your own device and we
          don&apos;t hold accounts or a server-side database of visitors, in practice we hold very
          little personal data beyond what you choose to email us via the contact form.{" "}
          <Link href="/contact-us" className="underline hover:text-[var(--bb-foreground)]">
            Contact us
          </Link>{" "}
          with any privacy question or request.
        </p>
      </Section>
    </div>
  );
}
