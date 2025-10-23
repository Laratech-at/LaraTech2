# Performance Optimization Quick Reference Guide

## Overview

This guide provides quick reference for the performance optimizations implemented in the LaraTech website.

---

## Key Optimization Techniques Used

### 1. Event Throttling

**Purpose:** Reduce frequency of expensive operations

```javascript
// Throttle scroll events
let scrollThrottle = null;
const trackScroll = () => {
  if (scrollThrottle) return;

  scrollThrottle = setTimeout(() => {
    // Your code here
    scrollThrottle = null;
  }, 500);
};
```

**Used in:**

- Scroll event tracking
- Window resize handlers

---

### 2. DOM Measurement Caching

**Purpose:** Avoid forced reflows from repeated `getBoundingClientRect()` calls

```javascript
let cachedRect = null;
let rectCacheTime = 0;

const getCachedRect = (element, cacheMs = 100) => {
  const now = performance.now();
  if (!cachedRect || now - rectCacheTime > cacheMs) {
    cachedRect = element.getBoundingClientRect();
    rectCacheTime = now;
  }
  return cachedRect;
};
```

**Used in:**

- Magnetic button effects
- Canvas mouse tracking
- Before/After slider

---

### 3. RequestAnimationFrame Batching

**Purpose:** Batch DOM reads and writes to prevent layout thrashing

```javascript
// Batch DOM reads
requestAnimationFrame(() => {
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  // Use measurements
});

// Batch DOM writes
requestAnimationFrame(() => {
  element.style.transform = "translateX(100px)";
  element.style.opacity = "0.5";
});
```

**Used in:**

- Canvas resizing
- Style updates in sliders

---

### 4. Debouncing

**Purpose:** Delay execution until after rapid events stop

```javascript
let debounceTimeout;
const debouncedFunction = () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    // Your code here
  }, 150);
};
```

**Used in:**

- Window resize handlers
- Search input handlers

---

### 5. Limited Duration Monitoring

**Purpose:** Stop expensive monitoring after initial period

```javascript
let startTime = performance.now();
const monitorDuration = 10000; // 10 seconds

const monitor = () => {
  const currentTime = performance.now();

  if (currentTime - startTime > monitorDuration) {
    return; // Stop monitoring
  }

  // Monitoring code
  requestAnimationFrame(monitor);
};
```

**Used in:**

- FPS monitoring
- Performance metrics collection

---

### 6. Deferred Script Loading

**Purpose:** Load non-critical JavaScript after initial page load

```javascript
function loadNonCriticalScripts() {
  const scripts = ["analytics.js", "tracking.js"];

  scripts.forEach((src, index) => {
    setTimeout(() => {
      const script = document.createElement("script");
      script.src = src;
      script.defer = true;
      document.body.appendChild(script);
    }, 1000 + index * 200);
  });
}

// Load on interaction or after timeout
["click", "scroll"].forEach((event) => {
  window.addEventListener(event, loadNonCriticalScripts, { once: true });
});
setTimeout(loadNonCriticalScripts, 2000);
```

**Used in:**

- Performance monitoring scripts
- Analytics scripts
- Image optimization scripts

---

### 7. Passive Event Listeners

**Purpose:** Tell browser the listener won't call `preventDefault()`

```javascript
element.addEventListener("scroll", handler, { passive: true });
element.addEventListener("touchmove", handler, { passive: true });
element.addEventListener("wheel", handler, { passive: true });
```

**Used in:**

- All scroll handlers
- Touch event handlers
- Mouse move handlers

---

## Performance Monitoring Best Practices

### 1. Limit Console Logging

```javascript
// Bad: Log every event
document.addEventListener("scroll", () => {
  console.log("Scroll event");
});

// Good: Throttle logging
let logCount = 0;
document.addEventListener(
  "scroll",
  () => {
    if (logCount++ % 10 === 0) {
      console.log("Scroll event (every 10th)");
    }
  },
  { passive: true }
);
```

### 2. Stop Monitoring After Initial Period

```javascript
// Bad: Monitor forever
const monitorFPS = () => {
  // FPS monitoring
  requestAnimationFrame(monitorFPS);
};

// Good: Monitor for limited time
let startTime = performance.now();
const monitorFPS = () => {
  if (performance.now() - startTime > 10000) return;
  // FPS monitoring
  requestAnimationFrame(monitorFPS);
};
```

### 3. Batch Performance Metrics

```javascript
// Bad: Send each metric immediately
function reportMetric(name, value) {
  fetch("/api/metrics", {
    method: "POST",
    body: JSON.stringify({ name, value }),
  });
}

// Good: Batch metrics
let metricsBatch = [];
function reportMetric(name, value) {
  metricsBatch.push({ name, value });

  if (metricsBatch.length >= 10) {
    fetch("/api/metrics", {
      method: "POST",
      body: JSON.stringify(metricsBatch),
    });
    metricsBatch = [];
  }
}
```

---

## Common Performance Pitfalls to Avoid

### Avoid: Forced Reflows in Loops

```javascript
// Bad
for (let i = 0; i < elements.length; i++) {
  elements[i].style.width = elements[i].offsetWidth + 10 + "px";
}
```

### Do: Batch Reads and Writes

```javascript
// Good
const widths = [];
for (let i = 0; i < elements.length; i++) {
  widths.push(elements[i].offsetWidth);
}
for (let i = 0; i < elements.length; i++) {
  elements[i].style.width = widths[i] + 10 + "px";
}
```

---

### Avoid: Repeated DOM Queries

```javascript
// Bad
document.getElementById("myElement").style.color = "red";
document.getElementById("myElement").style.fontSize = "16px";
document.getElementById("myElement").style.padding = "10px";
```

### Do: Cache DOM References

```javascript
// Good
const element = document.getElementById("myElement");
element.style.color = "red";
element.style.fontSize = "16px";
element.style.padding = "10px";
```

---

### Avoid: Synchronous Operations in Event Handlers

```javascript
// Bad
element.addEventListener("scroll", () => {
  const data = processLargeDataset(); // Blocks main thread
  updateUI(data);
});
```

### Do: Use Async Operations

```javascript
// Good
element.addEventListener(
  "scroll",
  () => {
    requestAnimationFrame(() => {
      const data = processLargeDataset();
      updateUI(data);
    });
  },
  { passive: true }
);
```

---

## Performance Checklist

- [ ] All event listeners use `{ passive: true }` where appropriate
- [ ] Scroll and resize handlers are throttled/debounced
- [ ] DOM measurements are cached when possible
- [ ] Style changes are batched with `requestAnimationFrame`
- [ ] Non-critical scripts are deferred
- [ ] Performance monitoring has limited duration
- [ ] Console logging is throttled in production
- [ ] Long tasks are broken into smaller chunks
- [ ] Images are lazy loaded
- [ ] Fonts are loaded asynchronously

---

## Tools for Performance Testing

1. **Chrome DevTools Performance Tab**

   - Record page load
   - Identify long tasks
   - Check FPS

2. **Lighthouse**

   - Overall performance score
   - Core Web Vitals
   - Optimization suggestions

3. **WebPageTest**

   - Real-world performance
   - Filmstrip view
   - Network waterfall

4. **Chrome DevTools Coverage**
   - Find unused JavaScript
   - Identify code splitting opportunities

---

## Resources

- [Web.dev Performance](https://web.dev/performance/)
- [MDN Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [Core Web Vitals](https://web.dev/vitals/)

---

## Maintenance

- Review performance metrics monthly
- Update optimization strategies as needed
- Test on real devices regularly
- Monitor Core Web Vitals in production
- Keep dependencies updated
