"use client";

import Script from "next/script";
import { useConsent } from "@/lib/consent/ConsentProvider";

/**
 * Loads the AdSense script only after the visitor has accepted cookies — required by Google's EU
 * User Consent Policy, which forbids setting ad cookies before consent is given.
 */
export function AdSenseScript() {
  const { consent } = useConsent();

  if (consent !== "accepted") return null;

  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2645011735403572"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
