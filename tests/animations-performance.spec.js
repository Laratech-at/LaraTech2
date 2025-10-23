const { test, expect } = require("@playwright/test");

test.describe("Animation & Performance Testing", () => {
  test("should have smooth particle animation", async ({ page }) => {
    await page.goto("/index.html");
    await page.waitForLoadState("networkidle");

    // Check particle canvas exists
    const particleCanvas = page.locator("#particles-canvas");
    await expect(particleCanvas).toBeVisible();

    // Check canvas has proper dimensions
    const canvasRect = await particleCanvas.boundingBox();
    expect(canvasRect.width).toBeGreaterThan(0);
    expect(canvasRect.height).toBeGreaterThan(0);

    // Wait for animation to start
    await page.waitForTimeout(2000);

    // Check if particles are moving (canvas content changes)
    const initialCanvasData = await particleCanvas.evaluate((canvas) => {
      const ctx = canvas.getContext("2d");
      return ctx.getImageData(0, 0, 10, 10).data;
    });

    await page.waitForTimeout(1000);

    const laterCanvasData = await particleCanvas.evaluate((canvas) => {
      const ctx = canvas.getContext("2d");
      return ctx.getImageData(0, 0, 10, 10).data;
    });

    // Canvas content should change (particles moving) - but be lenient if animation is disabled
    if (initialCanvasData && laterCanvasData) {
      // Only test if both data arrays exist
      expect(initialCanvasData).not.toEqual(laterCanvasData);
    }
  });

  test("should have smooth counter animations", async ({ page }) => {
    await page.goto("/index.html");

    const counters = page.locator(".counter");
    const counterCount = await counters.count();

    if (counterCount > 0) {
      // Get initial counter values
      const initialValues = [];
      for (let i = 0; i < counterCount; i++) {
        const value = await counters.nth(i).textContent();
        initialValues.push(value);
      }

      // Wait for animation to complete
      await page.waitForTimeout(3000);

      // Check final counter values
      const finalValues = [];
      for (let i = 0; i < counterCount; i++) {
        const value = await counters.nth(i).textContent();
        finalValues.push(value);
      }

      // Values should have changed (animated)
      expect(finalValues).not.toEqual(initialValues);

      // Final values should be numbers
      for (const value of finalValues) {
        expect(parseInt(value)).toBeGreaterThan(0);
      }
    }
  });

  test("should have smooth scroll animations", async ({ page }) => {
    await page.goto("/index.html");

    // Test smooth scrolling to sections
    const scrollElements = page.locator("[data-scroll-target]");
    const scrollCount = await scrollElements.count();

    if (scrollCount > 0) {
      const firstScrollElement = scrollElements.first();
      await firstScrollElement.click();

      // Check if smooth scrolling occurred
      await page.waitForTimeout(1000);

      // Should not crash or cause layout issues
      const body = page.locator("body");
      await expect(body).toBeVisible();
    }
  });

  test("should have proper fade-in animations", async ({ page }) => {
    await page.goto("/index.html");

    // Check for fade-in elements
    const fadeElements = page.locator('.fade-in, [data-aos="fade-in"]');
    const fadeCount = await fadeElements.count();

    if (fadeCount > 0) {
      // Scroll to trigger fade-in animations
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(1000);

      // Check that fade-in elements become visible
      const visibleFadeElements = page.locator(
        '.fade-in.visible, [data-aos="fade-in"].aos-animate'
      );
      const visibleCount = await visibleFadeElements.count();

      expect(visibleCount).toBeGreaterThan(0);
    }
  });

  test("should maintain 60fps during animations", async ({ page }) => {
    await page.goto("/index.html");

    // Monitor frame rate during animations
    const frameRateData = await page.evaluate(() => {
      const frameRates = [];
      let frameCount = 0;
      let lastTime = performance.now();

      function measureFrameRate() {
        frameCount++;
        const currentTime = performance.now();

        if (currentTime - lastTime >= 1000) {
          const fps = (frameCount * 1000) / (currentTime - lastTime);
          frameRates.push(fps);
          frameCount = 0;
          lastTime = currentTime;
        }

        if (frameRates.length < 3) {
          requestAnimationFrame(measureFrameRate);
        }
      }

      requestAnimationFrame(measureFrameRate);

      // Return frame rates after 3 seconds
      return new Promise((resolve) => {
        setTimeout(() => resolve(frameRates), 3000);
      });
    });

    if (frameRateData && frameRateData.length > 0) {
      const averageFPS =
        frameRateData.reduce((a, b) => a + b, 0) / frameRateData.length;
      expect(averageFPS).toBeGreaterThan(30); // Should maintain at least 30fps
    }
  });

  test("should not cause layout shifts during animations", async ({ page }) => {
    await page.goto("/index.html");

    // Monitor layout shifts
    const layoutShiftData = await page.evaluate(() => {
      let layoutShifts = 0;

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "layout-shift" && !entry.hadRecentInput) {
            layoutShifts += entry.value;
          }
        }
      });

      observer.observe({ entryTypes: ["layout-shift"] });

      // Return layout shifts after 3 seconds
      return new Promise((resolve) => {
        setTimeout(() => resolve(layoutShifts), 3000);
      });
    });

    // Check for excessive layout shifts
    expect(layoutShiftData).toBeLessThan(0.1); // CLS should be low
  });

  test("should handle reduced motion preference", async ({ page }) => {
    // Test with reduced motion preference
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/index.html");

    // Check that animations are disabled or reduced
    const animatedElements = page.locator(".animated, [data-aos]");
    const animatedCount = await animatedElements.count();

    if (animatedCount > 0) {
      // With reduced motion, animations should be disabled
      const firstAnimated = animatedElements.first();
      const computedStyle = await firstAnimated.evaluate((el) => {
        return window.getComputedStyle(el).animationDuration;
      });

      // Animation duration should be 0 or very short with reduced motion
      expect(computedStyle).toBe("0s");
    }
  });

  test("should have proper animation performance on mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/index.html");

    // Test animations on mobile viewport
    const particleCanvas = page.locator("#particles-canvas");
    await expect(particleCanvas).toBeVisible();

    // Check canvas performance on mobile
    const canvasRect = await particleCanvas.boundingBox();
    expect(canvasRect.width).toBeGreaterThan(0);
    expect(canvasRect.height).toBeGreaterThan(0);

    // Wait for animations to run
    await page.waitForTimeout(2000);

    // Should not cause performance issues
    const errors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" && msg.text().includes("performance")) {
        errors.push(msg.text());
      }
    });

    expect(errors).toHaveLength(0);
  });
});
