import * as React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "secondary"
    | "success"
    | "warning"
    | "destructive"
    | "outline";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs transition-colors",
          {
            "bg-primary/10 text-primary": variant === "default",
            "bg-muted text-foreground": variant === "secondary",
            "bg-success/15 text-success": variant === "success",
            "bg-warning/15 text-warning": variant === "warning",
            "bg-destructive/10 text-destructive": variant === "destructive",
            "border border-border bg-card text-foreground":
              variant === "outline",
          },
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Badge.displayName = "Badge";

export { Badge };
