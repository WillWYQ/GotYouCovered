import Link from "next/link";
import type { NavLink } from "@/lib/content";
import { cn } from "@/lib/utils";

type TopBarProps = {
  branding: {
    mark: string;
    course: string;
    title: string;
  };
  links: NavLink[];
};

export function TopBar({ branding, links }: TopBarProps) {
  return (
    <header className="sticky top-4 z-30 px-4">
      <nav
        className={cn(
          "glass flex items-center justify-between gap-4 rounded-full px-4 py-3",
          "backdrop-blur-xl border border-[color-mix(in_srgb,var(--line)_80%,transparent_20%)]",
          "shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)]"
        )}
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--card)_90%,transparent_10%)] text-sm font-semibold tracking-tight">
            {branding.mark}
          </span>
          <div>
            <p className="text-sm font-medium text-muted">{branding.course}</p>
            <p className="text-base font-semibold">{branding.title}</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm text-muted transition hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color-mix(in_srgb,var(--accent)_70%,transparent_30%)]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
