"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LayoutGrid } from "lucide-react";
import { getGroupedCalculators } from "@/lib/seo/calculators";

/** Header dropdown listing every calculator by group. Closes on navigation, outside click and Escape. */
export function AllCalculatorsMenu() {
  // The menu counts as open only on the page it was opened from, so navigating closes it.
  const pathname = usePathname();
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const ref = useRef<HTMLDivElement>(null);
  const setOpen = (o: boolean) => setOpenAt(o ? pathname : null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
        className="bb-tap-target inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium border border-[var(--bb-border)] bg-white hover:bg-[var(--bb-bg)]"
      >
        <LayoutGrid size={15} strokeWidth={2} />
        <span className="hidden sm:inline">All calculators</span>
        <span className="sm:hidden">Menu</span>
        <ChevronDown size={14} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-[min(92vw,680px)] max-h-[80vh] overflow-y-auto bb-card p-5 shadow-lg z-30">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            {getGroupedCalculators().map(({ group, calculators }) => (
              <div key={group.id}>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--bb-muted)] mb-1.5">
                  {group.title}
                </h3>
                <ul className="space-y-0.5">
                  {calculators.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/${c.slug}`}
                        className="flex min-h-11 items-center rounded-lg px-2 sm:min-h-0 sm:py-1.5 text-sm hover:bg-[var(--bb-bg)]"
                      >
                        {c.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
