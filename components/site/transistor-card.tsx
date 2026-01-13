import { cn } from "@/lib/utils";
import { PlanarCardViewer } from "./planar-card-viewer";

type CardProps = {
  tag: string;
  title: string;
  summary: string;
  pros: string[];
  cons: string[];
  focus: string;
};

export function TransistorCard({
  tag,
  title,
  summary,
  pros,
  cons,
  focus
}: CardProps) {
  const isPlanar = tag === "Planar";

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--line)_85%,transparent_15%)]",
        "bg-[color-mix(in_srgb,var(--card)_94%,transparent_6%)] p-5 transition duration-300",
        "hover:-translate-y-1 hover:shadow-[0_20px_60px_-36px_var(--accent)] focus-within:shadow-[0_20px_60px_-36px_var(--accent)]"
      )}
    >
      <div className="pointer-events-none absolute inset-[-1px] rounded-2xl bg-gradient-to-br from-[color-mix(in_srgb,var(--accent)_25%,transparent)] via-transparent to-[color-mix(in_srgb,var(--accent2)_18%,transparent)] opacity-0 transition duration-300 group-hover:opacity-70 group-focus-within:opacity-70" />
      <div className="relative flex items-center gap-2">
        <span className="chip bg-[color-mix(in_srgb,var(--accent)_18%,var(--card)_82%)] text-[9px] font-semibold text-fg">
          Focus: {focus}
        </span>
      </div>
      <div className="relative mt-3 space-y-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-sm text-muted">{summary}</p>
      </div>
      <div className="relative mt-4 grid gap-3 rounded-xl border border-[color-mix(in_srgb,var(--line)_80%,transparent_20%)] bg-[color-mix(in_srgb,var(--card)_90%,transparent_10%)] p-4">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.08em] text-muted">
          <span>Pros</span>
          <span>Cons</span>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="flex flex-wrap gap-2">
            {pros.map((p) => (
              <span
                key={p}
                className="chip text-xs font-semibold text-[color-mix(in_srgb,var(--accent)_80%,var(--fg)_20%)] bg-[color-mix(in_srgb,var(--accent)_16%,var(--card)_84%)]"
              >
                {p}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {cons.map((c) => (
              <span
                key={c}
                className="chip text-xs font-semibold text-[color-mix(in_srgb,var(--accent2)_78%,var(--fg)_22%)] bg-[color-mix(in_srgb,var(--accent2)_16%,var(--card)_84%)]"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
      {isPlanar ? (
        <div
          id="planar-card-viewer"
          className="relative mt-4 h-52 rounded-xl border border-dashed border-[color-mix(in_srgb,var(--line)_70%,transparent_30%)] bg-[color-mix(in_srgb,var(--card)_85%,transparent_15%)]"
        >
          <span className="sr-only">Planar MOSFET viewer</span>
          <PlanarCardViewer />
        </div>
      ) : (
        <div className="relative mt-4 rounded-xl border border-dashed border-[color-mix(in_srgb,var(--line)_70%,transparent_30%)] bg-[color-mix(in_srgb,var(--card)_85%,transparent_15%)] p-4 text-sm text-muted">
          3D viewer slot — imagine a {tag} transistor model with soft cyan/violet
          glow.
        </div>
      )}
    </article>
  );
}
