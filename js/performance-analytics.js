/**
 * LaraTech Advanced Performance Monitoring
 * Comprehensive performance tracking and analytics
 */

// ============================================
// Performance Analytics
// ============================================
const PerformanceAnalytics = {
  metrics: {
    navigation: {},
    paint: {},
    vitals: {},
    custom: {},
  },

  // Track Core Web Vitals
  trackWebVitals() {
    // Largest Contentful Paint
    if ("PerformanceObserver" in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.vitals.lcp = lastEntry.startTime;
        this.reportMetric("lcp", lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.metrics.vitals.fid = entry.processingStart - entry.startTime;
          this.reportMetric("fid", this.metrics.vitals.fid);
        });
      });
      fidObserver.observe({ entryTypes: ["first-input"] });

      // Cumulative Layout Shift
      let clsScore = 0;
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsScore += entry.value;
            this.metrics.vitals.cls = clsScore;
            this.reportMetric("cls", clsScore);
          }
        });
      });
      clsObserver.observe({ entryTypes: ["layout-shift"] });

      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.metrics.vitals.fcp = entry.startTime;
          this.reportMetric("fcp", entry.startTime);
        });
      });
      fcpObserver.observe({ entryTypes: ["paint"] });
    }
  },

  // Track Navigation Timing
  trackNavigationTiming() {
    window.addEventListener("load", () => {
      const navigation = performance.getEntriesByType("navigation")[0];
      this.metrics.navigation = {
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        request: navigation.responseStart - navigation.requestStart,
        response: navigation.responseEnd - navigation.responseStart,
        dom:
          navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart,
        load: navigation.loadEventEnd - navigation.loadEventStart,
        total: navigation.loadEventEnd - navigation.navigationStart,
      };

      this.reportMetric("navigation", this.metrics.navigation);
    });
  },

  // Track Resource Timing
  trackResourceTiming() {
    if ("PerformanceObserver" in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const resource = {
            name: entry.name,
            duration: entry.duration,
            size: entry.transferSize,
            type: entry.initiatorType,
          };

          // Track slow resources
          if (entry.duration > 1000) {
            this.reportMetric("slow-resource", resource);
          }
        });
      });
      resourceObserver.observe({ entryTypes: ["resource"] });
    }
  },

  // Track Long Tasks
  trackLongTasks() {
    if ("PerformanceObserver" in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.reportMetric("long-task", {
            duration: entry.duration,
            startTime: entry.startTime,
          });
        });
      });
      longTaskObserver.observe({ entryTypes: ["longtask"] });
    }
  },

  // Track Memory Usage
  trackMemoryUsage() {
    if ("memory" in performance) {
      setInterval(() => {
        const memory = {
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
          limit: performance.memory.jsHeapSizeLimit,
        };

        this.metrics.custom.memory = memory;

        // Alert if memory usage is high
        if (memory.used / memory.limit > 0.8) {
          this.reportMetric("high-memory", memory);
        }
      }, 30000); // Check every 30 seconds
    }
  },

  // Track User Interactions
  trackUserInteractions() {
    let interactionCount = 0;
    let lastInteraction = 0;

    const trackInteraction = (type) => {
      const now = performance.now();
      const timeSinceLastInteraction = now - lastInteraction;

      interactionCount++;
      lastInteraction = now;

      this.reportMetric("user-interaction", {
        type,
        count: interactionCount,
        timeSinceLastInteraction,
      });
    };

    ["click", "keydown", "scroll", "touchstart"].forEach((eventType) => {
      document.addEventListener(eventType, () => trackInteraction(eventType), {
        passive: true,
      });
    });
  },

  // Track Frame Rate
  trackFrameRate() {
    let frameCount = 0;
    let lastTime = performance.now();
    let fpsHistory = [];

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        fpsHistory.push(fps);

        // Keep only last 10 measurements
        if (fpsHistory.length > 10) {
          fpsHistory.shift();
        }

        const avgFPS =
          fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length;

        this.metrics.custom.fps = {
          current: fps,
          average: avgFPS,
          history: fpsHistory,
        };

        // Report low FPS
        if (fps < 30) {
          this.reportMetric("low-fps", { fps, average: avgFPS });
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  },

  // Track Custom Metrics
  trackCustomMetric(name, value, metadata = {}) {
    this.metrics.custom[name] = {
      value,
      timestamp: performance.now(),
      metadata,
    };

    this.reportMetric("custom", { name, value, metadata });
  },

  // Report metrics to analytics
  reportMetric(type, data) {
    // Console logging for development
    console.log(`Performance Metric [${type}]:`, data);

    // Send to analytics service (Google Analytics, etc.)
    if (typeof gtag !== "undefined") {
      gtag("event", "performance_metric", {
        metric_type: type,
        metric_data: JSON.stringify(data),
        page_location: window.location.href,
      });
    }

    // Store in localStorage for offline analysis
    this.storeMetric(type, data);
  },

  // Store metrics locally
  storeMetric(type, data) {
    const key = `perf_${type}_${Date.now()}`;
    const metric = {
      type,
      data,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    try {
      localStorage.setItem(key, JSON.stringify(metric));

      // Clean up old metrics (keep last 100)
      this.cleanupOldMetrics();
    } catch (error) {
      console.warn("Failed to store performance metric:", error);
    }
  },

  // Clean up old metrics
  cleanupOldMetrics() {
    const keys = Object.keys(localStorage).filter((key) =>
      key.startsWith("perf_")
    );
    if (keys.length > 100) {
      keys
        .sort()
        .slice(0, keys.length - 100)
        .forEach((key) => {
          localStorage.removeItem(key);
        });
    }
  },

  // Get performance report
  getPerformanceReport() {
    return {
      metrics: this.metrics,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connection: navigator.connection
        ? {
            effectiveType: navigator.connection.effectiveType,
            downlink: navigator.connection.downlink,
            rtt: navigator.connection.rtt,
          }
        : null,
    };
  },

  // Export metrics
  exportMetrics() {
    const report = this.getPerformanceReport();
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `performance-report-${Date.now()}.json`;
    a.click();

    URL.revokeObjectURL(url);
  },
};

// ============================================
// Performance Budget Monitoring
// ============================================
const PerformanceBudget = {
  budgets: {
    lcp: 2500, // 2.5s
    fid: 100, // 100ms
    cls: 0.25, // 0.25
    fcp: 1800, // 1.8s
    fmp: 2000, // 2s
    tti: 3800, // 3.8s
    tbt: 300, // 300ms
  },

  // Check if metrics are within budget
  checkBudget(metric, value) {
    const budget = this.budgets[metric];
    if (budget && value > budget) {
      console.warn(
        `⚠️ Performance budget exceeded for ${metric}: ${value}ms (budget: ${budget}ms)`
      );

      // Report budget violation
      PerformanceAnalytics.reportMetric("budget-violation", {
        metric,
        value,
        budget,
        violation: value - budget,
      });

      return false;
    }
    return true;
  },

  // Set custom budget
  setBudget(metric, value) {
    this.budgets[metric] = value;
  },
};

// ============================================
// Initialize Performance Monitoring
// ============================================
const initAdvancedPerformanceMonitoring = () => {
  // Track all performance metrics
  PerformanceAnalytics.trackWebVitals();
  PerformanceAnalytics.trackNavigationTiming();
  PerformanceAnalytics.trackResourceTiming();
  PerformanceAnalytics.trackLongTasks();
  PerformanceAnalytics.trackMemoryUsage();
  PerformanceAnalytics.trackUserInteractions();
  PerformanceAnalytics.trackFrameRate();

  // Make analytics available globally
  window.PerformanceAnalytics = PerformanceAnalytics;
  window.PerformanceBudget = PerformanceBudget;

  console.log("Advanced performance monitoring initialized! 📊");
};

// Auto-initialize
if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initAdvancedPerformanceMonitoring
  );
} else {
  initAdvancedPerformanceMonitoring();
}
