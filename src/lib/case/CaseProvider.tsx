"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { CaseState, DEFAULT_CASE } from "./types";

const STORAGE_KEY = "lending-calculator-case-v1";
const LEGACY_STORAGE_KEY = "broker-buddy-case-v1";

interface CaseContextValue {
  caseState: CaseState;
  updateCase: (patch: Partial<CaseState> | ((prev: CaseState) => CaseState)) => void;
  resetCase: () => void;
}

const CaseContext = createContext<CaseContextValue | null>(null);

function loadFromStorage(): CaseState {
  if (typeof window === "undefined") return DEFAULT_CASE;
  try {
    // Falls back to the pre-rebrand storage key so an in-progress case isn't lost by the rename.
    const raw = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return DEFAULT_CASE;
    const parsed = JSON.parse(raw);
    // Shallow-merge onto defaults so new fields introduced later don't break old saved cases.
    return {
      ...DEFAULT_CASE,
      ...parsed,
      property: { ...DEFAULT_CASE.property, ...parsed.property },
      applicants: { ...DEFAULT_CASE.applicants, ...parsed.applicants },
      household: { ...DEFAULT_CASE.household, ...parsed.household },
      mortgage: { ...DEFAULT_CASE.mortgage, ...parsed.mortgage },
      rental: { ...DEFAULT_CASE.rental, ...parsed.rental },
    };
  } catch {
    return DEFAULT_CASE;
  }
}

export function CaseProvider({ children }: { children: ReactNode }) {
  const [caseState, setCaseState] = useState<CaseState>(DEFAULT_CASE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // One-off hydration from localStorage after mount, so SSR output matches the client's
    // first render before this runs (avoids a hydration mismatch).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCaseState(loadFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(caseState));
  }, [caseState, hydrated]);

  const value = useMemo<CaseContextValue>(
    () => ({
      caseState,
      updateCase: (patch) =>
        setCaseState((prev) => (typeof patch === "function" ? patch(prev) : { ...prev, ...patch })),
      resetCase: () => setCaseState(DEFAULT_CASE),
    }),
    [caseState]
  );

  return <CaseContext.Provider value={value}>{children}</CaseContext.Provider>;
}

export function useCase(): CaseContextValue {
  const ctx = useContext(CaseContext);
  if (!ctx) throw new Error("useCase must be used within a CaseProvider");
  return ctx;
}
