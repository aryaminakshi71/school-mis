import { useEffect, useRef, useState } from "react";

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    fcp: 0, // First Contentful Paint
    lcp: 0, // Largest Contentful Paint
    fid: 0, // First Input Delay
    cls: 0, // Cumulative Layout Shift
    ttfb: 0, // Time to First Byte
  });

  useEffect(() => {
    // First Contentful Paint
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      setMetrics((prev) => ({ ...prev, fcp: lastEntry.startTime }));
    });
    observer.observe({ entryTypes: ["paint"] });

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      setMetrics((prev) => ({ ...prev, lcp: lastEntry.startTime }));
    });
    lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        setMetrics((prev) => ({
          ...prev,
          fid: entry.processingStart - entry.startTime,
        }));
      });
    });
    fidObserver.observe({ entryTypes: ["first-input"] });

    // Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      setMetrics((prev) => ({ ...prev, cls: clsValue }));
    });
    clsObserver.observe({ entryTypes: ["layout-shift"] });

    // Time to First Byte
    const navigationEntries = performance.getEntriesByType("navigation");
    if (navigationEntries.length > 0) {
      const navEntry = navigationEntries[0] as PerformanceNavigationTiming;
      setMetrics((prev) => ({
        ...prev,
        ttfb: navEntry.responseStart - navEntry.requestStart,
      }));
    }

    return () => {
      observer.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  return metrics;
};

// Component render time tracking
export const useRenderTime = (componentName: string) => {
  const renderStart = useRef(performance.now());

  useEffect(() => {
    const renderTime = performance.now() - renderStart.current;
    console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);

    // In production, you might want to send this to analytics
    if (renderTime > 16.67) {
      // More than one frame at 60fps
      console.warn(`${componentName} slow render: ${renderTime.toFixed(2)}ms`);
    }
  });
};

// Lazy loading with intersection observer
export const useLazyLoad = (threshold = 0.1) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      { threshold },
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, hasIntersected]);

  return { ref, isIntersecting, hasIntersected };
};

// Memory usage monitoring
export const useMemoryMonitor = () => {
  const [memoryInfo, setMemoryInfo] = useState({
    used: 0,
    total: 0,
    limit: 0,
    usagePercent: 0,
  });

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ("memory" in performance) {
        const memory = (performance as any).memory;
        const used = memory.usedJSHeapSize;
        const total = memory.totalJSHeapSize;
        const limit = memory.jsHeapSizeLimit;

        setMemoryInfo({
          used: Math.round(used / 1024 / 1024), // MB
          total: Math.round(total / 1024 / 1024), // MB
          limit: Math.round(limit / 1024 / 1024), // MB
          usagePercent: Math.round((used / limit) * 100),
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
};

// Bundle size monitoring
export const useBundleAnalyzer = () => {
  useEffect(() => {
    // This would typically be used with webpack bundle analyzer
    // For now, we'll just log bundle information
    if (import.meta.hot) {
      console.log("Bundle analysis: Hot reload active");
    }
  }, []);
};

// Network request monitoring
export const useNetworkMonitor = () => {
  const [networkStats, setNetworkStats] = useState({
    requests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    totalDataTransferred: 0,
  });

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      let totalResponseTime = 0;
      let dataTransferred = 0;
      let failedCount = 0;

      entries.forEach((entry: any) => {
        if (entry.responseEnd && entry.requestStart) {
          totalResponseTime += entry.responseEnd - entry.requestStart;
        }
        if (entry.transferSize) {
          dataTransferred += entry.transferSize;
        }
        if (entry.responseStatus >= 400) {
          failedCount++;
        }
      });

      setNetworkStats((prev) => ({
        requests: prev.requests + entries.length,
        failedRequests: prev.failedRequests + failedCount,
        averageResponseTime:
          entries.length > 0 ? totalResponseTime / entries.length : 0,
        totalDataTransferred: prev.totalDataTransferred + dataTransferred,
      }));
    });

    observer.observe({ entryTypes: ["resource"] });

    return () => observer.disconnect();
  }, []);

  return networkStats;
};

// Alias for backwards compatibility
export const usePerformanceMonitoring = () => usePerformanceMonitor();
