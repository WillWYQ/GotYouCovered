"use client";

import { useEffect, useState } from "react";
import type { FinfetViewerApi } from "@/lib/finfetViewer";

/**
 * Bootstraps the FinFET viewer and exposes a simple inline slider for fin count.
 * The heavy Three.js controls still live in the overlay panel.
 */
export function FinfetViewer() {
  const [api, setApi] = useState<FinfetViewerApi | null>(null);
  const [finCount, setFinCount] = useState(3);

  useEffect(() => {
    let handle: FinfetViewerApi | null = null;

    import("@/lib/finfetViewer")
      .then((mod) => {
        handle = mod.initFinfetViewer({
          containerSelector: "#finfet-viewer"
        });
        if (handle) {
          setApi(handle);
          const current = handle.getState();
          setFinCount(current.finCount);
        }
      })
      .catch((err) => {
        console.error("[FinFET Viewer] failed to load module", err);
      });

    return () => {
      handle?.dispose();
    };
  }, []);

  useEffect(() => {
    if (api) {
      api.setFinCount(finCount);
    }
  }, [api, finCount]);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[color-mix(in_srgb,var(--line)_75%,transparent_25%)] bg-[color-mix(in_srgb,var(--card)_92%,transparent_8%)] px-3 py-2 text-xs text-muted">
      <span className="chip text-[10px] font-semibold text-fg">
        Slider: # of fins
      </span>
      <label className="flex flex-1 items-center gap-3">
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={finCount}
          onChange={(e) => setFinCount(Number(e.target.value))}
          className="w-full accent-[var(--accent)]"
          disabled={!api}
          aria-label="Number of fins"
        />
        <span className="value min-w-[70px] text-[11px] font-semibold text-fg">
          {finCount} fin{finCount === 1 ? "" : "s"}
        </span>
      </label>
    </div>
  );
}
