import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { CaseProvider } from "@/lib/case/CaseProvider";
import { ConsentProvider } from "@/lib/consent/ConsentProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CookieBanner } from "@/components/CookieBanner";
import { AdSenseScript } from "@/components/AdSenseScript";
import { SITE_URL } from "@/lib/seo/routes";

const SITE_NAME = "Lending Calculator";
const SITE_TITLE = `${SITE_NAME} — UK Mortgage & Property Calculators`;
const SITE_DESCRIPTION =
  "Free UK mortgage and property-finance calculators: LTV, loan-to-income, repayments, BTL ICR, rental yield, bridging and more — all in one place.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Lending Calculator",
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_GB",
    url: "/",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
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
