"use client";

import Link from "next/link";
import { useConsent } from "@/lib/consent/ConsentProvider";

export function CookieBanner() {
  const { bannerOpen, accept, reject } = useConsent();

  if (!bannerOpen) return null;

  return (
    <div role="region" aria-label="Cookie preferences" className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--bb-border)] bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <p className="text-sm text-[var(--bb-muted)] flex-1">
          We use cookies to show ads and measure site usage. You can accept or reject non-essential
          cookies — see our{" "}
          <Link href="/privacy-policy" className="underline hover:text-[var(--bb-foreground)]">
            Privacy Policy
          </Link>{" "}
          for details.
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={reject}
            className="bb-tap-target rounded-lg border border-[var(--bb-border)] px-4 py-2 text-sm font-medium hover:bg-[var(--bb-surface)]"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={accept}
            className="bb-tap-target rounded-lg px-4 py-2 text-sm font-medium text-white"
            style={{ background: "var(--bb-primary)" }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
