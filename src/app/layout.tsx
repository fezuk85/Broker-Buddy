import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { CaseProvider } from "@/lib/case/CaseProvider";
import { ConsentProvider } from "@/lib/consent/ConsentProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CookieBanner } from "@/components/CookieBanner";
import { AdSenseScript } from "@/components/AdSenseScript";

export const metadata: Metadata = {
  title: {
    default: "Lending Calculator — UK Mortgage & Property Calculators",
    template: "%s | Lending Calculator",
  },
  description:
    "Free UK mortgage and property-finance calculators: LTV, loan-to-income, repayments, BTL ICR, rental yield, bridging and more — all in one place.",
  other: {
    "google-adsense-account": "ca-pub-2645011735403572",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ConsentProvider>
          <AdSenseScript />
          <CaseProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </CaseProvider>
          <CookieBanner />
        </ConsentProvider>
        <Analytics />
      </body>
    </html>
  );
}
