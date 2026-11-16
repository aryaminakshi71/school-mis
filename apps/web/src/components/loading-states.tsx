import { Progress } from "@/components/ui/progress";
import { useLoading } from "@/lib/ui-hooks";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function GlobalLoadingIndicator() {
  const { loadingStates, isLoading } = useLoading();

  if (!isLoading()) return null;

  // Get the most recent loading state
  const latestState = loadingStates[loadingStates.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 p-8">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />

        {latestState && (
          <div className="space-y-2 text-center">
            <p className="font-medium text-lg">{latestState.message}</p>

            {latestState.progress !== undefined && (
              <div className="w-64">
                <Progress value={latestState.progress} className="h-2" />
                <p className="mt-1 text-muted-foreground text-sm">
                  {Math.round(latestState.progress)}%
                </p>
              </div>
            )}
          </div>
        )}

        {loadingStates.length > 1 && (
          <p className="text-muted-foreground text-xs">
            {loadingStates.length} operations in progress...
          </p>
        )}
      </div>
    </div>
  );
}

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  message?: string;
  className?: string;
}

export function LoadingOverlay({
  isLoading,
  children,
  message = "Loading...",
  className,
}: LoadingOverlayProps) {
  return (
    <div className={cn("relative", className)}>
      {children}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-muted-foreground text-sm">{message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message = "Loading page..." }: PageLoaderProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-primary/20" />
        <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
      <p className="animate-pulse text-muted-foreground">{message}</p>
    </div>
  );
}

interface SkeletonCardProps {
  rows?: number;
  hasHeader?: boolean;
  hasFooter?: boolean;
}

export function SkeletonCard({
  rows = 3,
  hasHeader = true,
  hasFooter = false,
}: SkeletonCardProps) {
  return (
    <div className="space-y-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
      {hasHeader && (
        <div className="flex items-center justify-between">
          <div className="h-5 w-32 animate-pulse rounded bg-muted" />
          <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
        </div>
      )}

      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-4 animate-pulse rounded bg-muted" />
        ))}
      </div>

      {hasFooter && (
        <div className="flex justify-end gap-2 pt-4">
          <div className="h-9 w-20 animate-pulse rounded bg-muted" />
          <div className="h-9 w-20 animate-pulse rounded bg-muted" />
        </div>
      )}
    </div>
  );
}

export function SkeletonTable({
  rows = 5,
  columns = 4,
}: { rows?: number; columns?: number }) {
  return (
    <div className="overflow-hidden rounded-lg border">
      {/* Header */}
      <div className="border-b bg-muted/50 p-4">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div
              key={i}
              className="h-4 flex-1 animate-pulse rounded bg-muted"
            />
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4 p-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={colIndex}
                className="h-4 flex-1 animate-pulse rounded bg-muted"
                style={{
                  animationDelay: `${(rowIndex * columns + colIndex) * 50}ms`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
