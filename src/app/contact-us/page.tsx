import type { Metadata } from "next";
import ContactUsClient from "./Client";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Lending Calculator.",
  alternates: { canonical: "/contact-us" },
};

export default function ContactUsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Contact us</h1>
      <p className="mt-3 text-[var(--bb-muted)]">
        Questions, feedback, or spotted something that doesn&apos;t look right? Send us a message
        below.
      </p>

      <div className="mt-8">
        <ContactUsClient />
      </div>
    </div>
  );
}
