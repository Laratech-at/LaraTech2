/**
 * LaraTech - GSAP Animations
 * Handles: Scroll Animations, Parallax Effects, Page Transitions,
 * Text Reveals, Service Cards, Project Cards, and Micro-interactions
 */

// Wait for GSAP and ScrollTrigger to be available
const initGSAPAnimations = () => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.error("GSAP or ScrollTrigger not loaded");
    return;
  }

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // ============================================
  // Hero Section Animations
  // ============================================
  const animateHero = () => {
    const tl = gsap.timeline({ delay: 3.5 }); // After loading animation

    tl.from(".hero-title", {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
    })
      .from(
        ".hero-subtitle",
        {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.5"
      )
      .from(
        ".cta-button, .secondary-button",
        {
          opacity: 0,
          scale: 0.8,
          duration: 0.6,
          stagger: 0.2,
          ease: "back.out(1.7)",
        },
        "-=0.4"
      )
      .from(
        ".stat-card",
        {
          opacity: 0,
          y: 30,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
        },
        "-=0.3"
      );
  };

  // ============================================
  // Parallax Scroll Effects
  // ============================================
  const initParallax = () => {
    // Parallax background particles
    const particles = document.querySelectorAll(".particle");
    if (particles.length > 0) {
      gsap.to(".particle", {
        y: (i, el) =>
          (1 - parseFloat(el.style.top) / 100) *
          ScrollTrigger.maxScroll(window),
        ease: "none",
        scrollTrigger: {
          start: 0,
          end: "max",
          invalidateOnRefresh: true,
          scrub: 0.5,
        },
      });
    }

    // Parallax hero elements
    gsap.to("#hero", {
      y: 200,
      opacity: 0.5,
      ease: "none",
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });
  };

  // ============================================
  // Service Cards Animation
  // ============================================
  const animateServiceCards = () => {
    gsap.utils.toArray(".service-card-3d").forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          end: "top 50%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 60,
        rotationX: -15,
        duration: 0.8,
        delay: i * 0.1,
        ease: "power3.out",
      });

      // Hover animation
      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          y: -10,
          boxShadow: "0 20px 50px rgba(0, 200, 200, 0.3)",
          duration: 0.3,
          ease: "power2.out",
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          y: 0,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });
  };

  // ============================================
  // Project Cards Animation
  // ============================================
  const animateProjectCards = () => {
    gsap.utils.toArray(".project-card-3d").forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          end: "top 55%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        x: i % 2 === 0 ? -60 : 60,
        rotation: i % 2 === 0 ? -5 : 5,
        duration: 1,
        ease: "power3.out",
      });
    });
  };

  // ============================================
  // Testimonial Cards Animation
  // ============================================
  const animateTestimonials = () => {
    gsap.utils.toArray(".testimonial-card").forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          end: "top 50%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 50,
        scale: 0.9,
        duration: 0.8,
        delay: i * 0.15,
        ease: "back.out(1.5)",
      });
    });
  };

  // ============================================
  // Text Reveal Animations
  // ============================================
  const animateTextReveal = () => {
    // Split text into characters for letter-by-letter animation
    const splitText = (element) => {
      const text = element.textContent;
      element.innerHTML = "";

      text.split("").forEach((char, i) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.display = "inline-block";
        span.classList.add("text-reveal");
        element.appendChild(span);
      });
    };

    document.querySelectorAll(".text-reveal-animation").forEach((element) => {
      splitText(element);

      gsap.from(element.querySelectorAll(".text-reveal"), {
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 20,
        rotationX: -90,
        stagger: 0.02,
        duration: 0.6,
        ease: "back.out(1.5)",
      });
    });
  };

  // ============================================
  // Section Headers Animation
  // ============================================
  const animateSectionHeaders = () => {
    gsap.utils.toArray("section h2").forEach((header) => {
      gsap.from(header, {
        scrollTrigger: {
          trigger: header,
          start: "top 85%",
          end: "top 55%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 30,
        scale: 0.95,
        duration: 0.8,
        ease: "power3.out",
      });
    });
  };

  // ============================================
  // Stats Counter Animation (Enhanced)
  // ============================================
  const animateStats = () => {
    gsap.utils.toArray(".stat-card").forEach((stat, i) => {
      gsap.from(stat, {
        scrollTrigger: {
          trigger: stat,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        scale: 0.5,
        opacity: 0,
        rotation: 360,
        duration: 0.8,
        delay: i * 0.1,
        ease: "back.out(2)",
      });
    });
  };

  // ============================================
  // Partner Logos Animation
  // ============================================
  const animatePartnerLogos = () => {
    // Simply make them visible - no animation
    gsap.set(".partner-logo", { opacity: 1, clearProps: "opacity" });
  };

  // ============================================
  // CTA Section Animation
  // ============================================
  const animateCTA = () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#cta",
        start: "top 95%",
        toggleActions: "play none none none",
      },
    });

    tl.from("#cta h2", {
      opacity: 0,
      y: 30,
      scale: 0.95,
      duration: 0.5,
      ease: "power3.out",
      immediateRender: false,
    })
      .from(
        "#cta p",
        {
          opacity: 0,
          y: 20,
          duration: 0.4,
          ease: "power2.out",
          immediateRender: false,
        },
        "-=0.3"
      )
      .from(
        "#cta .cta-button, #cta .secondary-button",
        {
          opacity: 0,
          scale: 0.9,
          stagger: 0.1,
          duration: 0.4,
          ease: "back.out(1.7)",
          immediateRender: false,
        },
        "-=0.2"
      );
  };

  // ============================================
  // Footer Animation
  // ============================================
  const animateFooter = () => {
    gsap.from("footer > div > div", {
      scrollTrigger: {
        trigger: "footer",
        start: "top 90%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 50,
      stagger: 0.15,
      duration: 0.8,
      ease: "power2.out",
    });
  };

  // ============================================
  // Scroll-Based Storytelling (Values, Process)
  // ============================================
  const initScrollStory = () => {
    const storyElements = document.querySelectorAll("[data-story]");

    storyElements.forEach((element, i) => {
      const direction = i % 2 === 0 ? -100 : 100;

      gsap.from(element, {
        scrollTrigger: {
          trigger: element,
          start: "top 75%",
          end: "top 25%",
          scrub: 1,
          toggleActions: "play none none reverse",
        },
        x: direction,
        opacity: 0,
        rotation: i % 2 === 0 ? -10 : 10,
        ease: "power2.out",
      });
    });
  };

  // ============================================
  // Smooth Page Transitions
  // ============================================
  const initPageTransitions = () => {
    // Animate page entrance
    gsap.from("body", {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
    });

    // Intercept navigation for smooth transitions
    document.querySelectorAll('a:not([target="_blank"])').forEach((link) => {
      if (link.hostname === window.location.hostname) {
        link.addEventListener("click", (e) => {
          const href = link.getAttribute("href");

          // Skip if it's an anchor link or special link
          if (
            href.startsWith("#") ||
            href.startsWith("tel:") ||
            href.startsWith("mailto:")
          ) {
            return;
          }

          e.preventDefault();

          gsap.to("body", {
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
              window.location.href = href;
            },
          });
        });
      }
    });
  };

  // ============================================
  // Hover Micro-interactions
  // ============================================
  const initMicroInteractions = () => {
    // Buttons pulse on hover
    document
      .querySelectorAll(".cta-button, .secondary-button")
      .forEach((button) => {
        button.addEventListener("mouseenter", () => {
          gsap.to(button, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        button.addEventListener("mouseleave", () => {
          gsap.to(button, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });

    // Nav links animate on hover
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("mouseenter", () => {
        gsap.to(link, {
          y: -3,
          duration: 0.2,
          ease: "power2.out",
        });
      });

      link.addEventListener("mouseleave", () => {
        gsap.to(link, {
          y: 0,
          duration: 0.2,
          ease: "power2.out",
        });
      });
    });

    // Icons rotate on hover
    document
      .querySelectorAll(".service-card-3d svg, .glass-card svg")
      .forEach((icon) => {
        const parent = icon.closest(".service-card-3d, .glass-card");
        if (parent) {
          parent.addEventListener("mouseenter", () => {
            gsap.to(icon, {
              rotation: 360,
              duration: 0.6,
              ease: "back.out(1.5)",
            });
          });
        }
      });
  };

  // ============================================
  // Neon Glow Animation
  // ============================================
  const initNeonGlow = () => {
    const neonElements = document.querySelectorAll(".neon-glow, .cta-button");

    neonElements.forEach((element) => {
      gsap.to(element, {
        boxShadow:
          "0 0 30px rgba(0, 255, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.4)",
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: "sine.inOut",
      });
    });
  };

  // ============================================
  // Cursor Trail Effect (Optional)
  // ============================================
  const initCursorTrail = () => {
    const cursor = document.createElement("div");
    cursor.classList.add("cursor-trail");
    cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(0, 255, 255, 0.6), transparent);
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: screen;
            display: none;
        `;
    document.body.appendChild(cursor);

    let mouseX = 0,
      mouseY = 0;
    let cursorX = 0,
      cursorY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.display = "block";
    });

    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;

      cursor.style.left = cursorX - 10 + "px";
      cursor.style.top = cursorY - 10 + "px";

      requestAnimationFrame(animateCursor);
    };

    animateCursor();
  };

  // ============================================
  // Image Zoom on Hover
  // ============================================
  const initImageZoom = () => {
    document
      .querySelectorAll(".project-card-3d img, .blog-card img")
      .forEach((img) => {
        const parent = img.parentElement;
        if (parent) {
          parent.style.overflow = "hidden";

          parent.addEventListener("mouseenter", () => {
            gsap.to(img, {
              scale: 1.1,
              duration: 0.4,
              ease: "power2.out",
            });
          });

          parent.addEventListener("mouseleave", () => {
            gsap.to(img, {
              scale: 1,
              duration: 0.4,
              ease: "power2.out",
            });
          });
        }
      });
  };

  // ============================================
  // Scroll Progress Indicator
  // ============================================
  const initScrollProgress = () => {
    const progressBar = document.querySelector(".progress-bar");
    if (progressBar) {
      gsap.to(progressBar, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          start: "top top",
          end: "max",
          scrub: 0.3,
        },
      });
    }
  };

  // ============================================
  // Initialize All Animations (Performance Optimized)
  // ============================================
  const initAll = () => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      console.log("Reduced motion preferred - animations disabled");
      return;
    }

    // Check device capabilities for performance optimization
    const isLowEndDevice =
      navigator.hardwareConcurrency <= 2 ||
      navigator.deviceMemory <= 4 ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isLowEndDevice) {
      console.log("Low-end device detected - using simplified animations");
      // Only essential animations for low-end devices
      animateHero();
      animateServiceCards();
      animateProjectCards();
      animateSectionHeaders();
      initMicroInteractions();
      return;
    }

    // Core animations for capable devices - Reduced set for better performance
    animateHero();
    animateServiceCards();
    animateProjectCards();
    animateTestimonials();
    animateSectionHeaders();
    animateStats();
    
    // Reduced animations for better performance
    // initParallax(); // Disabled - causes performance issues
    // animatePartnerLogos(); // Disabled - not critical
    // animateCTA(); // Disabled - not critical
    // animateFooter(); // Disabled - not critical
    // initScrollStory(); // Disabled - causes performance issues
    // initPageTransitions(); // Disabled - not critical
    // initMicroInteractions(); // Disabled - causes performance issues
    // initImageZoom(); // Disabled - causes performance issues
    // initScrollProgress(); // Disabled - causes performance issues

    // Optional effects (disabled for performance)
    // initNeonGlow();
    // initCursorTrail();
    // animateTextReveal();

    console.log("GSAP animations initialized! ✨");
  };

  // Run after page load
  initAll();
};

// Initialize when DOM is ready and GSAP is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(initGSAPAnimations, 100); // Small delay to ensure GSAP is loaded
  });
} else {
  setTimeout(initGSAPAnimations, 100);
}

// Export for manual initialization if needed
window.initGSAPAnimations = initGSAPAnimations;
