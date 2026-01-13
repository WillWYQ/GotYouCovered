type CalloutBadgeProps = {
  tone?: "e" | "h";
  label: string;
};

export function CalloutBadge({ tone = "e", label }: CalloutBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--line)_80%,transparent_20%)] bg-[color-mix(in_srgb,var(--card)_92%,transparent_8%)] px-3 py-1 text-xs font-semibold text-fg">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--accent)_20%,var(--card)_80%)] text-[11px] font-bold">
        {tone === "e" ? "e⁻" : "h⁺"}
      </span>
      {label}
    </span>
  );
}
