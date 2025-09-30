import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { PERFORMANCE_CONFIG } from '../config/performance';

/**
 * Hook for implementing infinite scroll functionality
 * Alternative to "Load More" button for automatic loading
 */
export const useInfiniteScroll = (
  loadMore: () => void,
  canLoadMore: boolean,
  enabled: boolean = false
) => {
  const [isFetching, setIsFetching] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !canLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isFetching && canLoadMore) {
          setIsFetching(true);
          loadMore();
        }
      },
      {
        rootMargin: '100px', // Start loading 100px before reaching the bottom
        threshold: 0.1
      }
    );

    const sentinel = sentinelRef.current;
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [loadMore, canLoadMore, enabled, isFetching]);

  useEffect(() => {
    // Reset fetching state when loading completes
    if (isFetching) {
      const timer = setTimeout(() => setIsFetching(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isFetching]);

  return {
    sentinelRef, // Attach this ref to element that triggers loading
    isFetching
  };
};

/**
 * Hook for implementing virtual scrolling with react-window (future enhancement)
 * This would be used if we want to handle 1000+ items efficiently
 */
export const useVirtualScrollConfig = (itemCount: number) => {
  const containerHeight = Math.min(window.innerHeight - 200, 800); // Max height
  
  return {
    height: containerHeight,
    itemCount,
    itemSize: PERFORMANCE_CONFIG.ITEM_HEIGHT,
    overscanCount: PERFORMANCE_CONFIG.OVERSCAN,
    // Additional config for react-window when implemented
  };
};

/**
 * Hook for performance monitoring and user warnings
 */
export const usePerformanceWarnings = (catsCount: number, totalLoaded: number) => {
  const [showMemoryWarning, setShowMemoryWarning] = useState(false);
  const [showPerformanceInfo, setShowPerformanceInfo] = useState(false);

  useEffect(() => {
    // Show performance info when user has loaded many cats
    if (totalLoaded >= PERFORMANCE_CONFIG.WARNING_AT_CATS && PERFORMANCE_CONFIG.SHOW_PERFORMANCE_INFO) {
      setShowPerformanceInfo(true);
    }

    // Check memory usage if supported by browser
    if ((performance as any)?.memory) {
      const memoryInfo = (performance as any).memory;
      const memoryUsage = memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit;
      
      if (memoryUsage > 0.8) { // 80% of memory limit
        setShowMemoryWarning(true);
      }
    }
  }, [catsCount, totalLoaded]);

  const hideMemoryWarning = () => setShowMemoryWarning(false);
  const hidePerformanceInfo = () => setShowPerformanceInfo(false);

  return {
    showMemoryWarning,
    showPerformanceInfo,
    hideMemoryWarning,
    hidePerformanceInfo
  };
};