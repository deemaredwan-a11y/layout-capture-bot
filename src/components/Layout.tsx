import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Home", exact: true },
  { to: "/profile", label: "My Profile", exact: false },
  { to: "/opportunities", label: "Opportunities", exact: false },
] as const;

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <Link to="/" className="font-display text-lg font-semibold text-foreground">
            SkillBridge <span className="text-primary">Lite</span>
          </Link>
          <nav className="flex gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.exact }}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-10 sm:py-14">{children}</main>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-card p-6 shadow-soft ${className}`}>
      {children}
    </div>
  );
}

export function SkillTag({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "match" | "gap" }) {
  const tones = {
    default: "bg-secondary text-secondary-foreground",
    match: "bg-success/15 text-success",
    gap: "bg-warning/15 text-warning-foreground",
  };
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

export const btn = {
  primary:
    "inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft transition-colors hover:bg-primary/90",
  secondary:
    "inline-flex items-center justify-center rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary",
};
