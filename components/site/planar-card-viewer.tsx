"use client";

import { useEffect } from "react";

/**
 * Lightweight mount for the MOSFET viewer in the Planar transistor card.
 * Uses the existing viewer module but hides extra chrome for a minimal embed.
 */
export function PlanarCardViewer() {
  useEffect(() => {
    let dispose: (() => void) | null = null;

    import("@/lib/mosfetViewer")
      .then((mod) => {
        const init = mod.initMosfetViewer;
        dispose = init({
          containerSelector: "#planar-card-viewer"
        }) as (() => void) | null;

        const container = document.getElementById("planar-card-viewer");
        const fsBtn = container?.querySelector<HTMLButtonElement>(
          ".mosfet-fs-btn"
        );
        if (fsBtn) {
          fsBtn.style.display = "none";
        }
        const labelLayer =
          container?.querySelector<HTMLElement>(".mosfet-label-layer");
        if (labelLayer) {
          labelLayer.style.display = "none";
        }
      })
      .catch((err) => {
        console.error("[PlanarCardViewer] failed to load module", err);
      });

    return () => {
      if (dispose) dispose();
    };
  }, []);

  return null;
}
