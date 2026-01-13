import type { SiteContent } from "@/lib/content";

type FooterProps = {
  content: SiteContent["footer"];
};

export function Footer({ content }: FooterProps) {
  return (
    <footer className="section-shell flex flex-col gap-3 pb-16 pt-10 text-sm text-muted">
      <div className="flex flex-wrap items-center gap-3">
        <span className="chip text-xs font-semibold uppercase tracking-[0.08em]">
          {content.courseLabel}
        </span>
        <span>{content.courseName}</span>
      </div>
      <p>{content.blurb}</p>
    </footer>
  );
}
