# NE406 Website Style Guide (Semiconductor Aesthetic + Auto Light/Dark)

This document defines the **visual style** for our single-page educational website about **Planar MOSFET vs FinFET vs GAA**.  
Goal: look **professional enough for NE406**, but still **playful** with subtle “anime” accents. No childish visuals.

---

## 1) Style North Star

**Cleanroom Minimal + Photomask Neon + Band-Diagram Precision**

- **Cleanroom Minimal**: lots of neutral space, crisp typography, structured cards.
- **Photomask Neon**: subtle cyan/violet glow accents like EDA tools / lithography masks.
- **Band-Diagram Precision**: fine grids, thin lines, careful hierarchy (scientific “graph paper” vibe).
- **Anime accent (limited)**: mascots/callouts only (tiny, line-art feel). Never becomes the main UI.

---

## 2) Color System (Tokens)

We support **auto day/night** using CSS:
- default = light
- `@media (prefers-color-scheme: dark)` = dark
- optional manual override via `html[data-theme="light"|"dark"]` (if we add later)

### Base Tokens (Light)
- `--bg`: near-white background (cleanroom)
- `--card`: true white, slightly transparent “glass”
- `--text`: near-black
- `--muted`: slate gray (secondary text)
- `--line`: subtle borders (low contrast)

### Base Tokens (Dark)
- `--bg`: deep blue-black
- `--card`: dark navy “glass”
- `--text`: off-white
- `--muted`: cool gray

### Accent Tokens (Shared)
- `--accent` (primary): **Cyan** (EDA / scope glow)
- `--accent2` (secondary): **Violet/Magenta** (special highlight only)
- Use accent sparingly: ~80% UI is neutral.

**Rule:** *One primary accent (cyan). Violet is “special” (rare).*

---

## 3) Background Language (Semiconductor Feel)

Use a signature background that suggests **wafer / layout / photomask**:

- **Grid overlay** (layout / coordinate paper):
  - thin lines, large spacing (e.g., 48–72px)
  - low opacity; do not distract from text
- **Radial glow**:
  - cyan glow near hero title / key visuals
  - violet glow as secondary
- Optional **noise texture**:
  - very subtle; helps “SEM/film texture” vibe

**Do not** use heavy gradients, busy patterns, or high-frequency noise.

---

## 4) Typography

We want “engineering-clean but modern”:

- Headings: modern geometric sans (e.g., Space Grotesk / Sora)
- Body: readable UI sans (e.g., Inter / DM Sans)
- Parameters & labels: monospace (e.g., JetBrains Mono)

Hierarchy rules:
- H1: bold, large, tight letter spacing
- H2: compact section headers
- Body: comfortable line height (1.5–1.7)
- Use monospace for: `Vt`, `Lg`, `nm`, `E-field`, units, small labels.

---

## 5) Layout & Spacing

- Max content width: **1100–1200px**
- One-page storytelling with clear sections
- Section layout pattern:
  1) **One-line takeaway** (non-expert friendly)
  2) **3–5 key points** (cards)
  3) **NE406 foldout** (advanced details hidden)

Spacing:
- generous padding (cards: 16–20px)
- consistent vertical rhythm (section gaps: 18–26px)

---

## 6) Core Components (Visual Standards)

### 6.1 Sticky Top Bar
- Glassy pill/rounded rectangle
- blurred background, thin border
- contains: brand + section links + theme indicator

### 6.2 “Transistor Cards” (Planar / FinFET / GAA)
Each card contains:
- tag badge (Planar / FinFET / GAA)
- one-line summary
- placeholder for 3D viewer (framed “glass” panel)
- **Pros / Cons** split area
- subtle hover glow (cyan)

**Pros/Cons rule:** concise bullets; no walls of text.

### 6.3 Callouts (Anime Accent)
- only for tips / jokes / micro feedback
- uses one small mascot icon (e− or h+)
- line-art or simple circle badge style
- do not use in every section (limit frequency)

### 6.4 Tooltips (Micro Teaching)
- dashed underline for terms
- single-sentence explanation
- background matches card glass style

### 6.5 Compare / Playground Container
- big glass card with strong border & glow on focus
- can host: sliders, image compares, 3D viewers
- include small legend badges like “Shape / E-Field / Process”

### 6.6 NE406 Foldouts (Advanced)
Use `details/summary` or equivalent:
- default collapsed
- content: deeper electrostatics/process notes
- keep tone professional, short, “instructor-friendly”

---

## 7) Motion & Interaction (High-Quality, Not Distracting)

Allowed motions:
- section fade-in (light, short)
- card hover lift (1–2px)
- border glow on hover/focus

3D / heavy motion:
- default static
- rotate only on user interaction (drag)
- support reduced motion:
  - respect `prefers-reduced-motion`
  - optionally provide “Reduce Motion” toggle

Avoid:
- continuous animated backgrounds
- large parallax or fast moving particles

---

## 8) Tone & Visual “Playfulness”

Tone rules:
- Friendly, slightly playful, not childish
- Small “nerdy” metaphors allowed (“gate hugging the channel”)
- Use mascots as a spice, not a meal

Visual playfulness:
- minimal neon accents
- subtle easter eggs on hover (optional)
- never use big cartoon panels, meme fonts, or loud colors

---

## 9) Recommended Aceternity UI Usage (If using React/Tailwind)

If we use `ui.aceternity.com` components, we match their vibe:
- Spotlight for hero emphasis
- Tracing Beam for scroll storytelling
- Hover Border Gradient for cards
- Grid/Dot backgrounds for wafer/layout feel
- Compare for “FinFET vs GAA” interactive comparisons

**Important:** keep animation intensity low; provide reduced motion support.

---

## 10) Accessibility & Quality Bar

- Contrast: text must remain readable on glass cards
- Focus states: visible outline / glow for keyboard navigation
- Font sizes: avoid tiny text (<12px for labels only)
- Performance: prefer subtle effects over heavy continuous animations

---

## 11) Implementation Notes (for Codex)

- Centralize tokens in CSS variables.
- All components should read from tokens (no hard-coded colors except rare accents).
- Use consistent radius:
  - cards: 16px
  - buttons: 12px
  - pills: 999px
- Borders should be low-opacity; glow should be subtle.
- The “semiconductor feel” comes from:
  - grid + thin lines
  - clean spacing
  - neon accent on interactivity
  - glass panels
  - monospace labels

End of style guide.
