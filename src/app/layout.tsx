import type { Metadata } from "next";
import "./globals.css";
import { CaseProvider } from "@/lib/case/CaseProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: {
    default: "Lending Calculator — UK Mortgage & Property Calculators",
    template: "%s | Lending Calculator",
  },
  description:
    "Free UK mortgage and property-finance calculators: LTV, loan-to-income, repayments, BTL ICR, rental yield, bridging and more — all in one place.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <CaseProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </CaseProvider>
      </body>
    </html>
  );
}
