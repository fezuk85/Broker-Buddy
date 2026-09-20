"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowRight } from "lucide-react";
import { SCENARIOS, getScenario, getToolTitle } from "@/lib/seo/scenarios";

// The chosen scenario lives in the URL hash (#residential-purchase) so it survives a refresh, can be
// shared, and works with the back button. Reading it via useSyncExternalStore avoids a hydration mismatch.
function subscribe(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}
const getHash = () => window.location.hash.replace(/^#/, "");
const getServerHash = () => "";

export function ScenarioPicker() {
  const hash = useSyncExternalStore(subscribe, getHash, getServerHash);
  const selected = getScenario(hash);

  const choose = (id: string) => {
    if (id === selected?.id) return;
    window.history.pushState(null, "", `#${id}`);
    // pushState does not fire hashchange itself, so tell the subscriber the hash moved.
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };

  return (
    <div>
      <div role="group" aria-label="What are you working on?" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SCENARIOS.map((s) => {
          const active = s.id === selected?.id;
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={active}
              onClick={() => choose(s.id)}
              className={`bb-tap-target text-left rounded-xl border p-4 transition-shadow hover:shadow-md ${
                active
                  ? "border-[var(--bb-primary)] bg-[color-mix(in_srgb,var(--bb-primary)_8%,white)]"
                  : "border-[var(--bb-border)] bg-white"
              }`}
            >
              <span className="block font-medium">{s.title}</span>
              <span className="mt-0.5 block text-sm text-[var(--bb-muted)]">{s.blurb}</span>
            </button>
          );
        })}
      </div>

      <div aria-live="polite" className="mt-8">
        {selected ? (
          <section aria-labelledby="toolkit-heading">
            <h2 id="toolkit-heading" className="text-lg font-semibold">
              Your toolkit: {selected.title}
            </h2>
            <ol className="mt-4 space-y-3">
              {selected.tools.map((t, i) => (
                <li key={t.slug}>
                  <Link
                    href={`/${t.slug}`}
                    className="bb-card flex items-start gap-4 p-4 hover:shadow-md transition-shadow"
                  >
                    <span
                      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                      style={{ background: "var(--bb-primary)" }}
                    >
                      {i + 1}
                    </span>
                    <span className="flex-1">
                      <span className="block font-medium">{getToolTitle(t.slug)}</span>
                      <span className="block text-sm text-[var(--bb-muted)]">{t.note}</span>
                    </span>
                    <ArrowRight size={16} className="mt-1 shrink-0 text-[var(--bb-muted)]" />
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ) : (
          <p className="text-sm text-[var(--bb-muted)]">Choose a case type above and the tools for it will appear here.</p>
        )}
      </div>
    </div>
  );
}
