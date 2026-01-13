import type { HeroContent } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Button as MovingBorderButton } from "@/components/ui/moving-border";

type HeroProps = {
  content: HeroContent;
};

export function Hero({ content }: HeroProps) {
  return (
    <section
      id="hero"
      className="section-shell relative overflow-hidden py-16 md:py-24 lg:py-28"
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-70">
          <div className="h-full w-full bg-wafer-grid [background-size:72px_72px] [mask-image:radial-gradient(circle_at_center,rgba(0,0,0,0.35),transparent_65%)]" />
        </div>
        <div className="absolute inset-x-10 top-10 h-64 rounded-full bg-[radial-gradient(circle_at_30%_30%,color-mix(in_srgb,var(--accent)_60%,transparent),transparent_60%)] blur-3xl" />
        <div className="absolute inset-x-4 bottom-0 h-60 rounded-full bg-[radial-gradient(circle_at_70%_70%,color-mix(in_srgb,var(--accent2)_55%,transparent),transparent_60%)] blur-3xl" />
      </div>

      <div
        className={cn(
          "relative flex flex-col gap-6 rounded-3xl border border-[color-mix(in_srgb,var(--line)_85%,transparent_15%)]",
          "bg-[color-mix(in_srgb,var(--card)_92%,transparent_8%)] px-6 py-10 sm:px-10 lg:px-14"
        )}
      >
        <div className="absolute -top-32 left-10 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,rgba(50,213,255,0.35),transparent_60%)] blur-3xl" />
        <div className="absolute -bottom-36 right-10 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(179,136,255,0.28),transparent_65%)] blur-3xl" />
        <div className="relative flex flex-col gap-4">
          <p className="chip w-fit text-xs font-semibold uppercase tracking-[0.1em]">
            {content.eyebrow}
          </p>
          <h1
            id="hero-title"
            className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl"
          >
            {content.title}{" "}
            <span className="gradient-text">{content.highlight}</span>
          </h1>
          <p className="max-w-3xl text-lg text-muted">
            {content.description}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <MovingBorderButton href="#tiny-switch" borderRadius="14px">
              {content.ctaLabel}
            </MovingBorderButton>
            <span className="chip text-sm">
              {content.helper}
            </span>
          </div>
        </div>
        <div className="relative grid gap-3 rounded-2xl border border-[color-mix(in_srgb,var(--line)_75%,transparent_25%)] bg-[color-mix(in_srgb,var(--card)_90%,transparent_10%)] p-4 sm:grid-cols-3 sm:gap-4">
          {content.bullets.map((item) => (
            <div
              key={item}
              className="rounded-xl border border-[color-mix(in_srgb,var(--line)_80%,transparent_20%)] bg-[color-mix(in_srgb,var(--card)_92%,transparent_8%)] p-3 text-sm text-muted"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
