## I've Got You Covered — NE406 Semiconductor Devices (Planar / FinFET / GAA)

Semiconductor-flavored one-pager built with **Next.js (App Router) + Tailwind**. Respects system theme and reduced motion; no business logic — just layout, style, and content slots.

### Quickstart
- `npm install`
- Initialize shadcn (required before adding components): `npx shadcn@latest init`
- Install the Aceternity components used for the visual skeleton (feel free to add more as you wire interactions):
  - `npx shadcn@latest add @aceternity/spotlight`
  - `npx shadcn@latest add @aceternity/tracing-beam`
  - `npx shadcn@latest add @aceternity/hover-border-gradient`
  - `npx shadcn@latest add @aceternity/background-grid-small` (or the grid/dot variant you prefer)
  - `npx shadcn@latest add @aceternity/bento-grid`
  - `npx shadcn@latest add @aceternity/compare`
- `npm run dev`

### What’s inside
- **Style tokens** in `app/globals.css`: `--bg`, `--fg`, `--muted`, `--card`, `--line`, `--accent`, `--accent2`, with dark-mode overrides plus wafer-grid, glow, and subtle noise.
- **Components** live under `components/site/` (TopBar, Hero, SectionShell, TransistorCard deck, Playground, Footer). Colors pull from tokens; glass cards, thin lines, and neon accents match the semiconductor aesthetic.
- **Page structure** in `app/page.tsx` keeps single-page storytelling with anchor IDs: `hero`, `tiny-switch`, `planar`, `shrink`, `finfet`, `gaa`, `playground`, `recap`.

### Notes
- Motion is minimal (hover lift/glow, light fades). `prefers-reduced-motion` cuts it down.
- Navigation is anchor-based; no extra routes.
- If you need to swap to JS instead of TS, keep it consistent across the app.
