import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type ModuleTone = "primary" | "success" | "warning" | "danger" | "neutral";

interface ModulePageProps {
  children: ReactNode;
  className?: string;
}

interface ModuleHeroProps {
  eyebrow?: string;
  title: string;
  description: string;
  badge?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

interface ModuleMetricCardProps {
  label: string;
  value: string | number;
  meta?: string;
  icon: LucideIcon;
  tone?: ModuleTone;
}

interface ModuleTabsProps {
  tabs: Array<{
    label: string;
    to?: string;
    icon?: LucideIcon;
    active?: boolean;
    onClick?: () => void;
  }>;
}

interface ModulePanelProps {
  children: ReactNode;
  className?: string;
}

const toneStyles: Record<ModuleTone, string> = {
  primary: "bg-primary/12 text-primary ring-primary/15",
  success: "bg-success/15 text-success ring-success/15",
  warning: "bg-warning/15 text-warning ring-warning/15",
  danger: "bg-destructive/10 text-destructive ring-destructive/15",
  neutral: "bg-secondary text-secondary-foreground ring-border/80",
};

export function ModulePage({ children, className }: ModulePageProps) {
  return <div className={cn("app-page-shell", className)}>{children}</div>;
}

export function ModuleHero({
  eyebrow,
  title,
  description,
  badge,
  actions,
  children,
  className,
}: ModuleHeroProps) {
  return (
    <section className={cn("app-page-hero", className)}>
      <div className="app-page-header-row">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {eyebrow ? (
              <span className="app-page-kicker">{eyebrow}</span>
            ) : null}
            {badge ? <Badge variant="secondary">{badge}</Badge> : null}
          </div>
          <div className="space-y-2">
            <h1 className="font-semibold text-3xl text-foreground tracking-tight sm:text-4xl">
              {title}
            </h1>
            <p className="max-w-3xl text-muted-foreground text-sm leading-6 sm:text-base">
              {description}
            </p>
          </div>
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
      {children ? <div className="mt-6">{children}</div> : null}
    </section>
  );
}

export function ModuleMetricsGrid({ children }: { children: ReactNode }) {
  return <div className="app-page-metrics">{children}</div>;
}

export function ModuleMetricCard({
  label,
  value,
  meta,
  icon: Icon,
  tone = "primary",
}: ModuleMetricCardProps) {
  return (
    <Card className="overflow-hidden border-white/70 bg-white/88 shadow-sm">
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="space-y-2">
          <p className="font-semibold text-muted-foreground text-xs uppercase tracking-[0.16em]">
            {label}
          </p>
          <p className="font-semibold text-2xl text-foreground tracking-tight sm:text-3xl">
            {value}
          </p>
          {meta ? (
            <p className="text-muted-foreground text-sm">{meta}</p>
          ) : null}
        </div>
        <div className={cn("rounded-2xl p-3 ring-1", toneStyles[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ModuleTabs({ tabs }: ModuleTabsProps) {
  return (
    <div className="app-page-tabs">
      {tabs.map((tab) => {
        const content = (
          <>
            {tab.icon ? <tab.icon className="h-4 w-4" /> : null}
            <span>{tab.label}</span>
          </>
        );

        if (tab.to) {
          return (
            <Link
              key={tab.label}
              to={tab.to}
              className={cn("app-page-tab", tab.active && "is-active")}
            >
              {content}
            </Link>
          );
        }

        return (
          <button
            key={tab.label}
            type="button"
            onClick={tab.onClick}
            className={cn("app-page-tab", tab.active && "is-active")}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}

export function ModulePanel({ children, className }: ModulePanelProps) {
  return (
    <section className={cn("app-page-panel", className)}>{children}</section>
  );
}
