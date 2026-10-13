"use client";

import { useId, useState } from "react";
import { useBranding } from "@/lib/branding/BrandingProvider";
import { Image as ImageIcon, X } from "lucide-react";

const MAX_FILE_BYTES = 1_500_000; // 1.5MB raw file — keeps the data URL well within localStorage limits
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

/**
 * Lets a broker upload their own company logo once; it's stored locally in this browser (never
 * sent anywhere) and reused across every PDF export (case summary, second charge and bridging
 * quotations) via BrandingProvider, so it only needs setting up a single time.
 */
export function LogoUpload() {
  const { logoDataUrl, setLogo } = useBranding();
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();

  function handleFile(file: File) {
    setError(null);
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Use a PNG, JPEG, WebP or SVG image.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError("Image is too large — please use one under 1.5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setLogo(reader.result);
    };
    reader.onerror = () => setError("Couldn't read that file — please try again.");
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex items-center gap-3">
      {logoDataUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- local data URL, not a served asset */}
          <img src={logoDataUrl} alt="Your company logo" className="h-10 w-auto max-w-[120px] object-contain rounded border border-[var(--bb-border)] bg-white p-1" />
          <label htmlFor={inputId} className="bb-tap-target cursor-pointer text-sm font-medium underline" style={{ color: "var(--bb-primary)" }}>
            Change logo
          </label>
          <button
            type="button"
            onClick={() => setLogo(null)}
            className="bb-tap-target inline-flex items-center gap-1 text-sm text-[var(--bb-muted)] hover:text-[var(--bb-foreground)]"
          >
            <X size={14} strokeWidth={2.25} />
            Remove
          </button>
        </>
      ) : (
        <label
          htmlFor={inputId}
          className="bb-tap-target cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[var(--bb-border)] px-3 py-2 text-sm text-[var(--bb-muted)] hover:text-[var(--bb-foreground)] hover:border-[var(--bb-primary)]"
        >
          <ImageIcon size={15} strokeWidth={2.25} />
          Add your company logo to PDFs
        </label>
      )}
      <input
        id={inputId}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
