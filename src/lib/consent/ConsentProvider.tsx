"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const STORAGE_KEY = "lending-calculator-cookie-consent-v1";

export type ConsentChoice = "accepted" | "rejected";

interface ConsentContextValue {
  /** null while unhydrated or before the visitor has made a choice. */
  consent: ConsentChoice | null;
  /** true once localStorage has been read on the client, so it's safe to decide what to render. */
  hydrated: boolean;
  /** true when the banner should be shown — no choice made yet, or the visitor reopened settings. */
  bannerOpen: boolean;
  accept: () => void;
  reject: () => void;
  openSettings: () => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

function loadConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw === "accepted" || raw === "rejected" ? raw : null;
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentChoice | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsent(loadConsent());
    setHydrated(true);
  }, []);

  function persist(choice: ConsentChoice) {
    setConsent(choice);
    setSettingsOpen(false);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, choice);
  }

  const value: ConsentContextValue = {
    consent,
    hydrated,
    bannerOpen: hydrated && (consent === null || settingsOpen),
    accept: () => persist("accepted"),
    reject: () => persist("rejected"),
    openSettings: () => setSettingsOpen(true),
  };

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used within a ConsentProvider");
  return ctx;
}
