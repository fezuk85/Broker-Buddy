"use client";

import { useConsent } from "@/lib/consent/ConsentProvider";

export function CookieSettingsButton({ className }: { className?: string }) {
  const { openSettings } = useConsent();
  return (
    <button type="button" onClick={openSettings} className={className}>
      Cookie settings
    </button>
  );
}
