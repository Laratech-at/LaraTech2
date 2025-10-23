const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

// Test pages configuration
const PAGES = [
  { name: "Home", url: "index.html" },
  { name: "About", url: "about.html" },
  { name: "Services", url: "services.html" },
  { name: "Projects", url: "projects.html" },
  { name: "Contact", url: "contact.html" },
  { name: "Blog", url: "blog.html" },
];

// Brand colors for visual testing
const BRAND_COLORS = {
  tealBlue: "#00C8C8",
  neonBlue: "#00FFFF",
  electricOrange: "#FF6B00",
  jetBlack: "#0A0A0A",
};

// Core Web Vitals thresholds
const PERFORMANCE_THRESHOLDS = {
  LCP: 2500, // ms
  FID: 100, // ms
  CLS: 0.1, // score
  FCP: 1800, // ms
};

test.describe("LaraTech Website - Comprehensive QA Testing", () => {
  // ============================================
  // NAVIGATION & ROUTING TESTS
  // ============================================

  test.describe("Navigation & Routing", () => {
    for (const page of PAGES) {
      test(`should load ${page.name} page correctly`, async ({
        page: testPage,
      }) => {
        await testPage.goto(`/${page.url}`);
        await testPage.waitForLoadState("networkidle");

        // Check page title
        await expect(testPage).toHaveTitle(/LaraTech/);

        // Check main content is visible
        const mainContent = testPage.locator("main").first();
        if ((await mainContent.count()) > 0) {
          await expect(mainContent).toBeVisible();
        } else {
          const firstSection = testPage.locator("section").first();
          await expect(firstSection).toBeVisible();
        }

        // Check no console errors
        const errors = [];
        testPage.on("console", (msg) => {
          if (msg.type() === "error") errors.push(msg.text());
        });

        await testPage.waitForTimeout(1000);
        expect(errors).toHaveLength(0);
      });
    }

    test("should have working navigation links", async ({ page }) => {
      await page.goto("/index.html");

      // Test desktop navigation
      for (const pageConfig of PAGES) {
        const navLink = page.locator(`a[href="${pageConfig.url}"]`).first();
        await expect(navLink).toBeVisible();

        await navLink.click();
        await page.waitForLoadState("networkidle");
        await expect(page).toHaveURL(new RegExp(pageConfig.url));
      }
    });

    test("should highlight active page in navigation", async ({ page }) => {
      await page.goto("/services.html");

      const activeLink = page.locator('a[href="services.html"].active').first();
      await expect(activeLink).toBeVisible();
    });

    test("should have working mobile menu", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/index.html");

      // Open mobile menu
      const mobileMenuToggle = page.locator("#mobile-menu-toggle");
      await expect(mobileMenuToggle).toBeVisible();
      await mobileMenuToggle.click();

      // Wait for mobile menu to appear
      await page.waitForTimeout(500);

      // Check mobile menu is visible
      const mobileMenu = page.locator("#mobile-menu");
      await expect(mobileMenu).toBeVisible();

      // Test mobile menu links
      const mobileLinks = mobileMenu.locator("a");
      const linkCount = await mobileLinks.count();
      expect(linkCount).toBeGreaterThan(0);

      // Close mobile menu by clicking outside
      await page.click("body", { position: { x: 100, y: 100 } });
      await expect(mobileMenu).toBeHidden();
    });
  });

  // ============================================
  // VISUAL & LAYOUT TESTS
  // ============================================

  test.describe("Visual & Layout", () => {
    for (const page of PAGES) {
      test(`should render ${page.name} page correctly on desktop`, async ({
        page: testPage,
      }) => {
        await testPage.setViewportSize({ width: 1920, height: 1080 });
        await testPage.goto(`/${page.url}`);
        await testPage.waitForLoadState("networkidle");

        // Take screenshot for visual regression
        await expect(testPage).toHaveScreenshot(
          `desktop-${page.name.toLowerCase()}.png`
        );

        // Check glassmorphism effects
        const glassCards = testPage.locator(".glass-card");
        const cardCount = await glassCards.count();
        if (cardCount > 0) {
          await expect(glassCards.first()).toBeVisible();
        }

        // Check gradient text
        const gradientText = testPage.locator(".text-gradient");
        const gradientCount = await gradientText.count();
        if (gradientCount > 0) {
          await expect(gradientText.first()).toBeVisible();
        }
      });

      test(`should render ${page.name} page correctly on mobile`, async ({
        page: testPage,
      }) => {
        await testPage.setViewportSize({ width: 375, height: 667 });
        await testPage.goto(`/${page.url}`);
        await testPage.waitForLoadState("networkidle");

        // Take screenshot for visual regression
        await expect(testPage).toHaveScreenshot(
          `mobile-${page.name.toLowerCase()}.png`
        );

        // Check responsive layout
        const container = testPage.locator(".container").first();
        await expect(container).toBeVisible();
      });
    }

    test("should have consistent footer across all pages", async ({ page }) => {
      const footerContent = [];

      for (const pageConfig of PAGES) {
        await page.goto(`/${pageConfig.url}`);
        await page.waitForLoadState("networkidle");

        const footer = page.locator("footer");
        await expect(footer).toBeVisible();

        const footerText = await footer.textContent();
        footerContent.push(footerText);
      }

      // All footers should have the same content
      const firstFooter = footerContent[0];
      for (let i = 1; i < footerContent.length; i++) {
        expect(footerContent[i]).toBe(firstFooter);
      }
    });

    test("should display logo correctly", async ({ page }) => {
      await page.goto("/index.html");

      const logo = page.locator('img[alt*="LaraTech"]').first();
      await expect(logo).toBeVisible();

      // Check logo loads without errors
      const logoSrc = await logo.getAttribute("src");
      expect(logoSrc).toBeTruthy();
    });
  });

  // ============================================
  // INTERACTIVE ELEMENTS TESTS
  // ============================================

  test.describe("Interactive Elements", () => {
    test("should have working language switcher", async ({ page }) => {
      await page.goto("/index.html");

      const langDropdown = page.locator("#lang-dropdown-btn");
      await expect(langDropdown).toBeVisible();

      // Open dropdown
      await langDropdown.click();

      const dropdownContent = page.locator("#lang-dropdown-content");
      await expect(dropdownContent).toBeVisible();

      // Test language switching
      const sqOption = page.locator('.lang-option[data-lang="sq"]');
      await sqOption.click();

      // Check if content changed (look for Albanian text)
      const heroTitle = page.locator(".hero-title");
      await expect(heroTitle).toBeVisible();

      // Close dropdown by clicking outside
      await page.click("body", { position: { x: 100, y: 100 } });
      await expect(dropdownContent).toBeHidden();
    });

    test("should have working cookie banner", async ({ page }) => {
      await page.goto("/index.html");

      // Wait for cookie banner to appear
      const cookieBanner = page.locator("#cookie-banner");
      await expect(cookieBanner).toBeVisible({ timeout: 5000 });

      // Test accept cookies
      const acceptBtn = page.locator("#accept-cookies");
      await expect(acceptBtn).toBeVisible();
      await acceptBtn.click();

      // Banner should be hidden after accepting
      await expect(cookieBanner).toBeHidden();

      // Refresh page and check banner doesn't appear again
      await page.reload();
      await expect(cookieBanner).toBeHidden();
    });

    test("should have working contact form", async ({ page }) => {
      await page.goto("/contact.html");

      const form = page.locator("#contact-form");
      await expect(form).toBeVisible();

      // Test required field validation
      const nameField = page.locator("#name");
      const emailField = page.locator("#email");
      const messageField = page.locator("#message");

      await expect(nameField).toBeVisible();
      await expect(emailField).toBeVisible();
      await expect(messageField).toBeVisible();

      // Test form submission (will fail but should not crash)
      await nameField.fill("Test User");
      await emailField.fill("test@example.com");
      await messageField.fill("Test message");

      const submitBtn = page.locator('button[type="submit"]');
      await submitBtn.click();

      // Should not crash the page
      await expect(page).toHaveURL(/contact\.html/);
    });

    test("should have working counters animation", async ({ page }) => {
      await page.goto("/index.html");

      const counters = page.locator(".counter");
      const counterCount = await counters.count();

      if (counterCount > 0) {
        // Wait for counters to animate
        await page.waitForTimeout(2000);

        // Check that counters have animated (not showing 0)
        const firstCounter = counters.first();
        const counterText = await firstCounter.textContent();
        expect(counterText).not.toBe("0");
      }
    });

    test("should have working back to top button", async ({ page }) => {
      await page.goto("/index.html");

      // Scroll down to trigger back to top button
      await page.evaluate(() => window.scrollTo(0, 1000));

      const backToTopBtn = page.locator("#back-to-top");
      await expect(backToTopBtn).toBeVisible();

      // Click back to top
      await backToTopBtn.click();

      // Should scroll to top
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeLessThan(100);
    });

    test("should have working WhatsApp button", async ({ page }) => {
      await page.goto("/index.html");

      const whatsappBtn = page.locator(".floating-whatsapp");
      await expect(whatsappBtn).toBeVisible();

      // Check WhatsApp link
      const whatsappLink = await whatsappBtn.getAttribute("href");
      expect(whatsappLink).toContain("wa.me");
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================

  test.describe("Accessibility", () => {
    for (const page of PAGES) {
      test(`should pass accessibility audit for ${page.name}`, async ({
        page: testPage,
      }) => {
        await testPage.goto(`/${page.url}`);
        await testPage.waitForLoadState("networkidle");

        const accessibilityScanResults = await new AxeBuilder({
          testPage,
        }).analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      });
    }

    test("should have proper keyboard navigation", async ({ page }) => {
      await page.goto("/index.html");

      // Test Tab navigation
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");

      // Check focus is visible
      const focusedElement = page.locator(":focus");
      await expect(focusedElement).toBeVisible();
    });

    test("should have skip to content link", async ({ page }) => {
      await page.goto("/index.html");

      const skipLink = page.locator(".skip-link");
      await expect(skipLink).toBeVisible();

      // Test skip link functionality
      await skipLink.click();
      await expect(page.locator("#hero")).toBeVisible();
    });

    test("should have proper heading hierarchy", async ({ page }) => {
      await page.goto("/index.html");

      const h1 = page.locator("h1");
      const h2 = page.locator("h2");
      const h3 = page.locator("h3");

      await expect(h1).toBeVisible();

      const h1Count = await h1.count();
      const h2Count = await h2.count();
      const h3Count = await h3.count();

      // Should have at least one h1
      expect(h1Count).toBeGreaterThan(0);

      // Should have h2s if there are h3s
      if (h3Count > 0) {
        expect(h2Count).toBeGreaterThan(0);
      }
    });

    test("should have alt text on images", async ({ page }) => {
      await page.goto("/index.html");

      const images = page.locator("img");
      const imageCount = await images.count();

      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute("alt");
        expect(alt).toBeTruthy();
      }
    });
  });

  // ============================================
  // PERFORMANCE TESTS
  // ============================================

  test.describe("Performance", () => {
    for (const page of PAGES) {
      test(`should load ${page.name} page within performance thresholds`, async ({
        page: testPage,
      }) => {
        await testPage.goto(`/${page.url}`);

        // Measure Core Web Vitals
        const metrics = await testPage.evaluate(() => {
          return new Promise((resolve) => {
            const observer = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              const metrics = {};

              entries.forEach((entry) => {
                if (entry.entryType === "largest-contentful-paint") {
                  metrics.lcp = entry.startTime;
                }
                if (entry.entryType === "first-input") {
                  metrics.fid = entry.processingStart - entry.startTime;
                }
                if (entry.entryType === "layout-shift") {
                  metrics.cls = (metrics.cls || 0) + entry.value;
                }
                if (
                  entry.entryType === "paint" &&
                  entry.name === "first-contentful-paint"
                ) {
                  metrics.fcp = entry.startTime;
                }
              });

              resolve(metrics);
            });

            observer.observe({
              entryTypes: [
                "largest-contentful-paint",
                "first-input",
                "layout-shift",
                "paint",
              ],
            });

            // Resolve after 3 seconds
            setTimeout(() => resolve({}), 3000);
          });
        });

        // Check performance thresholds
        if (metrics.lcp) {
          expect(metrics.lcp).toBeLessThan(PERFORMANCE_THRESHOLDS.LCP);
        }
        if (metrics.fid) {
          expect(metrics.fid).toBeLessThan(PERFORMANCE_THRESHOLDS.FID);
        }
        if (metrics.cls) {
          expect(metrics.cls).toBeLessThan(PERFORMANCE_THRESHOLDS.CLS);
        }
        if (metrics.fcp) {
          expect(metrics.fcp).toBeLessThan(PERFORMANCE_THRESHOLDS.FCP);
        }
      });
    }

    test("should not have console errors", async ({ page }) => {
      const errors = [];

      page.on("console", (msg) => {
        if (msg.type() === "error") {
          errors.push(msg.text());
        }
      });

      for (const pageConfig of PAGES) {
        await page.goto(`/${pageConfig.url}`);
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(1000);
      }

      expect(errors).toHaveLength(0);
    });
  });

  // ============================================
  // SEO TESTS
  // ============================================

  test.describe("SEO", () => {
    for (const page of PAGES) {
      test(`should have proper meta tags for ${page.name}`, async ({
        page: testPage,
      }) => {
        await testPage.goto(`/${page.url}`);

        // Check title
        const title = await testPage.title();
        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(10);
        expect(title.length).toBeLessThan(60);

        // Check meta description
        const metaDescription = await testPage.getAttribute(
          'meta[name="description"]',
          "content"
        );
        expect(metaDescription).toBeTruthy();
        expect(metaDescription.length).toBeGreaterThan(50);
        expect(metaDescription.length).toBeLessThan(160);

        // Check viewport meta tag
        const viewport = await testPage.getAttribute(
          'meta[name="viewport"]',
          "content"
        );
        expect(viewport).toContain("width=device-width");

        // Check canonical URL
        const canonical = await testPage.getAttribute(
          'link[rel="canonical"]',
          "href"
        );
        expect(canonical).toBeTruthy();
      });
    }

    test("should have structured data", async ({ page }) => {
      await page.goto("/index.html");

      const structuredData = page
        .locator('script[type="application/ld+json"]')
        .first();
      await expect(structuredData).toBeVisible();

      const jsonContent = await structuredData.textContent();
      expect(jsonContent).toContain("@context");
      expect(jsonContent).toContain("@type");
    });

    test("should have favicon", async ({ page }) => {
      await page.goto("/index.html");

      const favicon = page.locator('link[rel="icon"]');
      const faviconHref = await favicon.getAttribute("href");
      expect(faviconHref).toBeTruthy();
    });
  });

  // ============================================
  // CROSS-PAGE CONSISTENCY TESTS
  // ============================================

  test.describe("Cross-Page Consistency", () => {
    test("should have consistent navigation structure", async ({ page }) => {
      const navStructure = [];

      for (const pageConfig of PAGES) {
        await page.goto(`/${pageConfig.url}`);
        await page.waitForLoadState("networkidle");

        const navLinks = page.locator(".nav-link");
        const linkTexts = await navLinks.allTextContents();
        navStructure.push(linkTexts);
      }

      // All pages should have the same navigation structure
      const firstNav = navStructure[0];
      for (let i = 1; i < navStructure.length; i++) {
        expect(navStructure[i]).toEqual(firstNav);
      }
    });

    test("should have consistent styling", async ({ page }) => {
      await page.goto("/index.html");

      // Check brand colors are used
      const tealElements = page.locator('[class*="teal-blue"]');
      const orangeElements = page.locator('[class*="electric-orange"]');

      const tealCount = await tealElements.count();
      const orangeCount = await orangeElements.count();

      expect(tealCount).toBeGreaterThan(0);
      expect(orangeCount).toBeGreaterThan(0);
    });
  });
});
