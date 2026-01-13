import { siteContent } from "@/lib/content";
import { CalloutBadge } from "@/components/site/callout-badge";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/site/hero";
import { FinfetViewer } from "@/components/site/finfet-viewer";
import { Playground } from "@/components/site/playground";
import { SectionShell } from "@/components/site/section-shell";
import { TopBar } from "@/components/site/top-bar";
import { TransistorCard } from "@/components/site/transistor-card";
import { Quiz } from "@/components/site/quiz";

export default function Page() {
  const {
    branding,
    navLinks,
    hero,
    sections,
    transistorCards,
    playground,
    footer
  } = siteContent;
  const {
    tinySwitch,
    planar,
    shrink,
    finfet,
    gaa,
    playground: playgroundSection,
    recap
  } = sections;

  return (
    <main className="semicon-bg">
      <div className="noise" aria-hidden />
      <TopBar branding={branding} links={navLinks} />
      <Hero content={hero} />

      <SectionShell
        id={tinySwitch.id}
        eyebrow={tinySwitch.eyebrow}
        title={tinySwitch.title}
        subtitle={tinySwitch.subtitle}
      >
        <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-4 text-muted">
            {tinySwitch.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {tinySwitch.chips ? (
              <div className="flex flex-wrap gap-2">
                {tinySwitch.chips.map((chip) => (
                  <span key={chip} className="chip text-xs font-semibold">
                    {chip}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <div className="flex flex-col gap-4 rounded-2xl border border-[color-mix(in_srgb,var(--line)_80%,transparent_20%)] bg-[color-mix(in_srgb,var(--card)_90%,transparent_10%)] p-4">
            <p className="text-sm font-semibold text-fg">
              {tinySwitch.takeaways.title}
            </p>
            <ul className="space-y-2 text-sm text-muted">
              {tinySwitch.takeaways.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {tinySwitch.takeaways.badge ? (
              <CalloutBadge
                tone={tinySwitch.takeaways.badge.tone}
                label={tinySwitch.takeaways.badge.label}
              />
            ) : null}
          </div>
        </div>
      </SectionShell>

      <SectionShell
        id={planar.id}
        eyebrow={planar.eyebrow}
        title={planar.title}
        subtitle={planar.subtitle}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3 text-muted">
            {planar.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {planar.chips ? (
              <div className="flex flex-wrap gap-2">
                {planar.chips.map((chip) => (
                  <span key={chip} className="chip text-xs font-semibold">
                    {chip}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <div className="rounded-2xl border border-[color-mix(in_srgb,var(--line)_70%,transparent_30%)] bg-[color-mix(in_srgb,var(--card)_85%,transparent_15%)] p-4 text-sm text-muted">
            <p className="mb-3">{planar.visualNote}</p>
            <div
              className="mosfet-shell relative h-[320px] rounded-xl border border-dashed border-[color-mix(in_srgb,var(--line)_60%,transparent_40%)] bg-[color-mix(in_srgb,var(--card)_80%,transparent_20%)]"
              data-mosfet-viewer
            >
              <div data-mosfet-canvas className="h-full w-full" />
              <div data-mosfet-controls />
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        id={shrink.id}
        eyebrow={shrink.eyebrow}
        title={shrink.title}
        subtitle={shrink.subtitle}
      >
        <div className="grid gap-5 lg:grid-cols-[1fr,0.8fr]">
          <div className="space-y-3 text-muted">
            {shrink.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {shrink.callout ? (
              <CalloutBadge
                tone={shrink.callout.tone}
                label={shrink.callout.label}
              />
            ) : null}
          </div>
          <div className="rounded-2xl border border-[color-mix(in_srgb,var(--line)_80%,transparent_20%)] bg-[color-mix(in_srgb,var(--card)_90%,transparent_10%)] p-4 text-sm text-muted">
            {shrink.visualNote}
          </div>
        </div>
      </SectionShell>

      <SectionShell
        id={finfet.id}
        eyebrow={finfet.eyebrow}
        title={finfet.title}
        subtitle={finfet.subtitle}
      >
        <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-3 text-muted">
            {finfet.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {finfet.chips ? (
              <div className="flex flex-wrap gap-2">
                {finfet.chips.map((chip) => (
                  <span key={chip} className="chip text-xs font-semibold">
                    {chip}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <div className="space-y-4">
            <div className="space-y-3 rounded-2xl border border-[color-mix(in_srgb,var(--line)_80%,transparent_20%)] bg-[color-mix(in_srgb,var(--card)_90%,transparent_10%)] p-4">
              <div className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                <span className="chip text-[10px]">Gate OFF / ON</span>
                <span className="chip text-[10px]">Slider: # of fins</span>
              </div>
              <div
                id="finfet-viewer"
                data-finfet-viewer
                className="relative h-[360px] rounded-xl border border-dashed border-[color-mix(in_srgb,var(--line)_70%,transparent_30%)] bg-[color-mix(in_srgb,var(--card)_85%,transparent_15%)]"
              >
                <div data-finfet-canvas className="h-full w-full" />
                <div data-finfet-controls />
              </div>
              <FinfetViewer />
              <p className="text-xs text-muted">
                Toggle the gate to hide/show current arrows and glow. Move the slider to add fins symmetrically (center first, then pairs).
              </p>
            </div>
            <div className="space-y-3 rounded-2xl border border-[color-mix(in_srgb,var(--line)_80%,transparent_20%)] bg-[color-mix(in_srgb,var(--card)_90%,transparent_10%)] p-4">
              <p className="text-sm font-semibold text-fg">
                {finfet.takeaways.title}
              </p>
              <ul className="space-y-2 text-sm text-muted">
                {finfet.takeaways.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        id={gaa.id}
        eyebrow={gaa.eyebrow}
        title={gaa.title}
        subtitle={gaa.subtitle}
      >
        <div className="grid gap-6 lg:grid-cols-[1fr,0.9fr]">
          <div className="space-y-3 text-muted">
            {gaa.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {gaa.chips ? (
              <div className="flex flex-wrap gap-2">
                {gaa.chips.map((chip) => (
                  <span key={chip} className="chip text-xs font-semibold">
                    {chip}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <div className="space-y-3 rounded-2xl border border-[color-mix(in_srgb,var(--line)_80%,transparent_20%)] bg-[color-mix(in_srgb,var(--card)_90%,transparent_10%)] p-4">
            <p className="text-sm font-semibold text-fg">
              {gaa.takeaways.title}
            </p>
            <ul className="space-y-2 text-sm text-muted">
              {gaa.takeaways.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        id={playgroundSection.id}
        eyebrow={playgroundSection.eyebrow}
        title={playgroundSection.title}
        subtitle={playgroundSection.subtitle}
      >
        <Playground content={playground} />
      </SectionShell>

      <SectionShell
        id={recap.id}
        eyebrow={recap.eyebrow}
        title={recap.title}
        subtitle={recap.subtitle}
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm font-semibold text-fg">
              {recap.cardsTitle}
            </p>
            <div className="grid auto-cols-[minmax(260px,1fr)] grid-flow-col gap-4 overflow-x-auto pb-2">
              {transistorCards.map((card) => (
                <TransistorCard key={card.tag} {...card} />
              ))}
            </div>
          </div>
          <Quiz quiz={recap.quiz} />
        </div>
      </SectionShell>

      <Footer content={footer} />
    </main>
  );
}
