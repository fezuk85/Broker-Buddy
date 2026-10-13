"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

const STORAGE_KEY = "lending-calculator-branding-v1";

interface BrandingState {
  /** Data URL (e.g. "data:image/png;base64,...") of the broker's own logo, or null if not set. */
  logoDataUrl: string | null;
}

const DEFAULT_BRANDING: BrandingState = { logoDataUrl: null };

interface BrandingContextValue extends BrandingState {
  setLogo: (dataUrl: string | null) => void;
}

const BrandingContext = createContext<BrandingContextValue | null>(null);

function loadFromStorage(): BrandingState {
  if (typeof window === "undefined") return DEFAULT_BRANDING;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_BRANDING;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_BRANDING, ...parsed };
  } catch {
    return DEFAULT_BRANDING;
  }
}

export function BrandingProvider({ children }: { children: ReactNode }) {
  const [branding, setBranding] = useState<BrandingState>(DEFAULT_BRANDING);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBranding(loadFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(branding));
    } catch {
      // Quota exceeded (a large logo image) — the upload UI already caps file size, so this is
      // just a safety net; the logo simply won't persist across reloads in this edge case.
    }
  }, [branding, hydrated]);

  const value = useMemo<BrandingContextValue>(
    () => ({
      ...branding,
      setLogo: (dataUrl) => setBranding({ logoDataUrl: dataUrl }),
    }),
    [branding]
  );

  return <BrandingContext.Provider value={value}>{children}</BrandingContext.Provider>;
}

export function useBranding(): BrandingContextValue {
  const ctx = useContext(BrandingContext);
  if (!ctx) throw new Error("useBranding must be used within a BrandingProvider");
  return ctx;
}
