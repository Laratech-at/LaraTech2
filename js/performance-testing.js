/**
 * LaraTech Performance Testing Suite
 * Automated performance testing and reporting
 */

// ============================================
// Performance Test Suite
// ============================================
const PerformanceTestSuite = {
  tests: [],
  results: {},

  // Add test to suite
  addTest(name, testFunction, expectedValue = null) {
    this.tests.push({
      name,
      testFunction,
      expectedValue,
      result: null,
    });
  },

  // Run all tests
  async runTests() {
    console.log("🧪 Starting Performance Test Suite...");

    for (const test of this.tests) {
      try {
        console.log(`Running test: ${test.name}`);
        const result = await test.testFunction();
        test.result = result;
        this.results[test.name] = result;

        // Check if result meets expectations
        if (test.expectedValue !== null) {
          const passed = result <= test.expectedValue;
          console.log(
            `${passed ? "✅" : "❌"} ${test.name}: ${result}ms (expected: ≤${
              test.expectedValue
            }ms)`
          );
        } else {
          console.log(`📊 ${test.name}: ${result}ms`);
        }
      } catch (error) {
        console.error(`❌ Test failed: ${test.name}`, error);
        test.result = "FAILED";
        this.results[test.name] = "FAILED";
      }
    }

    this.generateReport();
  },

  // Generate performance report
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      results: this.results,
      summary: this.generateSummary(),
    };

    console.log("📋 Performance Test Report:", report);

    // Store report
    localStorage.setItem("perf-test-report", JSON.stringify(report));

    return report;
  },

  // Generate test summary
  generateSummary() {
    const passed = Object.values(this.results).filter(
      (result) => typeof result === "number" && result !== "FAILED"
    ).length;

    const total = this.tests.length;

    return {
      total,
      passed,
      failed: total - passed,
      passRate: ((passed / total) * 100).toFixed(1) + "%",
    };
  },
};

// ============================================
// Performance Tests
// ============================================

// Test 1: Page Load Time
PerformanceTestSuite.addTest(
  "Page Load Time",
  async () => {
    return new Promise((resolve) => {
      window.addEventListener("load", () => {
        const navigation = performance.getEntriesByType("navigation")[0];
        resolve(navigation.loadEventEnd - navigation.navigationStart);
      });
    });
  },
  3000
);

// Test 2: First Contentful Paint
PerformanceTestSuite.addTest(
  "First Contentful Paint",
  async () => {
    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcp = entries.find(
          (entry) => entry.name === "first-contentful-paint"
        );
        if (fcp) {
          resolve(fcp.startTime);
          observer.disconnect();
        }
      });
      observer.observe({ entryTypes: ["paint"] });
    });
  },
  1800
);

// Test 3: Largest Contentful Paint
PerformanceTestSuite.addTest(
  "Largest Contentful Paint",
  async () => {
    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        resolve(lastEntry.startTime);
        observer.disconnect();
      });
      observer.observe({ entryTypes: ["largest-contentful-paint"] });
    });
  },
  2500
);

// Test 4: First Input Delay
PerformanceTestSuite.addTest(
  "First Input Delay",
  async () => {
    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fid = entries[0].processingStart - entries[0].startTime;
        resolve(fid);
        observer.disconnect();
      });
      observer.observe({ entryTypes: ["first-input"] });
    });
  },
  100
);

// Test 5: Cumulative Layout Shift
PerformanceTestSuite.addTest(
  "Cumulative Layout Shift",
  async () => {
    return new Promise((resolve) => {
      let clsScore = 0;
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsScore += entry.value;
          }
        });
      });
      observer.observe({ entryTypes: ["layout-shift"] });

      // Resolve after 5 seconds
      setTimeout(() => {
        observer.disconnect();
        resolve(clsScore);
      }, 5000);
    });
  },
  0.25
);

// Test 6: Time to Interactive
PerformanceTestSuite.addTest(
  "Time to Interactive",
  async () => {
    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const tti = entries.find((entry) => entry.name === "tti");
        if (tti) {
          resolve(tti.startTime);
          observer.disconnect();
        }
      });
      observer.observe({ entryTypes: ["measure"] });
    });
  },
  3800
);

// Test 7: Total Blocking Time
PerformanceTestSuite.addTest(
  "Total Blocking Time",
  async () => {
    return new Promise((resolve) => {
      let totalBlockingTime = 0;
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) {
            totalBlockingTime += entry.duration - 50;
          }
        });
      });
      observer.observe({ entryTypes: ["longtask"] });

      // Resolve after 5 seconds
      setTimeout(() => {
        observer.disconnect();
        resolve(totalBlockingTime);
      }, 5000);
    });
  },
  300
);

// Test 8: Resource Load Time
PerformanceTestSuite.addTest(
  "Resource Load Time",
  async () => {
    return new Promise((resolve) => {
      const resources = performance.getEntriesByType("resource");
      const totalTime = resources.reduce(
        (sum, resource) => sum + resource.duration,
        0
      );
      const avgTime = totalTime / resources.length;
      resolve(avgTime);
    });
  },
  1000
);

// Test 9: Memory Usage
PerformanceTestSuite.addTest(
  "Memory Usage",
  async () => {
    if ("memory" in performance) {
      const memory = performance.memory;
      const usagePercent =
        (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      return usagePercent;
    }
    return "N/A";
  },
  80
);

// Test 10: Frame Rate
PerformanceTestSuite.addTest(
  "Frame Rate",
  async () => {
    return new Promise((resolve) => {
      let frameCount = 0;
      let lastTime = performance.now();

      const measureFPS = () => {
        frameCount++;
        const currentTime = performance.now();

        if (currentTime - lastTime >= 1000) {
          const fps = Math.round(
            (frameCount * 1000) / (currentTime - lastTime)
          );
          resolve(fps);
          return;
        }

        requestAnimationFrame(measureFPS);
      };

      requestAnimationFrame(measureFPS);
    });
  },
  30
);

// ============================================
// Automated Performance Testing
// ============================================
const AutomatedTesting = {
  // Run tests on page load
  runOnLoad() {
    window.addEventListener("load", () => {
      setTimeout(() => {
        PerformanceTestSuite.runTests();
      }, 2000); // Wait 2 seconds after load
    });
  },

  // Run tests on user interaction
  runOnInteraction() {
    let hasInteracted = false;

    const runTests = () => {
      if (!hasInteracted) {
        hasInteracted = true;
        PerformanceTestSuite.runTests();
      }
    };

    ["click", "keydown", "scroll", "touchstart"].forEach((eventType) => {
      document.addEventListener(eventType, runTests, {
        once: true,
        passive: true,
      });
    });
  },

  // Run tests periodically
  runPeriodically(interval = 30000) {
    setInterval(() => {
      PerformanceTestSuite.runTests();
    }, interval);
  },
};

// ============================================
// Performance Comparison
// ============================================
const PerformanceComparison = {
  // Compare with previous results
  compareWithPrevious() {
    const currentReport = localStorage.getItem("perf-test-report");
    const previousReport = localStorage.getItem("perf-test-report-previous");

    if (currentReport && previousReport) {
      const current = JSON.parse(currentReport);
      const previous = JSON.parse(previousReport);

      console.log("📈 Performance Comparison:");

      Object.keys(current.results).forEach((testName) => {
        const currentResult = current.results[testName];
        const previousResult = previous.results[testName];

        if (
          typeof currentResult === "number" &&
          typeof previousResult === "number"
        ) {
          const improvement = previousResult - currentResult;
          const percentChange = ((improvement / previousResult) * 100).toFixed(
            1
          );

          console.log(
            `${testName}: ${currentResult}ms (${
              improvement > 0 ? "+" : ""
            }${percentChange}%)`
          );
        }
      });
    }
  },

  // Store previous results
  storePreviousResults() {
    const currentReport = localStorage.getItem("perf-test-report");
    if (currentReport) {
      localStorage.setItem("perf-test-report-previous", currentReport);
    }
  },
};

// ============================================
// Initialize Performance Testing
// ============================================
const initPerformanceTesting = () => {
  // Store previous results for comparison
  PerformanceComparison.storePreviousResults();

  // Run automated tests
  AutomatedTesting.runOnLoad();
  AutomatedTesting.runOnInteraction();

  // Make testing suite available globally
  window.PerformanceTestSuite = PerformanceTestSuite;
  window.AutomatedTesting = AutomatedTesting;
  window.PerformanceComparison = PerformanceComparison;

  console.log("🧪 Performance testing suite initialized!");
};

// Auto-initialize
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPerformanceTesting);
} else {
  initPerformanceTesting();
}
