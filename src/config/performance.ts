// Performance configuration for handling large datasets
export const PERFORMANCE_CONFIG = {
  // Memory Management
  MAX_CATS_IN_MEMORY: 100,           // Maximum cats to keep in DOM
  AUTO_CLEANUP_THRESHOLD: 150,       // Trigger cleanup when exceeded
  SOFT_LIMIT_TOTAL: 500,            // Total cats loaded before showing warning
  
  // Loading Configuration  
  LOAD_BATCH_SIZE: 10,              // Cats per API request
  MAX_CONCURRENT_REQUESTS: 3,       // Prevent too many simultaneous requests
  
  // Virtual Scrolling (for future enhancement)
  VIRTUAL_SCROLL_ENABLED: false,    // Toggle virtual scrolling
  ITEM_HEIGHT: 400,                 // Height of each cat card
  OVERSCAN: 5,                      // Items to render outside viewport
  
  // Image Performance
  LAZY_LOADING: true,               // Enable lazy loading for images
  IMAGE_CACHE_SIZE: 50,             // Number of images to cache
  
  // User Experience
  SHOW_PERFORMANCE_INFO: true,      // Show memory usage info
  ENABLE_INFINITE_SCROLL: false,    // Auto-load on scroll (alternative to Load More button)
  WARNING_AT_CATS: 200,            // Show performance warning
} as const;

// Performance monitoring utilities
export class PerformanceMonitor {
  private static memoryInfo: any = (performance as any)?.memory;
  
  static getMemoryUsage() {
    if (!this.memoryInfo) return null;
    
    return {
      used: Math.round(this.memoryInfo.usedJSHeapSize / 1048576), // MB
      total: Math.round(this.memoryInfo.totalJSHeapSize / 1048576), // MB
      limit: Math.round(this.memoryInfo.jsHeapSizeLimit / 1048576), // MB
    };
  }
  
  static shouldShowMemoryWarning() {
    const memory = this.getMemoryUsage();
    if (!memory) return false;
    
    return memory.used > memory.limit * 0.8; // 80% of limit
  }
  
  static logPerformanceMetrics(catsCount: number) {
    const memory = this.getMemoryUsage();
    console.log(`🐱 Performance Metrics:`, {
      catsInDOM: catsCount,
      memoryUsage: memory ? `${memory.used}MB / ${memory.limit}MB` : 'Unknown',
      timestamp: new Date().toISOString()
    });
  }
}

// Debounce utility for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
}

// Image preloading for better UX
export class ImagePreloader {
  private static cache = new Map<string, HTMLImageElement>();
  
  static preload(urls: string[], maxConcurrent: number = 3): Promise<void> {
    return new Promise(resolve => {
      const urlQueue = [...urls];
      let completed = 0;
      let inProgress = 0;
      
      const loadNext = () => {
        if (urlQueue.length === 0 && inProgress === 0) {
          resolve();
          return;
        }
        
        while (inProgress < maxConcurrent && urlQueue.length > 0) {
          const url = urlQueue.shift()!;
          inProgress++;
          
          const img = new Image();
          this.cache.set(url, img);
          
          img.onload = img.onerror = () => {
            inProgress--;
            completed++;
            loadNext();
          };
          
          img.src = url;
        }
      };
      
      loadNext();
    });
  }
  
  static getCachedImage(url: string): HTMLImageElement | undefined {
    return this.cache.get(url);
  }
}