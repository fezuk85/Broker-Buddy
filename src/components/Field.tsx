export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-[var(--bb-foreground)]">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-[var(--bb-muted)]">{hint}</span>}
    </label>
  );
}

const baseInputClass =
  "mt-1 w-full rounded-lg border border-[var(--bb-border)] bg-white px-3 py-2 text-sm bb-tap-target focus:outline-none focus:ring-2 focus:ring-[var(--bb-primary)]/40 focus:border-[var(--bb-primary)]";

export function NumberInput({
  value,
  onChange,
  min = 0,
  step = "any",
  placeholder,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: number | "any";
  placeholder?: string;
}) {
  return (
    <input
      type="number"
      className={baseInputClass}
      value={Number.isFinite(value) ? value : ""}
      min={min}
      step={step}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
    />
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      className={baseInputClass}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function DateInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <input type="date" className={baseInputClass} value={value} onChange={(e) => onChange(e.target.value)} />
  );
}

export function CheckboxInput({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label className="mt-1 flex items-center gap-2 text-sm bb-tap-target">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-[var(--bb-border)]"
      />
      {label}
    </label>
  );
}

export function SelectInput<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <select className={baseInputClass} value={value} onChange={(e) => onChange(e.target.value as T)}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
