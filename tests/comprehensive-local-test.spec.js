const { test, expect } = require("@playwright/test");

test.describe("Comprehensive Local Website Testing", () => {
  let consoleMessages = [];
  let errors = [];

  test.beforeEach(async ({ page }) => {
    // Clear previous messages
    consoleMessages = [];
    errors = [];

    // Listen to console messages
    page.on("console", (msg) => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
        location: msg.location(),
      });
    });

    // Listen to page errors
    page.on("pageerror", (error) => {
      errors.push({
        message: error.message,
        stack: error.stack,
      });
    });

    // Listen to network failures
    page.on("response", (response) => {
      if (!response.ok()) {
        errors.push({
          type: "network",
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
        });
      }
    });
  });

  const pages = [
    { name: "Homepage", url: "/" },
    { name: "Services", url: "/services.html" },
    { name: "About", url: "/about.html" },
    { name: "Contact", url: "/contact.html" },
    { name: "Projects", url: "/projects.html" },
    { name: "Blog", url: "/blog.html" },
  ];

  for (const pageInfo of pages) {
    test(`${pageInfo.name} - Desktop View`, async ({ page }) => {
      console.log(`\n=== Testing ${pageInfo.name} (Desktop) ===`);

      // Navigate to page
      await page.goto(pageInfo.url);
      await page.waitForLoadState("networkidle");

      // Check page title
      const title = await page.title();
      console.log(`Page Title: ${title}`);

      // Check for critical elements
      const criticalElements = ["nav", "main", "footer"];

      for (const selector of criticalElements) {
        const element = await page.locator(selector).first();
        await expect(element).toBeVisible();
      }

      // Check for broken images
      const images = await page.locator("img").all();
      for (const img of images) {
        const src = await img.getAttribute("src");
        if (src) {
          const isVisible = await img.isVisible();
          if (isVisible) {
            const naturalWidth = await img.evaluate((el) => el.naturalWidth);
            if (naturalWidth === 0) {
              console.log(`⚠️  Broken image detected: ${src}`);
            }
          }
        }
      }

      // Check for interactive elements
      const buttons = await page.locator('button, a[role="button"]').all();
      console.log(`Found ${buttons.length} interactive elements`);

      // Test navigation
      const navLinks = await page.locator("nav a").all();
      console.log(`Found ${navLinks.length} navigation links`);

      // Check console messages
      const warnings = consoleMessages.filter((msg) => msg.type === "warning");
      const consoleErrors = consoleMessages.filter(
        (msg) => msg.type === "error"
      );

      if (warnings.length > 0) {
        console.log(`\n⚠️  Console Warnings (${warnings.length}):`);
        warnings.forEach((warning) => {
          console.log(`  - ${warning.text}`);
        });
      }

      if (consoleErrors.length > 0) {
        console.log(`\n❌ Console Errors (${consoleErrors.length}):`);
        consoleErrors.forEach((error) => {
          console.log(`  - ${error.text}`);
        });
      }

      // Check for JavaScript errors
      if (errors.length > 0) {
        console.log(`\n❌ JavaScript Errors (${errors.length}):`);
        errors.forEach((error) => {
          console.log(`  - ${error.message}`);
        });
      }

      // Take screenshot for visual verification
      await page.screenshot({
        path: `test-results/local-test-${pageInfo.name.toLowerCase()}-desktop.png`,
        fullPage: true,
      });

      console.log(`✅ ${pageInfo.name} desktop test completed`);
    });

    test(`${pageInfo.name} - Mobile View`, async ({ page }) => {
      console.log(`\n=== Testing ${pageInfo.name} (Mobile) ===`);

      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Navigate to page
      await page.goto(pageInfo.url);
      await page.waitForLoadState("networkidle");

      // Check responsive design
      const navToggle = await page
        .locator("[data-mobile-menu-toggle], .mobile-menu-toggle, .hamburger")
        .first();
      if (await navToggle.isVisible()) {
        console.log("Mobile menu toggle found");
      }

      // Check if content is properly sized for mobile
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = page.viewportSize().width;

      if (bodyWidth > viewportWidth + 50) {
        console.log(
          `⚠️  Potential horizontal scroll issue: body width ${bodyWidth}px vs viewport ${viewportWidth}px`
        );
      }

      // Take mobile screenshot
      await page.screenshot({
        path: `test-results/local-test-${pageInfo.name.toLowerCase()}-mobile.png`,
        fullPage: true,
      });

      console.log(`✅ ${pageInfo.name} mobile test completed`);
    });
  }

  test("Cross-page Navigation Test", async ({ page }) => {
    console.log("\n=== Testing Cross-page Navigation ===");

    // Start from homepage
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const navLinks = await page.locator("nav a[href]").all();
    const testedLinks = new Set();

    for (const link of navLinks) {
      const href = await link.getAttribute("href");
      if (
        href &&
        !href.startsWith("http") &&
        !href.startsWith("mailto") &&
        !href.startsWith("tel") &&
        !testedLinks.has(href)
      ) {
        testedLinks.add(href);

        try {
          console.log(`Testing navigation to: ${href}`);
          await link.click();
          await page.waitForLoadState("networkidle");

          // Check if page loaded successfully
          const title = await page.title();
          console.log(`  ✅ Successfully navigated to: ${title}`);

          // Go back to homepage for next test
          await page.goto("/");
          await page.waitForLoadState("networkidle");
        } catch (error) {
          console.log(`  ❌ Navigation failed for ${href}: ${error.message}`);
        }
      }
    }

    console.log(`✅ Tested ${testedLinks.size} navigation links`);
  });

  test("Interactive Elements Test", async ({ page }) => {
    console.log("\n=== Testing Interactive Elements ===");

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Test buttons
    const buttons = await page.locator("button").all();
    console.log(`Found ${buttons.length} buttons`);

    for (const button of buttons) {
      const isVisible = await button.isVisible();
      const isEnabled = await button.isEnabled();

      if (isVisible && isEnabled) {
        try {
          await button.click();
          console.log(`✅ Button clicked successfully`);
        } catch (error) {
          console.log(`❌ Button click failed: ${error.message}`);
        }
      }
    }

    // Test forms
    const forms = await page.locator("form").all();
    console.log(`Found ${forms.length} forms`);

    for (const form of forms) {
      const inputs = await form.locator("input, textarea, select").all();
      console.log(`  Form has ${inputs.length} input elements`);
    }

    console.log("✅ Interactive elements test completed");
  });

  test("Performance Check", async ({ page }) => {
    console.log("\n=== Performance Check ===");

    await page.goto("/");

    // Measure page load time
    const loadTime = await page.evaluate(() => {
      return (
        performance.timing.loadEventEnd - performance.timing.navigationStart
      );
    });

    console.log(`Page load time: ${loadTime}ms`);

    // Check for large images
    const images = await page.locator("img").all();
    let totalImageSize = 0;

    for (const img of images) {
      const src = await img.getAttribute("src");
      if (src && !src.startsWith("data:")) {
        try {
          const response = await page.request.get(src);
          const contentLength = response.headers()["content-length"];
          if (contentLength) {
            totalImageSize += parseInt(contentLength);
          }
        } catch (error) {
          // Ignore failed requests
        }
      }
    }

    console.log(`Total image size: ${Math.round(totalImageSize / 1024)}KB`);

    // Check for unused CSS/JS
    const stylesheets = await page.locator('link[rel="stylesheet"]').count();
    const scripts = await page.locator("script[src]").count();

    console.log(`Stylesheets: ${stylesheets}, Scripts: ${scripts}`);

    console.log("✅ Performance check completed");
  });
});
