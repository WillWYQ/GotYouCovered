"use client";

import { useEffect } from "react";
import type { SiteContent } from "@/lib/content";
import type { initMosfetViewer as InitMosfetViewer } from "@/lib/mosfetViewer";

type PlaygroundProps = {
  content: SiteContent["playground"];
};

export function Playground({ content }: PlaygroundProps) {
  useEffect(() => {
    let dispose: (() => void) | null = null;
    import("@/lib/mosfetViewer")
      .then((mod) => {
        const init = mod.initMosfetViewer as typeof InitMosfetViewer;
        dispose = init();
      })
      .catch((err) => {
        console.error("[MOSFET Viewer] failed to load module", err);
      });

    return () => {
      if (dispose) {
        dispose();
      }
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[color-mix(in_srgb,var(--line)_85%,transparent_15%)] bg-[color-mix(in_srgb,var(--card)_92%,transparent_8%)] p-6 md:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,color-mix(in_srgb,var(--accent)_15%,transparent),transparent_55%),radial-gradient(circle_at_80%_70%,color-mix(in_srgb,var(--accent2)_15%,transparent),transparent_60%)] blur-3xl" />
      <div className="relative grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[color-mix(in_srgb,var(--line)_80%,transparent_20%)] bg-[color-mix(in_srgb,var(--card)_90%,transparent_10%)] p-4">
          <p className="chip text-xs font-semibold uppercase tracking-[0.08em]">
            {content.chip}
          </p>
          <h3 className="mt-2 text-xl font-semibold">{content.title}</h3>
          <p className="text-sm text-muted">
            {content.description}
          </p>
          <div className="mt-4 h-64 rounded-xl border border-dashed border-[color-mix(in_srgb,var(--line)_70%,transparent_30%)] bg-[color-mix(in_srgb,var(--card)_82%,transparent_18%)]" />
        </div>
        <div className="flex flex-col gap-3 rounded-2xl border border-[color-mix(in_srgb,var(--line)_80%,transparent_20%)] bg-[color-mix(in_srgb,var(--card)_90%,transparent_10%)] p-4">
          <div className="flex flex-wrap gap-2">
            {content.badges.map((badge) => (
              <span key={badge} className="chip text-xs font-semibold text-fg">
                {badge}
              </span>
            ))}
          </div>
          <p className="text-sm text-muted">
            {content.helper}
          </p>
        </div>
      </div>
    </div>
  );
}
