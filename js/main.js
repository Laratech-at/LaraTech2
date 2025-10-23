/**
 * LaraTech - Main JavaScript
 * Handles: Theme Toggle, Language Switcher, Navigation, Mobile Menu,
 * Counters, Forms, Lazy Loading, Cookie Consent, Performance Monitoring
 */

// ============================================
// Theme Toggle (Dark/Light Mode) - REMOVED
// ============================================
// Dark mode functionality has been removed for simplicity

// ============================================
// Language Switcher (EN / SQ / DE) with Dropdown
// ============================================
const initLanguageSwitcher = () => {
  console.log("Initializing language switcher...");
  const langDropdownBtn = document.getElementById("lang-dropdown-btn");
  const langDropdownContent = document.getElementById("lang-dropdown-content");
  const currentLangFlag = document.getElementById("current-lang-flag");
  const currentLangCode = document.getElementById("current-lang-code");
  const langOptions = document.querySelectorAll(".lang-option");

  console.log("Language switcher elements:", {
    langDropdownBtn: !!langDropdownBtn,
    langDropdownContent: !!langDropdownContent,
    currentLangFlag: !!currentLangFlag,
    currentLangCode: !!currentLangCode,
    langOptions: langOptions.length,
  });

  // Language configuration with codes
  const languages = {
    en: { flag: "EN", name: "English", code: "EN" },
    sq: { flag: "SQ", name: "Shqip", code: "SQ" },
    de: { flag: "DE", name: "Deutsch", code: "DE" },
  };

  // Get saved language or default to EN
  let currentLang = localStorage.getItem("lang") || "en";
  updateLanguage(currentLang);

  // Toggle dropdown
  langDropdownBtn?.addEventListener("click", (e) => {
    console.log("Language dropdown clicked");
    e.preventDefault();
    e.stopPropagation();
    const isOpen = langDropdownContent?.classList.contains("show");
    if (isOpen) {
      langDropdownContent?.classList.remove("show");
    } else {
      langDropdownContent?.classList.add("show");
    }
    console.log("Dropdown show class toggled:", !isOpen);
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !langDropdownBtn?.contains(e.target) &&
      !langDropdownContent?.contains(e.target)
    ) {
      langDropdownContent?.classList.remove("show");
    }
  });

  // Language option click handlers
  langOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const selectedLang = option.getAttribute("data-lang");
      if (selectedLang && selectedLang !== currentLang) {
        currentLang = selectedLang;
        localStorage.setItem("lang", currentLang);
        updateLanguage(currentLang);
        langDropdownContent?.classList.remove("show");
      }
    });
  });

  function updateLanguage(lang) {
    const langConfig = languages[lang];
    if (!langConfig) return;

    // Update button display (globe icon stays, just update code)
    if (currentLangCode) currentLangCode.textContent = langConfig.code;

    // Update active state in dropdown
    langOptions.forEach((option) => {
      if (option.getAttribute("data-lang") === lang) {
        option.classList.add("active");
      } else {
        option.classList.remove("active");
      }
    });

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
    const isHidden = mobileMenu.classList.contains("hidden");
    mobileMenu.classList.toggle("hidden");

    // Update aria-expanded attribute
    mobileMenuToggle.setAttribute("aria-expanded", !isHidden);
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !mobileMenu?.contains(e.target) &&
      !mobileMenuToggle?.contains(e.target)
    ) {
      mobileMenu?.classList.add("hidden");
      mobileMenuToggle?.setAttribute("aria-expanded", "false");
    }
  });

  // Close mobile menu when clicking a link
  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      mobileMenuToggle?.setAttribute("aria-expanded", "false");
    });
  });
};

// ============================================
// Sticky Navigation on Scroll (Optimized)
// ============================================
const initStickyNav = () => {
  const navbar = document.getElementById("navbar");
  let lastScroll = 0;
  let ticking = false;

  // Add glassmorphism effect immediately
  if (navbar) {
    navbar.classList.add("glass-nav");
  }

  const updateNavbar = () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      navbar?.classList.add("scrolled");
    } else {
      navbar?.classList.remove("scrolled");
    }

    lastScroll = currentScroll;
    ticking = false;
  };

  const requestTick = () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  };

  window.addEventListener("scroll", requestTick, { passive: true });
};

// ============================================
// Animated Counters
// ============================================
const initCounters = () => {
  console.log("Initializing counters...");
  const counters = document.querySelectorAll(".counter");
  console.log(`Found ${counters.length} counters`);

  const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute("data-target"));
    console.log(`Animating counter to ${target}`);

    let current = 0;
    const increment = target / 50; // 50 steps for smooth animation
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        counter.textContent = target;
        clearInterval(interval);
        console.log(`Counter animation complete: ${target}`);
      } else {
        counter.textContent = Math.floor(current);
      }
    }, 40); // 25fps
  };

  // Force animation immediately
  setTimeout(() => {
    counters.forEach((counter) => {
      animateCounter(counter);
    });
  }, 500);

  // Also set up intersection observer for scroll-based animation
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
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
  const loadingLogo = document.getElementById("loading-logo");
  const loadingText = document.getElementById("loading-text");
  const loadingStatus = document.getElementById("loading-status");
  const progressBar = document.getElementById("loading-progress-bar");
  const percentageText = document.getElementById("loading-percentage");

  let progress = 0;
  const loadingSteps = [
    { percent: 25, status: "Loading assets..." },
    { percent: 50, status: "Initializing components..." },
    { percent: 75, status: "Preparing interface..." },
    { percent: 100, status: "Ready!" },
  ];

  let currentStep = 0;

  // Fade in logo
  setTimeout(() => {
    if (loadingLogo) {
      loadingLogo.style.transition = "opacity 0.8s ease";
      loadingLogo.style.opacity = "1";
    }
  }, 300);

  // Fade in text
  setTimeout(() => {
    if (loadingText) {
      loadingText.style.transition = "opacity 0.8s ease";
      loadingText.style.opacity = "1";
    }
  }, 800);

  // Fade in status
  setTimeout(() => {
    if (loadingStatus) {
      loadingStatus.style.transition = "opacity 0.5s ease";
      loadingStatus.style.opacity = "1";
    }
  }, 1200);

  // Progress bar animation
  const progressInterval = setInterval(() => {
    if (progress >= 100) {
      clearInterval(progressInterval);
      // Fade out loading overlay
      setTimeout(() => {
        if (loadingOverlay) {
          loadingOverlay.style.transition = "opacity 0.6s ease";
          loadingOverlay.style.opacity = "0";
          setTimeout(() => {
            loadingOverlay.style.display = "none";
          }, 600);
        }
      }, 500);
      return;
    }

    progress += 2;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (percentageText) {
      percentageText.textContent = `${progress}%`;
    }

    // Update status text at milestones
    if (
      currentStep < loadingSteps.length &&
      progress >= loadingSteps[currentStep].percent
    ) {
      if (loadingStatus) {
        loadingStatus.textContent = loadingSteps[currentStep].status;
      }
      currentStep++;
    }
  }, 40); // Updates every 40ms for smooth animation
};

// ============================================
// Magnetic Button Effect (Optimized)
// ============================================
const initMagneticButtons = () => {
  const magneticButtons = document.querySelectorAll(".magnetic-button");
  let animationFrameId = null;

  magneticButtons.forEach((button) => {
    let isHovering = false;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let cachedRect = null;
    let rectCacheTime = 0;

    const animate = () => {
      if (!isHovering) {
        currentX += (0 - currentX) * 0.1;
        currentY += (0 - currentY) * 0.1;
      } else {
        currentX += (targetX - currentX) * 0.1;
        currentY += (targetY - currentY) * 0.1;
      }

      button.style.transform = `translate(${currentX}px, ${currentY}px) translateZ(0)`;

      if (isHovering || Math.abs(currentX) > 0.1 || Math.abs(currentY) > 0.1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    button.addEventListener(
      "mousemove",
      (e) => {
        // Cache rect for 100ms to avoid forced reflows
        const now = performance.now();
        if (!cachedRect || now - rectCacheTime > 100) {
          cachedRect = button.getBoundingClientRect();
          rectCacheTime = now;
        }

        const x = e.clientX - cachedRect.left - cachedRect.width / 2;
        const y = e.clientY - cachedRect.top - cachedRect.height / 2;

        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = 100;

        if (distance < maxDistance) {
          const strength = (maxDistance - distance) / maxDistance;
          targetX = x * strength * 0.3;
          targetY = y * strength * 0.3;
          isHovering = true;

          if (!animationFrameId) {
            animate();
          }
        }
      },
      { passive: true }
    );

    button.addEventListener("mouseleave", () => {
      isHovering = false;
      targetX = 0;
      targetY = 0;
      cachedRect = null; // Clear cache on leave
    });
  });
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
  console.log("Initializing cookie consent...");
  
  // Add a small delay to ensure DOM is fully loaded
  setTimeout(() => {
    const cookieBanner = document.getElementById("cookie-banner");
    const acceptButton = document.getElementById("accept-cookies");
    const rejectButton = document.getElementById("reject-cookies");

    console.log("Cookie banner elements:", {
      cookieBanner: !!cookieBanner,
      acceptButton: !!acceptButton,
      rejectButton: !!rejectButton,
    });

    // Always show cookie banner for testing
    cookieBanner?.classList.add("show");
    console.log("Cookie banner shown immediately");
    
    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem("cookies-choice");
    if (cookieChoice) {
      console.log("Cookie choice already made:", cookieChoice);
    }

    // Accept cookies
    acceptButton?.addEventListener("click", () => {
      console.log("Accept cookies clicked");
      localStorage.setItem("cookies-choice", "accepted");
      localStorage.setItem("cookies-accepted", "true");
      cookieBanner?.classList.remove("show");

      // Here you can enable analytics, tracking, etc.
      console.log("Cookies accepted");
    });

    // Reject cookies
    rejectButton?.addEventListener("click", () => {
      console.log("Reject cookies clicked");
      localStorage.setItem("cookies-choice", "rejected");
      localStorage.removeItem("cookies-accepted");
      cookieBanner?.classList.remove("show");

      // Here you can disable analytics, tracking, etc.
      console.log("Cookies rejected");
    });
  }, 100); // 100ms delay to ensure DOM is ready
};

// ============================================
// Enhanced Contact Form Handling
// ============================================
const initContactForm = () => {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return;

  // Form validation rules
  const validationRules = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s]+$/,
      message:
        "Name must be 2-50 characters and contain only letters and spaces",
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
    },
    phone: {
      required: false,
      pattern: /^[\+]?[1-9][\d]{0,15}$/,
      message: "Please enter a valid phone number",
    },
    company: {
      required: false,
      maxLength: 100,
      message: "Company name must be less than 100 characters",
    },
    service: {
      required: true,
      message: "Please select a service",
    },
    message: {
      required: true,
      minLength: 10,
      maxLength: 1000,
      message: "Message must be 10-1000 characters",
    },
    privacy: {
      required: true,
      message: "You must agree to the privacy policy",
    },
  };

  // Initialize form validation
  const initFormValidation = () => {
    // Add form group wrapper to each field
    const formFields = contactForm.querySelectorAll("input, select, textarea");

    formFields.forEach((field) => {
      const wrapper = field.closest("div");
      if (wrapper && !wrapper.classList.contains("form-group")) {
        wrapper.classList.add("form-group");
      }

      // Add validation classes
      if (field.classList.contains("form-input")) return;

      field.classList.add("form-input");

      // Add error message container
      if (!wrapper.querySelector(".error-message")) {
        const errorDiv = document.createElement("div");
        errorDiv.className = "error-message";
        wrapper.appendChild(errorDiv);
      }

      // Add success message container
      if (!wrapper.querySelector(".success-message")) {
        const successDiv = document.createElement("div");
        successDiv.className = "success-message";
        wrapper.appendChild(successDiv);
      }
    });

    // Add progress bar
    if (!contactForm.querySelector(".form-progress")) {
      const progressDiv = document.createElement("div");
      progressDiv.className = "form-progress";
      progressDiv.innerHTML = '<div class="form-progress-bar"></div>';
      contactForm.insertBefore(progressDiv, contactForm.firstChild);
    }
  };

  // Validate individual field
  const validateField = (field) => {
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    const rules = validationRules[fieldName];

    if (!rules) return true;

    const wrapper = field.closest(".form-group");
    const errorMessage = wrapper?.querySelector(".error-message");
    const successMessage = wrapper?.querySelector(".success-message");

    // Clear previous states
    wrapper?.classList.remove("has-error", "has-success");

    // Required field validation
    if (rules.required && !fieldValue) {
      wrapper?.classList.add("has-error");
      if (errorMessage) {
        errorMessage.textContent = `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } is required`;
      }
      return false;
    }

    // Skip validation if field is empty and not required
    if (!fieldValue && !rules.required) {
      return true;
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(fieldValue)) {
      wrapper?.classList.add("has-error");
      if (errorMessage) {
        errorMessage.textContent = rules.message;
      }
      return false;
    }

    // Length validation
    if (rules.minLength && fieldValue.length < rules.minLength) {
      wrapper?.classList.add("has-error");
      if (errorMessage) {
        errorMessage.textContent = rules.message;
      }
      return false;
    }

    if (rules.maxLength && fieldValue.length > rules.maxLength) {
      wrapper?.classList.add("has-error");
      if (errorMessage) {
        errorMessage.textContent = rules.message;
      }
      return false;
    }

    // Success state
    wrapper?.classList.add("has-success");
    if (successMessage) {
      successMessage.textContent = "✓ Valid";
    }

    return true;
  };

  // Update form progress
  const updateFormProgress = () => {
    const fields = contactForm.querySelectorAll(
      "input[required], select[required], textarea[required]"
    );
    const validFields = Array.from(fields).filter((field) => {
      const wrapper = field.closest(".form-group");
      return wrapper?.classList.contains("has-success");
    });

    const progress = (validFields.length / fields.length) * 100;
    const progressBar = contactForm.querySelector(".form-progress-bar");
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
  };

  // Real-time validation
  const initRealTimeValidation = () => {
    const fields = contactForm.querySelectorAll("input, select, textarea");

    fields.forEach((field) => {
      // Validate on blur
      field.addEventListener("blur", () => {
        validateField(field);
        updateFormProgress();
      });

      // Validate on input (for immediate feedback)
      field.addEventListener("input", () => {
        // Clear error state on input
        const wrapper = field.closest(".form-group");
        wrapper?.classList.remove("has-error");

        // Validate after a short delay
        setTimeout(() => {
          validateField(field);
          updateFormProgress();
        }, 300);
      });

      // Special handling for checkboxes
      if (field.type === "checkbox") {
        field.addEventListener("change", () => {
          validateField(field);
          updateFormProgress();
        });
      }
    });
  };

  // Form submission with enhanced validation
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const fields = contactForm.querySelectorAll("input, select, textarea");
    let isValid = true;

    fields.forEach((field) => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) {
      // Scroll to first error
      const firstError = contactForm.querySelector(".has-error");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        firstError.querySelector("input, select, textarea")?.focus();
      }
      return;
    }

    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.classList.add("loading");
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    contactForm.classList.add("form-loading");

    try {
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      // Simulate API call (replace with actual endpoint)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // TODO: Replace with actual API endpoint
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Success state
        contactForm.innerHTML = `
          <div class="form-success">
            <h3 class="text-xl font-bold text-green-600 mb-2">✓ Message Sent Successfully!</h3>
            <p class="text-green-700">Thank you for your inquiry. We'll get back to you within 24 hours.</p>
            <button type="button" onclick="location.reload()" class="mt-4 btn btn-primary">
              Send Another Message
            </button>
          </div>
        `;
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error:", error);

      // Error state
      const errorDiv = document.createElement("div");
      errorDiv.className = "form-error";
      errorDiv.innerHTML = `
        <h3 class="text-xl font-bold text-red-600 mb-2">❌ Failed to Send Message</h3>
        <p class="text-red-700">Please try again or contact us directly at info@laratech.com</p>
        <button type="button" onclick="location.reload()" class="mt-4 btn btn-primary">
          Try Again
        </button>
      `;

      contactForm.innerHTML = "";
      contactForm.appendChild(errorDiv);
    } finally {
      // Reset button state
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      contactForm.classList.remove("form-loading");
    }
  };

  // Initialize everything
  initFormValidation();
  initRealTimeValidation();

  // Add submit event listener
  contactForm.addEventListener("submit", handleFormSubmit);
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
// Progress Bar (Reading Progress) - Optimized
// ============================================
const initProgressBar = () => {
  const progressBar = document.createElement("div");
  progressBar.classList.add("progress-bar");
  document.body.appendChild(progressBar);

  let ticking = false;

  const updateProgress = () => {
    const windowHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.pageYOffset / windowHeight;
    progressBar.style.transform = `scaleX(${scrolled}) translateZ(0)`;
    ticking = false;
  };

  const requestTick = () => {
    if (!ticking) {
      requestAnimationFrame(updateProgress);
      ticking = true;
    }
  };

  window.addEventListener("scroll", requestTick, { passive: true });
};

// ============================================
// Before/After Slider
// ============================================
const initBeforeAfterSlider = () => {
  const sliders = document.querySelectorAll(".before-after-slider");

  sliders.forEach((slider) => {
    const after = slider.querySelector(".after");
    let isDragging = false;
    let cachedSliderRect = null;
    let sliderRectCacheTime = 0;

    const updateSlider = (x) => {
      // Cache rect for 100ms to avoid forced reflows during drag
      const now = performance.now();
      if (!cachedSliderRect || now - sliderRectCacheTime > 100) {
        cachedSliderRect = slider.getBoundingClientRect();
        sliderRectCacheTime = now;
      }

      const position =
        ((x - cachedSliderRect.left) / cachedSliderRect.width) * 100;
      const clampedPosition = Math.max(0, Math.min(100, position));

      // Use requestAnimationFrame to batch style changes
      requestAnimationFrame(() => {
        after.style.clipPath = `inset(0 ${100 - clampedPosition}% 0 0)`;
      });
    };

    slider.addEventListener("mousedown", () => {
      isDragging = true;
      cachedSliderRect = slider.getBoundingClientRect(); // Cache on start
      sliderRectCacheTime = performance.now();
    });

    slider.addEventListener("mouseup", () => {
      isDragging = false;
      cachedSliderRect = null; // Clear cache
    });

    slider.addEventListener("mouseleave", () => {
      isDragging = false;
      cachedSliderRect = null; // Clear cache
    });

    slider.addEventListener(
      "mousemove",
      (e) => {
        if (isDragging) {
          updateSlider(e.clientX);
        }
      },
      { passive: true }
    );

    slider.addEventListener(
      "touchmove",
      (e) => {
        updateSlider(e.touches[0].clientX);
      },
      { passive: true }
    );
  });
};

// ============================================
// Core Web Vitals Monitoring (Enhanced)
// ============================================
const initPerformanceMonitoring = () => {
  if ("PerformanceObserver" in window) {
    const performanceMetrics = {
      lcp: 0,
      fid: 0,
      cls: 0,
      fcp: 0,
    };

    // Measure Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      performanceMetrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
      console.log("LCP:", performanceMetrics.lcp, "ms");

      // Alert if LCP is poor (>2.5s)
      if (performanceMetrics.lcp > 2500) {
        console.warn("⚠️ Poor LCP detected:", performanceMetrics.lcp, "ms");
      }
    });
    lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

    // Measure First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        performanceMetrics.fid = entry.processingStart - entry.startTime;
        console.log("FID:", performanceMetrics.fid, "ms");

        // Alert if FID is poor (>100ms)
        if (performanceMetrics.fid > 100) {
          console.warn("⚠️ Poor FID detected:", performanceMetrics.fid, "ms");
        }
      });
    });
    fidObserver.observe({ entryTypes: ["first-input"] });

    // Measure Cumulative Layout Shift (CLS)
    let clsScore = 0;
    const clsObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsScore += entry.value;
          performanceMetrics.cls = clsScore;
          console.log("CLS:", performanceMetrics.cls);

          // Alert if CLS is poor (>0.25)
          if (performanceMetrics.cls > 0.25) {
            console.warn("⚠️ Poor CLS detected:", performanceMetrics.cls);
          }
        }
      });
    });
    clsObserver.observe({ entryTypes: ["layout-shift"] });

    // Measure First Contentful Paint (FCP)
    const fcpObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        performanceMetrics.fcp = entry.startTime;
        console.log("FCP:", performanceMetrics.fcp, "ms");

        // Alert if FCP is poor (>1.8s)
        if (performanceMetrics.fcp > 1800) {
          console.warn("⚠️ Poor FCP detected:", performanceMetrics.fcp, "ms");
        }
      });
    });
    fcpObserver.observe({ entryTypes: ["paint"] });

    // Monitor long tasks (main thread blocking) - Only critical ones
    const longTaskObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        // Only log tasks longer than 100ms to reduce console spam
        if (entry.duration > 100) {
          console.warn("⚠️ Long task detected:", entry.duration, "ms");
          console.log("Long task details:", entry);
        }
      });
    });
    longTaskObserver.observe({ entryTypes: ["longtask"] });

    // Store metrics for later analysis
    window.performanceMetrics = performanceMetrics;
  }

  // Monitor frame rate - Highly optimized with limited duration
  let frameCount = 0;
  let lastTime = performance.now();
  let startTime = performance.now();
  const monitorDuration = 8000; // Only monitor for 8 seconds

  const measureFPS = () => {
    const currentTime = performance.now();

    // Stop monitoring after duration
    if (currentTime - startTime > monitorDuration) {
      return;
    }

    frameCount++;

    if (currentTime - lastTime >= 3000) {
      // Check every 3 seconds
      const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));

      // Only log if FPS is critically low
      if (fps < 20) {
        console.warn("⚠️ Low FPS detected:", fps);
      }

      frameCount = 0;
      lastTime = currentTime;
    }

    requestAnimationFrame(measureFPS);
  };

  // Start FPS monitoring with delay to avoid initial load impact
  setTimeout(() => {
    requestAnimationFrame(measureFPS);
  }, 3000);
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
// Micro-Interactions & Animation Management
// ============================================
const initMicroInteractions = () => {
  // Staggered animations for cards
  const staggerElements = document.querySelectorAll(".stagger-animation");

  const staggerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
        }
      });
    },
    { threshold: 0.1 }
  );

  staggerElements.forEach((element) => {
    staggerObserver.observe(element);
  });

  // Page transition animations
  const pageElements = document.querySelectorAll(".page-transition");

  setTimeout(() => {
    pageElements.forEach((element) => {
      element.classList.add("loaded");
    });
  }, 100);

  // Ripple effect for buttons
  const rippleButtons = document.querySelectorAll(".ripple-effect");

  rippleButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.classList.add("ripple");

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Magnetic effect for buttons
  const magneticButtons = document.querySelectorAll(".magnetic-button");

  magneticButtons.forEach((button) => {
    button.addEventListener("mousemove", function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });

    button.addEventListener("mouseleave", function () {
      this.style.transform = "translate(0, 0)";
    });
  });

  // Success/Error animations
  const successElements = document.querySelectorAll(".success-message");
  const errorElements = document.querySelectorAll(".error-message");

  successElements.forEach((element) => {
    element.classList.add("bounce-animation");
  });

  errorElements.forEach((element) => {
    element.classList.add("shake-animation");
  });

  // Counter animations
  const counters = document.querySelectorAll(".counter");

  counters.forEach((counter) => {
    counter.classList.add("counter-animation");
  });

  // Progress bar animations
  const progressBars = document.querySelectorAll(".progress-bar");

  progressBars.forEach((bar) => {
    bar.classList.add("progress-bar-animation");
  });

  // Typing animation for text
  const typingElements = document.querySelectorAll(".typing-animation");

  typingElements.forEach((element) => {
    const text = element.textContent;
    element.textContent = "";
    element.style.width = "0";

    setTimeout(() => {
      element.style.width = "100%";
      element.textContent = text;
    }, 1000);
  });

  // Floating animations for decorative elements
  const floatingElements = document.querySelectorAll(".float-animation");

  floatingElements.forEach((element, index) => {
    element.style.animationDelay = `${index * 0.5}s`;
  });

  // Glow effect for focus states
  const glowElements = document.querySelectorAll(".glow-animation");

  glowElements.forEach((element) => {
    element.addEventListener("focus", function () {
      this.classList.add("glow-animation");
    });

    element.addEventListener("blur", function () {
      this.classList.remove("glow-animation");
    });
  });

  // Pulse animation for interactive elements
  const pulseElements = document.querySelectorAll(".pulse-animation");

  pulseElements.forEach((element) => {
    element.addEventListener("mouseenter", function () {
      this.style.animationPlayState = "paused";
    });

    element.addEventListener("mouseleave", function () {
      this.style.animationPlayState = "running";
    });
  });
};

// ============================================
// Loading State Management
// ============================================
const initLoadingStates = () => {
  // Button loading states
  const buttons = document.querySelectorAll(
    ".btn, .cta-button, .secondary-button, .glass-button"
  );

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // Only add loading state for buttons that don't have preventDefault
      if (!e.defaultPrevented) {
        this.classList.add("loading");

        // Remove loading state after 2 seconds (or when page changes)
        setTimeout(() => {
          this.classList.remove("loading");
        }, 2000);
      }
    });
  });

  // Form loading states
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      this.classList.add("form-loading");

      // Add loading spinner
      const spinner = document.createElement("div");
      spinner.className = "loading-spinner";
      this.appendChild(spinner);

      // Remove loading state after 3 seconds
      setTimeout(() => {
        this.classList.remove("form-loading");
        const existingSpinner = this.querySelector(".loading-spinner");
        if (existingSpinner) {
          existingSpinner.remove();
        }
      }, 3000);
    });
  });

  // Image loading states
  const images = document.querySelectorAll("img");

  images.forEach((img) => {
    if (!img.complete) {
      img.classList.add("image-loading");
    }

    img.addEventListener("load", function () {
      this.classList.remove("image-loading");
    });

    img.addEventListener("error", function () {
      this.classList.remove("image-loading");
      this.classList.add("image-error");
    });
  });

  // Lazy loading with skeleton
  const lazyElements = document.querySelectorAll("[data-lazy]");

  lazyElements.forEach((element) => {
    element.classList.add("skeleton");

    // Simulate loading delay
    setTimeout(() => {
      element.classList.remove("skeleton");
    }, Math.random() * 2000 + 1000);
  });
};

// ============================================
// Particle Animation
// ============================================
const initParticleAnimation = () => {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) {
    console.log("Particles canvas not found");
    return;
  }

  const ctx = canvas.getContext("2d");
  let particles = [];
  let animationId;
  let isAnimating = false;

  // Set canvas size
  const resizeCanvas = () => {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    console.log(`Canvas resized to: ${canvas.width}x${canvas.height}`);
  };

  // Initialize canvas
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Particle class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      this.size = Math.random() * 3 + 1;
      this.opacity = Math.random() * 0.8 + 0.2;
      this.hue = Math.random() * 60 + 180; // Teal to cyan range
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Wrap around screen
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 70%, 50%, ${this.opacity})`;
      ctx.fill();
    }
  }

  // Create particles
  const createParticles = () => {
    particles = [];
    const particleCount = Math.min(
      50,
      Math.floor((canvas.width * canvas.height) / 10000)
    );
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    console.log(`Created ${particles.length} particles`);
  };

  // Animation loop
  const animate = () => {
    if (!isAnimating) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });

    animationId = requestAnimationFrame(animate);
  };

  // Start animation
  const startAnimation = () => {
    if (isAnimating) return;
    isAnimating = true;
    createParticles();
    animate();
    console.log("Particle animation started");
  };

  // Stop animation
  const stopAnimation = () => {
    isAnimating = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    console.log("Particle animation stopped");
  };

  // Start animation after a short delay to ensure DOM is ready
  setTimeout(startAnimation, 100);

  // Cleanup function
  return () => {
    stopAnimation();
  };
};

// ============================================
// Back to Top Button
// ============================================
const initBackToTop = () => {
  const backToTopButton = document.getElementById("back-to-top");

  if (!backToTopButton) return;

  // Show/hide button based on scroll position
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add("show");
    } else {
      backToTopButton.classList.remove("show");
    }
  });

  // Scroll to top when clicked
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
};

// ============================================
// Service Cards Click Handler
// ============================================
const initServiceCards = () => {
  const serviceCards = document.querySelectorAll(".service-card-3d");

  serviceCards.forEach((card) => {
    card.style.cursor = "pointer";

    card.addEventListener("click", (e) => {
      // Don't trigger if clicking on the Learn More link
      if (e.target.closest("a")) {
        return;
      }

      // Find the Learn More link within this card
      const learnMoreLink = card.querySelector('a[href*="services.html"]');
      if (learnMoreLink) {
        window.location.href = learnMoreLink.href;
      }
    });

    // Add hover effect
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-4px)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0)";
    });
  });
};

// ============================================
// Service Worker Registration
// ============================================
const initServiceWorker = () => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registered successfully:",
            registration.scope
          );

          // Check for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // New version available
                if (confirm("New version available! Reload to update?")) {
                  window.location.reload();
                }
              }
            });
          });
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    });

    // Handle service worker messages
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data.type === "CACHE_UPDATED") {
        console.log("Cache updated:", event.data.url);
      }
    });
  }
};
const init = () => {
  // Respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Core functionality
  initLanguageSwitcher();
  initMobileMenu();
  initStickyNav();
  initCounters();
  initFadeInObserver();
  initLazyLoading();
  initCookieConsent();
  initContactForm();
  initDirectionsButton();
  initBackToTop();
  initProjectsFilter();
  initParticleAnimation();
  initLoadingStates();
  initMicroInteractions();
  initContactForm();
  initServiceCards();

  console.log("LaraTech website initialized successfully! 🚀");
};

// ============================================
// Projects Filter & View Toggle
// ============================================
const initProjectsFilter = () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const viewToggleButtons = document.querySelectorAll(".view-toggle-btn");
  const projectsContainer = document.getElementById("projects-container");
  const projectCards = document.querySelectorAll(".project-card-3d");

  if (!filterButtons.length || !projectsContainer) return;

  let currentFilter = "all";
  let currentView = "grid";

  // Filter functionality
  const filterProjects = (filter) => {
    currentFilter = filter;

    // Update active filter button
    filterButtons.forEach((btn) => {
      btn.classList.remove("active");
      if (btn.getAttribute("data-filter") === filter) {
        btn.classList.add("active");
      }
    });

    // Filter and animate project cards
    projectCards.forEach((card, index) => {
      const category = card.getAttribute("data-category");
      const shouldShow = filter === "all" || category === filter;

      if (shouldShow) {
        card.classList.remove("hidden");
        card.classList.add("fade-in");
        // Stagger animation
        setTimeout(() => {
          card.classList.add("filter-animate");
        }, index * 100);
      } else {
        card.classList.add("hidden");
        card.classList.remove("fade-in", "filter-animate");
      }
    });

    // Update container layout
    updateContainerLayout();
  };

  // View toggle functionality
  const toggleView = (view) => {
    currentView = view;

    // Update active view button
    viewToggleButtons.forEach((btn) => {
      btn.classList.remove("active");
      if (btn.getAttribute("data-view") === view) {
        btn.classList.add("active");
      }
    });

    // Update container classes
    updateContainerLayout();
  };

  // Update container layout based on current view
  const updateContainerLayout = () => {
    if (currentView === "list") {
      projectsContainer.classList.add("list-view");
      projectsContainer.classList.remove(
        "grid",
        "grid-cols-1",
        "lg:grid-cols-2"
      );
    } else {
      projectsContainer.classList.remove("list-view");
      projectsContainer.classList.add("grid", "grid-cols-1", "lg:grid-cols-2");
    }
  };

  // Event listeners for filter buttons
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");
      filterProjects(filter);

      // Track filter usage
      if (typeof gtag !== "undefined") {
        gtag("event", "project_filter", {
          filter_category: filter,
          page_location: window.location.href,
        });
      }
    });
  });

  // Event listeners for view toggle buttons
  viewToggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const view = btn.getAttribute("data-view");
      toggleView(view);

      // Track view toggle usage
      if (typeof gtag !== "undefined") {
        gtag("event", "project_view_toggle", {
          view_type: view,
          page_location: window.location.href,
        });
      }
    });
  });

  // Initialize with default state
  filterProjects("all");
  toggleView("grid");
};

// Run initialization when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    init();
    // Initialize Lucide icons
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  });
} else {
  init();
  // Initialize Lucide icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

// Export functions for use in other scripts
window.LaraTech = {
  initLanguageSwitcher,
  initMobileMenu,
  initStickyNav,
  initCounters,
  initFadeInObserver,
  initMagneticButtons,
  initLazyLoading,
  initCookieConsent,
  initContactForm,
  initLightbox,
  initProgressBar,
  initBeforeAfterSlider,
  initPerformanceMonitoring,
  initDirectionsButton,
  initBackToTop,
  initProjectsFilter,
  initParticleAnimation,
  initLoadingStates,
  initMicroInteractions,
  initContactForm,
  initServiceCards,
};
