import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type SectionShellProps = {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  align?: "left" | "center";
};

export function SectionShell({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  align = "left"
}: SectionShellProps) {
  const isCenter = align === "center";
  return (
    <section
      id={id}
      className="section-shell flex flex-col gap-6 py-14 md:py-20"
      aria-labelledby={`${id}-title`}
    >
      <div
        className={cn(
          "flex flex-col gap-2",
          isCenter ? "items-center text-center" : "items-start"
        )}
      >
        {eyebrow ? (
          <span className="chip text-xs font-semibold uppercase tracking-[0.08em]">
            {eyebrow}
          </span>
        ) : null}
        <h2
          id={`${id}-title`}
          className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[40px] lg:leading-tight"
        >
          {title}
        </h2>
        {subtitle ? (
          <p className="max-w-3xl text-base text-muted sm:text-lg">{subtitle}</p>
        ) : null}
      </div>
      <div className="rounded-2xl border border-[color-mix(in_srgb,var(--line)_90%,transparent_10%)] bg-[color-mix(in_srgb,var(--card)_92%,transparent_8%)] p-4 md:p-6">
        {children}
      </div>
    </section>
  );
}
