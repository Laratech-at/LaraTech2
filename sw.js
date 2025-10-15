/**
 * LaraTech Service Worker
 * Implements caching strategies, offline support, and performance optimization
 */

const CACHE_NAME = "laratech-v1.0.0";
const STATIC_CACHE = "laratech-static-v1.0.0";
const DYNAMIC_CACHE = "laratech-dynamic-v1.0.0";

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/main.js",
  "/js/animations.js",
  "/assets/logo.png",
  "/assets/favicon.svg",
];

// Resources to cache on demand
const CACHE_PATTERNS = [
  /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
  /\.(?:css|js)$/,
  /\.(?:html|htm)$/,
];

// Install event - cache critical resources
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Service Worker: Caching critical resources");
        return cache.addAll(CRITICAL_RESOURCES);
      })
      .then(() => {
        console.log("Service Worker: Installation complete");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("Service Worker: Installation failed", error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log("Service Worker: Deleting old cache", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("Service Worker: Activation complete");
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Handle different types of requests
  if (isCriticalResource(request.url)) {
    // Cache First strategy for critical resources
    event.respondWith(cacheFirst(request));
  } else if (isImageResource(request.url)) {
    // Cache First strategy for images
    event.respondWith(cacheFirst(request));
  } else if (isHTMLResource(request.url)) {
    // Network First strategy for HTML pages
    event.respondWith(networkFirst(request));
  } else {
    // Stale While Revalidate for other resources
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Cache First strategy
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error("Cache First failed:", error);
    return new Response("Offline - Resource not available", {
      status: 503,
      statusText: "Service Unavailable",
    });
  }
}

// Network First strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page for HTML requests
    if (request.headers.get("accept").includes("text/html")) {
      return (
        caches.match("/offline.html") ||
        new Response("Offline", {
          status: 503,
          statusText: "Service Unavailable",
        })
      );
    }

    throw error;
  }
}

// Stale While Revalidate strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });

  return cachedResponse || fetchPromise;
}

// Helper functions
function isCriticalResource(url) {
  return CRITICAL_RESOURCES.some((resource) => url.includes(resource));
}

function isImageResource(url) {
  return /\.(?:png|jpg|jpeg|svg|gif|webp)$/i.test(url);
}

function isHTMLResource(url) {
  return /\.(?:html|htm)$/i.test(url) || url.endsWith("/");
}

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  if (event.tag === "contact-form") {
    event.waitUntil(syncContactForm());
  }
});

async function syncContactForm() {
  try {
    const formData = await getStoredFormData();
    if (formData) {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await clearStoredFormData();
        console.log("Contact form synced successfully");
      }
    }
  } catch (error) {
    console.error("Background sync failed:", error);
  }
}

// Message handling for cache management
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "CACHE_URLS") {
    event.waitUntil(
      caches.open(STATIC_CACHE).then((cache) => cache.addAll(event.data.urls))
    );
  }
});

// Performance monitoring
self.addEventListener("fetch", (event) => {
  const startTime = performance.now();

  event.respondWith(
    (async () => {
      try {
        const response = await fetch(event.request);
        const endTime = performance.now();

        // Log performance metrics
        console.log(
          `Fetch: ${event.request.url} - ${(endTime - startTime).toFixed(2)}ms`
        );

        return response;
      } catch (error) {
        const endTime = performance.now();
        console.log(
          `Fetch failed: ${event.request.url} - ${(endTime - startTime).toFixed(
            2
          )}ms`
        );
        throw error;
      }
    })()
  );
});

console.log("LaraTech Service Worker loaded successfully! 🚀");
