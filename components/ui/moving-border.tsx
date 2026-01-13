"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MovingBorderButtonProps = {
  children: ReactNode;
  className?: string;
  borderRadius?: string;
  href?: string;
};

/**
 * Moving-border button inspired by Aceternity UI.
 * Uses a conic gradient ring; honors prefers-reduced-motion and token colors.
 */
export function Button({
  children,
  className,
  borderRadius = "12px",
  href
}: MovingBorderButtonProps) {
  const Ring = () => (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden",
        "bg-[conic-gradient(from_0deg,var(--accent),var(--accent2),var(--accent))]",
        "motion-safe:animate-[spin_8s_linear_infinite]"
      )}
      style={{ borderRadius }}
    >
      <span
        className="absolute inset-[2px] rounded-[inherit] bg-[color-mix(in_srgb,var(--card)_96%,transparent_4%)]"
        style={{ borderRadius }}
      />
    </span>
  );

  const face = (
    <span
      className={cn(
        "relative z-10 inline-flex items-center gap-2 rounded-[inherit] px-4 py-2 text-sm font-semibold text-fg",
        "border border-[color-mix(in_srgb,var(--line)_75%,transparent_25%)]",
        "bg-[color-mix(in_srgb,var(--card)_96%,transparent_4%)] backdrop-blur-sm",
        className
      )}
      style={{ borderRadius }}
    >
      {children}
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="relative inline-flex overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color-mix(in_srgb,var(--accent)_70%,transparent_30%)]"
        style={{ borderRadius }}
      >
        <Ring />
        {face}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className="relative inline-flex overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color-mix(in_srgb,var(--accent)_70%,transparent_30%)]"
      style={{ borderRadius }}
    >
      <Ring />
      {face}
    </button>
  );
}
