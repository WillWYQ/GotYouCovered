"use client";

import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef } from "react";

type ButtonState = "idle" | "loading" | "success" | "error";

type StatefulButtonProps = ComponentPropsWithoutRef<"button"> & {
  state: ButtonState;
  labels: {
    idle: string;
    loading?: string;
    success?: string;
    error?: string;
  };
};

const palette: Record<ButtonState, { border: string; bg: string }> = {
  idle: {
    border: "border-[color-mix(in_srgb,var(--line)_80%,transparent_20%)]",
    bg: "bg-[color-mix(in_srgb,var(--card)_92%,transparent_8%)]"
  },
  loading: {
    border: "border-[color-mix(in_srgb,var(--line)_70%,transparent_30%)]",
    bg: "bg-[color-mix(in_srgb,var(--card)_90%,transparent_10%)]"
  },
  success: {
    border: "border-[color-mix(in_srgb,var(--accent)_70%,transparent_30%)]",
    bg: "bg-[color-mix(in_srgb,var(--accent)_12%,var(--card)_88%)]"
  },
  error: {
    border: "border-[color-mix(in_srgb,var(--accent2)_70%,transparent_30%)]",
    bg: "bg-[color-mix(in_srgb,var(--accent2)_12%,var(--card)_88%)]"
  }
};

export function StatefulButton({
  state,
  labels,
  className,
  disabled,
  ...props
}: StatefulButtonProps) {
  const label =
    state === "success"
      ? labels.success ?? "Done"
      : state === "error"
        ? labels.error ?? "Try again"
        : state === "loading"
          ? labels.loading ?? "Checking..."
          : labels.idle;

  const tone =
    state === "error"
      ? "var(--accent2)"
      : state === "success"
        ? "var(--accent)"
        : "var(--accent)";

  return (
    <button
      type="button"
      className={cn(
        "group relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-4 py-2 text-sm font-semibold text-fg transition duration-200",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color-mix(in_srgb,var(--accent)_70%,transparent_30%)]",
        "shadow-[0_12px_30px_-20px_color-mix(in_srgb,var(--accent)_50%,transparent)]",
        palette[state].border,
        palette[state].bg,
        state === "loading" ? "cursor-progress opacity-90" : "hover:-translate-y-[1px]",
        disabled ? "opacity-60" : "",
        className
      )}
      disabled={disabled || state === "loading"}
      {...props}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 45%), radial-gradient(circle at 80% 30%, color-mix(in srgb, var(--accent2) 14%, transparent), transparent 40%)"
        }}
      />
      <span className="relative inline-flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5 items-center justify-center">
          {state === "loading" ? (
            <>
              <span
                aria-hidden
                className="absolute h-full w-full animate-ping rounded-full"
                style={{
                  backgroundColor: tone,
                  opacity: 0.35
                }}
              />
              <span
                className="relative h-2 w-2 animate-spin rounded-full border-2 border-transparent"
                style={{
                  borderTopColor: tone,
                  borderLeftColor: tone
                }}
              />
            </>
          ) : (
            <span
              className="h-2.5 w-2.5 rounded-full shadow-[0_0_0_8px_color-mix(in_srgb,var(--accent)_12%,transparent)] transition duration-200"
              style={{
                backgroundColor: tone,
                boxShadow:
                  state === "error"
                    ? "0 0 0 8px color-mix(in srgb, var(--accent2) 12%, transparent)"
                    : state === "success"
                      ? "0 0 0 8px color-mix(in srgb, var(--accent) 12%, transparent)"
                      : "0 0 0 8px color-mix(in srgb, var(--accent) 10%, transparent)"
              }}
            />
          )}
        </span>
        <span className="relative">{label}</span>
      </span>
    </button>
  );
}
