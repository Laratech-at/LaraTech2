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
// Language Switcher (EN / SQ / DE) with Dropdown
// ============================================
const initLanguageSwitcher = () => {
  const langDropdownBtn = document.getElementById("lang-dropdown-btn");
  const langDropdownContent = document.getElementById("lang-dropdown-content");
  const currentLangFlag = document.getElementById("current-lang-flag");
  const currentLangCode = document.getElementById("current-lang-code");
  const langOptions = document.querySelectorAll(".lang-option");

  // Language configuration with flags
  const languages = {
    en: { flag: "🇬🇧", name: "English", code: "EN" },
    sq: { flag: "🇦🇱", name: "Shqip", code: "SQ" },
    de: { flag: "🇩🇪", name: "Deutsch", code: "DE" },
  };

  // Get saved language or default to EN
  let currentLang = localStorage.getItem("lang") || "en";
  updateLanguage(currentLang);

  // Toggle dropdown
  langDropdownBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    langDropdownContent?.classList.toggle("show");
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

    // Update button display
    if (currentLangFlag) currentLangFlag.textContent = langConfig.flag;
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
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

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
    });
  });
};

// ============================================
// Neural Network Particles Background Animation
// ============================================
const initParticles = () => {
  const particlesContainer = document.getElementById("particles-container");
  if (!particlesContainer) return;

  // Respect prefers-reduced-motion for accessibility
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (reduceMotion) return;

  // Create canvas for neural network
  const canvas = document.createElement("canvas");
  canvas.id = "neural-canvas";
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "1";

  particlesContainer.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let animationId;
  let mouse = { x: 0, y: 0 };

  // Neural network nodes
  const nodes = [];
  const connections = [];
  const dataStreams = [];

  const nodeCount = 25;
  const maxConnections = 3;
  const maxDistance = 150;

  // Resize canvas
  const resizeCanvas = () => {
    canvas.width = particlesContainer.offsetWidth;
    canvas.height = particlesContainer.offsetHeight;
  };

  // Initialize nodes
  const initNodes = () => {
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 2,
        pulse: Math.random() * Math.PI * 2,
        connections: [],
        type: Math.random() > 0.7 ? "data" : "neural",
        activity: Math.random(),
      });
    }
  };

  // Create connections between nearby nodes
  const createConnections = () => {
    connections.length = 0;
    nodes.forEach((node, i) => {
      node.connections = [];
      nodes.forEach((otherNode, j) => {
        if (i !== j) {
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (
            distance < maxDistance &&
            node.connections.length < maxConnections
          ) {
            connections.push({
              from: node,
              to: otherNode,
              distance: distance,
              strength: 1 - distance / maxDistance,
              pulse: Math.random() * Math.PI * 2,
            });
            node.connections.push(otherNode);
          }
        }
      });
    });
  };

  // Create data streams
  const createDataStreams = () => {
    dataStreams.length = 0;
    const streamCount = 8;

    for (let i = 0; i < streamCount; i++) {
      dataStreams.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        trail: [],
        maxTrailLength: 20,
      });
    }
  };

  // Update nodes
  const updateNodes = () => {
    nodes.forEach((node) => {
      // Update position
      node.x += node.vx;
      node.y += node.vy;

      // Bounce off edges
      if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
      if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

      // Keep within bounds
      node.x = Math.max(0, Math.min(canvas.width, node.x));
      node.y = Math.max(0, Math.min(canvas.height, node.y));

      // Update pulse
      node.pulse += 0.02;

      // Update activity based on mouse proximity
      const dx = node.x - mouse.x;
      const dy = node.y - mouse.y;
      const mouseDistance = Math.sqrt(dx * dx + dy * dy);
      node.activity = Math.max(0.3, 1 - mouseDistance / 200);
    });
  };

  // Update data streams
  const updateDataStreams = () => {
    dataStreams.forEach((stream) => {
      // Update position
      stream.x += stream.vx;
      stream.y += stream.vy;

      // Add to trail
      stream.trail.push({ x: stream.x, y: stream.y, opacity: stream.opacity });
      if (stream.trail.length > stream.maxTrailLength) {
        stream.trail.shift();
      }

      // Bounce off edges
      if (stream.x < 0 || stream.x > canvas.width) stream.vx *= -1;
      if (stream.y < 0 || stream.y > canvas.height) stream.vy *= -1;

      // Keep within bounds
      stream.x = Math.max(0, Math.min(canvas.width, stream.x));
      stream.y = Math.max(0, Math.min(canvas.height, stream.y));
    });
  };

  // Draw neural network
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    ctx.strokeStyle = "rgba(0, 200, 200, 0.6)";
    ctx.lineWidth = 2;
    connections.forEach((conn) => {
      const alpha = conn.strength * 0.8;
      ctx.strokeStyle = `rgba(0, 200, 200, ${alpha})`;

      ctx.beginPath();
      ctx.moveTo(conn.from.x, conn.from.y);
      ctx.lineTo(conn.to.x, conn.to.y);
      ctx.stroke();

      // Animated pulse along connection
      const pulseX =
        conn.from.x +
        (conn.to.x - conn.from.x) * (0.5 + 0.3 * Math.sin(conn.pulse));
      const pulseY =
        conn.from.y +
        (conn.to.y - conn.from.y) * (0.5 + 0.3 * Math.sin(conn.pulse));

      ctx.fillStyle = `rgba(0, 255, 255, ${alpha * 0.9})`;
      ctx.beginPath();
      ctx.arc(pulseX, pulseY, 2, 0, Math.PI * 2);
      ctx.fill();

      conn.pulse += 0.05;
    });

    // Draw data streams
    dataStreams.forEach((stream) => {
      // Draw trail
      stream.trail.forEach((point, index) => {
        const trailAlpha = (index / stream.trail.length) * point.opacity * 0.7;
        ctx.fillStyle = `rgba(0, 255, 255, ${trailAlpha})`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, stream.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw current position
      ctx.fillStyle = `rgba(0, 255, 255, ${stream.opacity})`;
      ctx.beginPath();
      ctx.arc(stream.x, stream.y, stream.size * 1.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw nodes
    nodes.forEach((node) => {
      const pulseSize = node.size + Math.sin(node.pulse) * 2;
      const alpha = node.activity;

      // Node glow
      const gradient = ctx.createRadialGradient(
        node.x,
        node.y,
        0,
        node.x,
        node.y,
        pulseSize * 4
      );
      gradient.addColorStop(0, `rgba(0, 200, 200, ${alpha * 0.9})`);
      gradient.addColorStop(0.5, `rgba(0, 255, 255, ${alpha * 0.6})`);
      gradient.addColorStop(1, "rgba(0, 255, 255, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, pulseSize * 4, 0, Math.PI * 2);
      ctx.fill();

      // Node core
      ctx.fillStyle =
        node.type === "data"
          ? `rgba(255, 107, 0, ${alpha})`
          : `rgba(0, 200, 200, ${alpha})`;
      ctx.beginPath();
      ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
      ctx.fill();

      // Node center
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.beginPath();
      ctx.arc(node.x, node.y, pulseSize * 0.4, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  // Animation loop
  const animate = () => {
    updateNodes();
    updateDataStreams();
    draw();
    animationId = requestAnimationFrame(animate);
  };

  // Mouse tracking
  const handleMouseMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  };

  // Initialize
  resizeCanvas();
  initNodes();
  createConnections();
  createDataStreams();

  // Event listeners
  window.addEventListener("resize", () => {
    resizeCanvas();
    createConnections();
  });

  canvas.addEventListener("mousemove", handleMouseMove);

  // Start animation
  animate();

  // Cleanup function
  return () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    window.removeEventListener("resize", resizeCanvas);
    canvas.removeEventListener("mousemove", handleMouseMove);
  };
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
  const rejectButton = document.getElementById("reject-cookies");

  // Check if user has already made a choice
  const cookieChoice = localStorage.getItem("cookies-choice");

  if (!cookieChoice) {
    setTimeout(() => {
      cookieBanner?.classList.add("show");
    }, 2000);
  }

  // Accept cookies
  acceptButton?.addEventListener("click", () => {
    localStorage.setItem("cookies-choice", "accepted");
    localStorage.setItem("cookies-accepted", "true");
    cookieBanner?.classList.remove("show");

    // Here you can enable analytics, tracking, etc.
    console.log("Cookies accepted");
  });

  // Reject cookies
  rejectButton?.addEventListener("click", () => {
    localStorage.setItem("cookies-choice", "rejected");
    localStorage.removeItem("cookies-accepted");
    cookieBanner?.classList.remove("show");

    // Here you can disable analytics, tracking, etc.
    console.log("Cookies rejected");
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

    // Monitor long tasks (main thread blocking)
    const longTaskObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.warn("⚠️ Long task detected:", entry.duration, "ms");
        console.log("Long task details:", entry);
      });
    });
    longTaskObserver.observe({ entryTypes: ["longtask"] });

    // Store metrics for later analysis
    window.performanceMetrics = performanceMetrics;
  }

  // Monitor frame rate - Optimized to reduce overhead
  let frameCount = 0;
  let lastTime = performance.now();
  let isMonitoring = true;

  const measureFPS = () => {
    if (!isMonitoring) return;

    frameCount++;
    const currentTime = performance.now();

    if (currentTime - lastTime >= 2000) {
      // Check every 2 seconds instead of 1
      const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));

      // Only log if FPS is consistently low
      if (fps < 25) {
        console.warn("⚠️ Low FPS detected:", fps);
      }

      frameCount = 0;
      lastTime = currentTime;
    }

    // Stop monitoring after 10 seconds to reduce overhead
    if (currentTime - performance.now() > 10000) {
      isMonitoring = false;
      return;
    }

    requestAnimationFrame(measureFPS);
  };

  // Start FPS monitoring with delay to avoid initial load impact
  setTimeout(() => {
    requestAnimationFrame(measureFPS);
  }, 2000);
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
  // initParticles(); // Disabled - replaced with Liquid Ether
  initLazyLoading();
  initCookieConsent();
  initContactForm();
  initLightbox();
  initProgressBar();
  initBeforeAfterSlider();
  initPerformanceMonitoring();
  initDirectionsButton();
  initBackToTop();
  initProjectsFilter();
  initServiceWorker();

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
  initProjectsFilter,
};
