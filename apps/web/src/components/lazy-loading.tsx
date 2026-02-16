/**
 * Lazy Loading Utilities
 * Provides loading skeletons and lazy loading helpers
 */

import { ComponentType, Suspense } from "react";

/**
 * Default loading skeleton for routes
 */
export function RouteLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-muted p-4">
      <div className="mx-auto max-w-7xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/4 rounded bg-muted"></div>
          <div className="h-4 w-1/2 rounded bg-muted"></div>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="h-32 rounded bg-muted"></div>
            <div className="h-32 rounded bg-muted"></div>
            <div className="h-32 rounded bg-muted"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Default loading skeleton for components
 */
export function ComponentLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      <div className="h-4 w-3/4 rounded bg-muted"></div>
      <div className="h-4 w-1/2 rounded bg-muted"></div>
    </div>
  );
}

/**
 * Wrapper for lazy-loaded components with Suspense
 */
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  fallback?: React.ReactNode,
) {
  return function LazyComponent(props: P) {
    return (
      <Suspense fallback={fallback || <ComponentLoadingSkeleton />}>
        <Component {...props} />
      </Suspense>
    );
  };
}
