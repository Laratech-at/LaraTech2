/**
 * LaraTech - Main JavaScript
 * Handles: Theme Toggle, Language Switcher, Navigation, Mobile Menu,
 * Counters, Forms, Lazy Loading, Cookie Consent, Performance Monitoring
 */

// ============================================
// Theme Toggle (Dark/Light Mode)
// ============================================
const initTheme = () => {
  const themeToggle = document.getElementById("theme-toggle");
  const html = document.documentElement;

  // Check for saved theme preference or default to dark mode
  const currentTheme = localStorage.getItem("theme") || "dark";
  html.classList.add(currentTheme);

  themeToggle?.addEventListener("click", () => {
    const isDark = html.classList.contains("dark");
    html.classList.remove("dark", "light");
    html.classList.add(isDark ? "light" : "dark");
    localStorage.setItem("theme", isDark ? "light" : "dark");
  });
};

// ============================================
// Language Switcher (EN / SQ)
// ============================================
const initLanguageSwitcher = () => {
  const langToggle = document.getElementById("lang-toggle");
  const currentLangDisplay = document.getElementById("current-lang");

  // Get saved language or default to EN
  let currentLang = localStorage.getItem("lang") || "en";
  updateLanguage(currentLang);

  langToggle?.addEventListener("click", () => {
    currentLang = currentLang === "en" ? "sq" : "en";
    localStorage.setItem("lang", currentLang);
    updateLanguage(currentLang);
  });

  function updateLanguage(lang) {
    currentLangDisplay.textContent = lang.toUpperCase();

    // Update all elements with language attributes
    document.querySelectorAll("[data-lang-en]").forEach((element) => {
      const text = element.getAttribute(`data-lang-${lang}`);
      if (text) {
        // Check if it's an input/textarea placeholder
        if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
          element.placeholder = text;
        } else {
          element.textContent = text;
        }
      }
    });
  }
};

// ============================================
// Mobile Menu Toggle
// ============================================
const initMobileMenu = () => {
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  mobileMenuToggle?.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !mobileMenu?.contains(e.target) &&
      !mobileMenuToggle?.contains(e.target)
    ) {
      mobileMenu?.classList.add("hidden");
    }
  });

  // Close mobile menu when clicking a link
  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
    });
  });
};

// ============================================
// Sticky Navigation on Scroll
// ============================================
const initStickyNav = () => {
  const navbar = document.getElementById("navbar");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      navbar?.classList.add("scrolled");
    } else {
      navbar?.classList.remove("scrolled");
    }

    lastScroll = currentScroll;
  });
};

// ============================================
// Animated Counters
// ============================================
const initCounters = () => {
  const counters = document.querySelectorAll(".counter");
  let hasAnimated = false;

  const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute("data-target"));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };

    updateCounter();
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          animateCounter(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));
};

// ============================================
// Fade In on Scroll
// ============================================
const initFadeInObserver = () => {
  const fadeElements = document.querySelectorAll(".fade-in");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, index * 100); // Stagger animation
        }
      });
    },
    { threshold: 0.1 }
  );

  fadeElements.forEach((element) => observer.observe(element));
};

// ============================================
// Loading Animation
// ============================================
const initLoadingAnimation = () => {
  const loadingOverlay = document.getElementById("loading-overlay");
  const arcPath = document.getElementById("arc-path");
  const logoText = document.getElementById("logo-text");

  // Animate arc drawing
  setTimeout(() => {
    arcPath?.animate([{ strokeDashoffset: 1000 }, { strokeDashoffset: 0 }], {
      duration: 1500,
      easing: "ease-in-out",
      fill: "forwards",
    });
  }, 300);

  // Show logo text with flicker
  setTimeout(() => {
    if (logoText) {
      logoText.style.opacity = "1";

      // Flicker effect
      const flickers = [0, 100, 200, 300, 400];
      flickers.forEach((delay) => {
        setTimeout(() => {
          logoText.style.opacity = "0.5";
          setTimeout(() => (logoText.style.opacity = "1"), 50);
        }, 1800 + delay);
      });
    }
  }, 1800);

  // Fade out loading overlay
  setTimeout(() => {
    if (loadingOverlay) {
      loadingOverlay.style.transition = "opacity 0.5s ease";
      loadingOverlay.style.opacity = "0";
      setTimeout(() => {
        loadingOverlay.style.display = "none";
      }, 500);
    }
  }, 3500);
};

// ============================================
// Magnetic Button Effect
// ============================================
const initMagneticButtons = () => {
  const magneticButtons = document.querySelectorAll(".magnetic-button");

  magneticButtons.forEach((button) => {
    button.addEventListener("mousemove", (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const distance = Math.sqrt(x * x + y * y);
      const maxDistance = 100;

      if (distance < maxDistance) {
        const strength = (maxDistance - distance) / maxDistance;
        const moveX = x * strength * 0.3;
        const moveY = y * strength * 0.3;

        button.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "translate(0, 0)";
    });
  });
};

// ============================================
// Particles Background Animation
// ============================================
const initParticles = () => {
  const particlesContainer = document.getElementById("particles-container");
  if (!particlesContainer) return;

  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");

    // Random starting position
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";

    // Random animation delay and duration
    particle.style.animationDelay = Math.random() * 20 + "s";
    particle.style.animationDuration = Math.random() * 10 + 15 + "s";

    particlesContainer.appendChild(particle);
  }
};

// ============================================
// Lazy Loading Images
// ============================================
const initLazyLoading = () => {
  const lazyImages = document.querySelectorAll("img[data-src]");

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.getAttribute("data-src");
        img.classList.add("loaded");
        img.removeAttribute("data-src");
        imageObserver.unobserve(img);
      }
    });
  });

  lazyImages.forEach((img) => imageObserver.observe(img));
};

// ============================================
// Cookie Consent Banner
// ============================================
const initCookieConsent = () => {
  const cookieBanner = document.getElementById("cookie-banner");
  const acceptButton = document.getElementById("accept-cookies");

  // Check if user has already accepted cookies
  if (!localStorage.getItem("cookies-accepted")) {
    setTimeout(() => {
      cookieBanner?.classList.add("show");
    }, 2000);
  }

  acceptButton?.addEventListener("click", () => {
    localStorage.setItem("cookies-accepted", "true");
    cookieBanner?.classList.remove("show");
  });
};

// ============================================
// Contact Form Handling
// ============================================
const initContactForm = () => {
  const contactForm = document.getElementById("contact-form");

  contactForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Message sent successfully! We'll get back to you soon.");
        contactForm.reset();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send message. Please try again or contact us directly.");
    }
  });
};

// ============================================
// Lightbox for Images/Videos
// ============================================
const initLightbox = () => {
  const lightboxTriggers = document.querySelectorAll("[data-lightbox]");

  if (lightboxTriggers.length === 0) return;

  // Create lightbox element
  const lightbox = document.createElement("div");
  lightbox.classList.add("lightbox");
  lightbox.innerHTML = `
        <button class="lightbox-close" style="position: absolute; top: 20px; right: 20px; background: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; font-size: 24px; z-index: 10000;">&times;</button>
        <div class="lightbox-content"></div>
    `;
  document.body.appendChild(lightbox);

  const lightboxContent = lightbox.querySelector(".lightbox-content");
  const closeButton = lightbox.querySelector(".lightbox-close");

  lightboxTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const src = trigger.getAttribute("data-lightbox");
      const type = trigger.getAttribute("data-lightbox-type") || "image";

      if (type === "image") {
        lightboxContent.innerHTML = `<img src="${src}" alt="Lightbox image" />`;
      } else if (type === "video") {
        lightboxContent.innerHTML = `<video controls autoplay src="${src}"></video>`;
      }

      lightbox.classList.add("active");
    });
  });

  closeButton.addEventListener("click", () => {
    lightbox.classList.remove("active");
    lightboxContent.innerHTML = "";
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove("active");
      lightboxContent.innerHTML = "";
    }
  });
};

// ============================================
// Progress Bar (Reading Progress)
// ============================================
const initProgressBar = () => {
  const progressBar = document.createElement("div");
  progressBar.classList.add("progress-bar");
  document.body.appendChild(progressBar);

  window.addEventListener("scroll", () => {
    const windowHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.pageYOffset / windowHeight;
    progressBar.style.transform = `scaleX(${scrolled})`;
  });
};

// ============================================
// Before/After Slider
// ============================================
const initBeforeAfterSlider = () => {
  const sliders = document.querySelectorAll(".before-after-slider");

  sliders.forEach((slider) => {
    const after = slider.querySelector(".after");
    let isDragging = false;

    const updateSlider = (x) => {
      const rect = slider.getBoundingClientRect();
      const position = ((x - rect.left) / rect.width) * 100;
      const clampedPosition = Math.max(0, Math.min(100, position));
      after.style.clipPath = `inset(0 ${100 - clampedPosition}% 0 0)`;
    };

    slider.addEventListener("mousedown", () => (isDragging = true));
    slider.addEventListener("mouseup", () => (isDragging = false));
    slider.addEventListener("mouseleave", () => (isDragging = false));

    slider.addEventListener("mousemove", (e) => {
      if (isDragging) {
        updateSlider(e.clientX);
      }
    });

    slider.addEventListener("touchmove", (e) => {
      updateSlider(e.touches[0].clientX);
    });
  });
};

// ============================================
// Core Web Vitals Monitoring
// ============================================
const initPerformanceMonitoring = () => {
  if ("PerformanceObserver" in window) {
    // Measure Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log("LCP:", lastEntry.renderTime || lastEntry.loadTime);
    });
    lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

    // Measure First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.log("FID:", entry.processingStart - entry.startTime);
      });
    });
    fidObserver.observe({ entryTypes: ["first-input"] });

    // Measure Cumulative Layout Shift (CLS)
    let clsScore = 0;
    const clsObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsScore += entry.value;
          console.log("CLS:", clsScore);
        }
      });
    });
    clsObserver.observe({ entryTypes: ["layout-shift"] });
  }
};

// ============================================
// Route/Directions Button
// ============================================
const initDirectionsButton = () => {
  const directionsButtons = document.querySelectorAll("[data-directions]");
  const address = "Rr. Safet Boletini 46, Iliridë, Mitrovica, Kosovo";

  directionsButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const encodedAddress = encodeURIComponent(address);

      if (isMobile) {
        // Try to open native maps app
        window.location.href = `geo:0,0?q=${encodedAddress}`;

        // Fallback to Google Maps if geo: doesn't work
        setTimeout(() => {
          window.open(
            `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
            "_blank"
          );
        }, 500);
      } else {
        // Open Google Maps in browser
        window.open(
          `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
          "_blank"
        );
      }
    });
  });
};

// ============================================
// Initialize All Functions on Page Load
// ============================================
const init = () => {
  // Respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!prefersReducedMotion) {
    initLoadingAnimation();
  } else {
    // Hide loading immediately if reduced motion is preferred
    const loadingOverlay = document.getElementById("loading-overlay");
    if (loadingOverlay) loadingOverlay.style.display = "none";
  }

  // Core functionality
  initTheme();
  initLanguageSwitcher();
  initMobileMenu();
  initStickyNav();
  initCounters();
  initFadeInObserver();
  initMagneticButtons();
  initParticles();
  initLazyLoading();
  initCookieConsent();
  initContactForm();
  initLightbox();
  initProgressBar();
  initBeforeAfterSlider();
  initPerformanceMonitoring();
  initDirectionsButton();

  console.log("LaraTech website initialized successfully! 🚀");
};

// Run initialization when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// Export functions for use in other scripts
window.LaraTech = {
  initTheme,
  initLanguageSwitcher,
  initMobileMenu,
  initStickyNav,
  initCounters,
  initFadeInObserver,
  initMagneticButtons,
  initParticles,
  initLazyLoading,
  initCookieConsent,
  initContactForm,
  initLightbox,
  initProgressBar,
  initBeforeAfterSlider,
  initPerformanceMonitoring,
  initDirectionsButton,
};
