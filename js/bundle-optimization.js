/**
 * LaraTech Bundle Optimization
 * Code splitting, tree shaking, and minification utilities
 */

// ============================================
// Code Splitting Utilities
// ============================================
const BundleOptimizer = {
  // Lazy load modules
  async loadModule(modulePath) {
    try {
      const module = await import(modulePath);
      return module;
    } catch (error) {
      console.error(`Failed to load module ${modulePath}:`, error);
      return null;
    }
  },

  // Load modules on demand
  loadOnDemand(selector, modulePath, event = "click") {
    const elements = document.querySelectorAll(selector);

    elements.forEach((element) => {
      element.addEventListener(event, async () => {
        if (!element.dataset.moduleLoaded) {
          const module = await this.loadModule(modulePath);
          if (module) {
            element.dataset.moduleLoaded = "true";
            // Execute module initialization if available
            if (module.init) {
              module.init(element);
            }
          }
        }
      });
    });
  },

  // Preload modules for critical paths
  preloadModules(modules) {
    modules.forEach((module) => {
      const link = document.createElement("link");
      link.rel = "modulepreload";
      link.href = module;
      document.head.appendChild(link);
    });
  },
};

// ============================================
// CSS Optimization
// ============================================
const CSSOptimizer = {
  // Remove unused CSS
  removeUnusedCSS() {
    const usedClasses = new Set();
    const usedIds = new Set();

    // Collect used classes and IDs
    document.querySelectorAll("*").forEach((element) => {
      if (element.className) {
        element.className.split(" ").forEach((cls) => {
          if (cls.trim()) usedClasses.add(cls.trim());
        });
      }
      if (element.id) {
        usedIds.add(element.id);
      }
    });

    // Remove unused stylesheets
    document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
      if (link.href.includes("unused") || link.href.includes("vendor")) {
        // Check if stylesheet is actually used
        this.checkStylesheetUsage(link, usedClasses, usedIds);
      }
    });
  },

  // Check if stylesheet is being used
  async checkStylesheetUsage(link, usedClasses, usedIds) {
    try {
      const response = await fetch(link.href);
      const css = await response.text();

      const hasUsedClasses = Array.from(usedClasses).some(
        (cls) => css.includes(`.${cls}`) || css.includes(`.${cls} `)
      );

      const hasUsedIds = Array.from(usedIds).some(
        (id) => css.includes(`#${id}`) || css.includes(`#${id} `)
      );

      if (!hasUsedClasses && !hasUsedIds) {
        console.log("Removing unused stylesheet:", link.href);
        link.remove();
      }
    } catch (error) {
      console.warn("Could not check stylesheet usage:", error);
    }
  },

  // Inline critical CSS
  inlineCriticalCSS() {
    const criticalCSS = `
      /* Critical CSS for above-the-fold content */
      body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
      .hero { min-height: 100vh; display: flex; align-items: center; }
      .navbar { position: sticky; top: 0; z-index: 1000; }
      .cta-button { display: inline-block; padding: 1rem 2rem; background: linear-gradient(135deg, #00c8c8, #00ffff); color: white; border-radius: 0.75rem; }
    `;

    const style = document.createElement("style");
    style.textContent = criticalCSS;
    document.head.insertBefore(style, document.head.firstChild);
  },
};

// ============================================
// JavaScript Optimization
// ============================================
const JSOptimizer = {
  // Debounce function calls
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function calls
  throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // Memoize expensive calculations
  memoize(func) {
    const cache = new Map();
    return function (...args) {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = func.apply(this, args);
      cache.set(key, result);
      return result;
    };
  },

  // Lazy initialize heavy objects
  lazyInit(initFunction) {
    let instance = null;
    return function () {
      if (!instance) {
        instance = initFunction();
      }
      return instance;
    };
  },
};

// ============================================
// Resource Optimization
// ============================================
const ResourceOptimizer = {
  // Optimize images
  optimizeImages() {
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      // Add loading attribute
      if (!img.hasAttribute("loading")) {
        img.loading = "lazy";
      }

      // Add decoding attribute
      if (!img.hasAttribute("decoding")) {
        img.decoding = "async";
      }

      // Add fetchpriority for above-the-fold images
      if (img.getBoundingClientRect().top < window.innerHeight) {
        img.fetchPriority = "high";
      }
    });
  },

  // Optimize fonts
  optimizeFonts() {
    // Preload critical fonts
    const criticalFonts = [
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    ];

    criticalFonts.forEach((font) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "style";
      link.href = font;
      document.head.appendChild(link);
    });
  },

  // Optimize third-party scripts
  optimizeThirdPartyScripts() {
    // Load non-critical scripts after page load
    const nonCriticalScripts = [
      "https://www.google-analytics.com/analytics.js",
      "https://www.googletagmanager.com/gtag/js",
    ];

    window.addEventListener("load", () => {
      setTimeout(() => {
        nonCriticalScripts.forEach((src) => {
          const script = document.createElement("script");
          script.src = src;
          script.async = true;
          document.head.appendChild(script);
        });
      }, 2000);
    });
  },
};

// ============================================
// Performance Budget Enforcement
// ============================================
const PerformanceBudgetEnforcer = {
  budgets: {
    maxBundleSize: 250000, // 250KB
    maxImageSize: 100000, // 100KB
    maxFontSize: 50000, // 50KB
    maxCSSSize: 50000, // 50KB
    maxJSSize: 100000, // 100KB
  },

  // Check resource sizes
  checkResourceSizes() {
    const resources = performance.getEntriesByType("resource");

    resources.forEach((resource) => {
      const size = resource.transferSize;
      const type = this.getResourceType(resource.name);

      if (size > this.budgets[`max${type}Size`]) {
        console.warn(
          `⚠️ Resource size exceeded budget: ${resource.name} (${size} bytes)`
        );
        this.reportOversizedResource(resource, type, size);
      }
    });
  },

  // Get resource type from URL
  getResourceType(url) {
    if (url.includes(".js")) return "JS";
    if (url.includes(".css")) return "CSS";
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return "Image";
    if (url.match(/\.(woff|woff2|ttf|otf)$/i)) return "Font";
    return "Bundle";
  },

  // Report oversized resources
  reportOversizedResource(resource, type, size) {
    if (typeof gtag !== "undefined") {
      gtag("event", "oversized_resource", {
        resource_url: resource.name,
        resource_type: type,
        resource_size: size,
        budget_limit: this.budgets[`max${type}Size`],
      });
    }
  },
};

// ============================================
// Initialize Bundle Optimization
// ============================================
const initBundleOptimization = () => {
  // Initialize optimizations
  CSSOptimizer.inlineCriticalCSS();
  ResourceOptimizer.optimizeImages();
  ResourceOptimizer.optimizeFonts();
  ResourceOptimizer.optimizeThirdPartyScripts();

  // Check performance budgets
  window.addEventListener("load", () => {
    PerformanceBudgetEnforcer.checkResourceSizes();
  });

  // Make optimizers available globally
  window.BundleOptimizer = BundleOptimizer;
  window.CSSOptimizer = CSSOptimizer;
  window.JSOptimizer = JSOptimizer;
  window.ResourceOptimizer = ResourceOptimizer;
  window.PerformanceBudgetEnforcer = PerformanceBudgetEnforcer;

  console.log("Bundle optimization initialized! 📦");
};

// Auto-initialize
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initBundleOptimization);
} else {
  initBundleOptimization();
}
