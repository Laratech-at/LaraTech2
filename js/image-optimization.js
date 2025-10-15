/**
 * LaraTech Image Optimization
 * Implements WebP support, lazy loading, and responsive images
 */

// ============================================
// Image Optimization Utilities
// ============================================
const ImageOptimizer = {
  // Check WebP support
  supportsWebP() {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src =
        "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    });
  },

  // Generate responsive image sources
  generateSrcSet(basePath, sizes = [320, 640, 1024, 1920]) {
    return sizes.map((size) => `${basePath}?w=${size} ${size}w`).join(", ");
  },

  // Create optimized image element
  createOptimizedImage(src, alt, options = {}) {
    const img = document.createElement("img");
    img.alt = alt;
    img.loading = "lazy";
    img.decoding = "async";

    // Add performance attributes
    if (options.priority) {
      img.fetchPriority = "high";
    }

    // Set responsive attributes
    if (options.sizes) {
      img.sizes = options.sizes;
    }

    if (options.srcSet) {
      img.srcset = options.srcSet;
    }

    // Set source with WebP fallback
    this.setImageSource(img, src, options);

    return img;
  },

  // Set image source with WebP support
  async setImageSource(img, src, options = {}) {
    const supportsWebP = await this.supportsWebP();

    if (supportsWebP && !options.forceFallback) {
      // Try WebP first
      const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, ".webp");
      img.src = webpSrc;

      // Fallback to original if WebP fails
      img.onerror = () => {
        img.src = src;
      };
    } else {
      img.src = src;
    }
  },

  // Lazy load images with intersection observer
  initLazyLoading() {
    const lazyImages = document.querySelectorAll("img[data-src]");

    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              this.setImageSource(img, img.dataset.src);
              img.classList.add("loaded");
              img.removeAttribute("data-src");
              imageObserver.unobserve(img);
            }
          });
        },
        {
          rootMargin: "50px 0px",
          threshold: 0.01,
        }
      );

      lazyImages.forEach((img) => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      lazyImages.forEach((img) => {
        this.setImageSource(img, img.dataset.src);
        img.classList.add("loaded");
        img.removeAttribute("data-src");
      });
    }
  },

  // Preload critical images
  preloadCriticalImages() {
    const criticalImages = ["/assets/logo.png", "/assets/favicon.svg"];

    criticalImages.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
    });
  },

  // Optimize existing images
  optimizeExistingImages() {
    const images = document.querySelectorAll("img:not([data-optimized])");

    images.forEach((img) => {
      // Add loading attribute if not present
      if (!img.hasAttribute("loading")) {
        img.loading = "lazy";
      }

      // Add decoding attribute
      if (!img.hasAttribute("decoding")) {
        img.decoding = "async";
      }

      // Mark as optimized
      img.setAttribute("data-optimized", "true");
    });
  },
};

// ============================================
// Picture Element Generator
// ============================================
const PictureGenerator = {
  // Create responsive picture element
  createPicture(src, alt, options = {}) {
    const picture = document.createElement("picture");
    const img = document.createElement("img");

    img.alt = alt;
    img.loading = "lazy";
    img.decoding = "async";

    // Add WebP source
    if (options.webp) {
      const webpSource = document.createElement("source");
      webpSource.type = "image/webp";
      webpSource.srcset = options.webp;
      if (options.sizes) webpSource.sizes = options.sizes;
      picture.appendChild(webpSource);
    }

    // Add fallback source
    const fallbackSource = document.createElement("source");
    fallbackSource.srcset = options.fallback || src;
    if (options.sizes) fallbackSource.sizes = options.sizes;
    picture.appendChild(fallbackSource);

    // Add fallback image
    img.src = src;
    picture.appendChild(img);

    return picture;
  },
};

// ============================================
// Image Compression
// ============================================
const ImageCompressor = {
  // Compress image using Canvas API
  compressImage(file, quality = 0.8, maxWidth = 1920, maxHeight = 1080) {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(resolve, "image/jpeg", quality);
      };

      img.src = URL.createObjectURL(file);
    });
  },

  // Convert to WebP
  convertToWebP(file, quality = 0.8) {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(resolve, "image/webp", quality);
      };

      img.src = URL.createObjectURL(file);
    });
  },
};

// ============================================
// Initialize Image Optimization
// ============================================
const initImageOptimization = () => {
  // Preload critical images
  ImageOptimizer.preloadCriticalImages();

  // Initialize lazy loading
  ImageOptimizer.initLazyLoading();

  // Optimize existing images
  ImageOptimizer.optimizeExistingImages();

  console.log("Image optimization initialized! 📸");
};

// Export for use in other modules
window.ImageOptimizer = ImageOptimizer;
window.PictureGenerator = PictureGenerator;
window.ImageCompressor = ImageCompressor;

// Auto-initialize
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initImageOptimization);
} else {
  initImageOptimization();
}
