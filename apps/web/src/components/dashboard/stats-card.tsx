import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

export function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "bg-primary/10 text-primary",
}: StatsCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div className={cn("rounded-lg p-2.5", iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
        {change && (
          <span
            className={cn(
              "font-medium text-xs",
              changeType === "positive" && "text-primary",
              changeType === "negative" && "text-destructive",
              changeType === "neutral" && "text-muted-foreground",
            )}
          >
            {change}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="font-semibold text-2xl text-card-foreground">{value}</p>
        <p className="text-muted-foreground text-sm">{title}</p>
      </div>
    </div>
  );
}
