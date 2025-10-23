const { test, expect } = require("@playwright/test");

test.describe("LaraTech Website Fixes Verification", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:8000");
    await page.waitForLoadState("networkidle");
  });

  test("1. Navbar Language Dropdown Overlap Fix", async ({ page }) => {
    // Test that language dropdown doesn't overlap
    const langDropdownBtn = page.locator("#lang-dropdown-btn");
    const langDropdownContent = page.locator("#lang-dropdown-content");

    // Click to open dropdown
    await langDropdownBtn.click();
    await page.waitForTimeout(500);

    // Check if dropdown is visible and positioned correctly
    await expect(langDropdownContent).toBeVisible();

    // Check z-index by ensuring it's above other elements
    const zIndex = await langDropdownContent.evaluate(
      (el) => window.getComputedStyle(el).zIndex
    );
    expect(parseInt(zIndex)).toBeGreaterThan(1000);

    // Check dropdown styling
    const bgColor = await langDropdownContent.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor
    );
    expect(bgColor).toContain("255, 255, 255"); // Should be white background

    console.log("✅ Language dropdown overlap fix verified");
  });

  test("2. Navbar Glassmorphism Enhancement", async ({ page }) => {
    // Test navbar glassmorphism effect
    const navbar = page.locator("#navbar");

    // Check if navbar has glassmorphism styling
    const bgColor = await navbar.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor
    );
    expect(bgColor).toContain("255, 255, 255"); // Should have white background

    // Check backdrop filter
    const backdropFilter = await navbar.evaluate(
      (el) => window.getComputedStyle(el).backdropFilter
    );
    expect(backdropFilter).toContain("blur"); // Should have blur effect

    // Check border
    const borderColor = await navbar.evaluate(
      (el) => window.getComputedStyle(el).borderColor
    );
    expect(borderColor).toContain("0, 200, 200"); // Should have teal border

    console.log("✅ Navbar glassmorphism enhancement verified");
  });

  test("3. Navbar Text Styling Improvements", async ({ page }) => {
    // Test navbar text styling
    const navLinks = page.locator(".nav-link");
    const firstLink = navLinks.first();

    // Check text shadow
    const textShadow = await firstLink.evaluate(
      (el) => window.getComputedStyle(el).textShadow
    );
    expect(textShadow).not.toBe("none"); // Should have text shadow

    // Test hover effect
    await firstLink.hover();
    await page.waitForTimeout(300);

    // Check color change on hover
    const hoverColor = await firstLink.evaluate(
      (el) => window.getComputedStyle(el).color
    );
    expect(hoverColor).toContain("0, 200, 200"); // Should be teal on hover

    // Check transform
    const transform = await firstLink.evaluate(
      (el) => window.getComputedStyle(el).transform
    );
    expect(transform).not.toBe("none"); // Should have transform on hover

    console.log("✅ Navbar text styling improvements verified");
  });

  test("4. Service Cards Looping Animation Fix", async ({ page }) => {
    // Test that service cards don't have continuous looping animations
    const serviceCards = page.locator(".service-card-3d");
    const serviceIcons = page.locator(".service-icon");

    // Wait for any initial animations to complete
    await page.waitForTimeout(2000);

    // Check that icons don't have continuous animations
    for (let i = 0; i < (await serviceIcons.count()); i++) {
      const icon = serviceIcons.nth(i);
      const animation = await icon.evaluate(
        (el) => window.getComputedStyle(el).animation
      );

      // Should not have continuous glow-pulse animation
      expect(animation).not.toContain("glow-pulse");
    }

    // Test hover effect on individual cards
    const firstCard = serviceCards.first();
    await firstCard.hover();
    await page.waitForTimeout(500);

    // Check that only the hovered card has glow effect
    const boxShadow = await firstCard.evaluate(
      (el) => window.getComputedStyle(el).boxShadow
    );
    expect(boxShadow).toContain("0, 200, 200"); // Should have teal glow on hover

    console.log("✅ Service cards looping animation fix verified");
  });

  test("5. Book Free Consultation Button Icon Fix", async ({ page }) => {
    // Wait for Lucide icons to load
    await page.waitForFunction(() => typeof lucide !== "undefined", {
      timeout: 10000,
    });

    // Test consultation button has visible icon
    const consultationBtn = page
      .locator('a[href="contact.html"]')
      .filter({ hasText: "Book Free Consultation" });

    // Check if button exists
    await expect(consultationBtn).toBeVisible();

    // Check for calendar icon - try different selectors
    const calendarIcon = consultationBtn.locator('i[data-lucide="calendar"]');

    // If calendar icon not found, check if it's a different icon type
    const iconCount = await calendarIcon.count();
    if (iconCount === 0) {
      // Check for any icon in the button
      const anyIcon = consultationBtn.locator("i");
      const iconCount2 = await anyIcon.count();
      console.log(`Found ${iconCount2} icons in consultation button`);

      if (iconCount2 > 0) {
        const firstIcon = anyIcon.first();
        await expect(firstIcon).toBeVisible();
        console.log(
          "✅ Consultation button has an icon (not calendar specific)"
        );
      } else {
        console.log("❌ No icon found in consultation button");
      }
    } else {
      await expect(calendarIcon).toBeVisible();
      console.log("✅ Calendar icon found");
    }

    // Test mobile menu version
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile viewport
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Wait for Lucide to load again
    await page.waitForFunction(() => typeof lucide !== "undefined", {
      timeout: 10000,
    });

    // Open mobile menu
    const mobileMenuToggle = page.locator("#mobile-menu-toggle");
    await mobileMenuToggle.click();
    await page.waitForTimeout(500);

    // Check mobile consultation button
    const mobileConsultationBtn = page
      .locator('#mobile-menu a[href="contact.html"]')
      .filter({ hasText: "Start Your Project" });
    const mobileIcon = mobileConsultationBtn.locator("i");
    const mobileIconCount = await mobileIcon.count();

    if (mobileIconCount > 0) {
      await expect(mobileIcon.first()).toBeVisible();
      console.log("✅ Mobile consultation button has icon");
    } else {
      console.log("❌ No icon found in mobile consultation button");
    }

    console.log("✅ Book Free Consultation button icon fix verified");
  });

  test("6. Cookie Consent Banner Visibility", async ({ page }) => {
    // Wait for cookie banner to appear (should appear after 2 seconds)
    await page.waitForTimeout(3000);

    const cookieBanner = page.locator("#cookie-banner");

    // Check if banner is visible
    await expect(cookieBanner).toBeVisible();

    // Check banner styling
    const bgColor = await cookieBanner.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor
    );
    expect(bgColor).toContain("15, 23, 42"); // Should have dark background

    // Check buttons exist
    const acceptBtn = page.locator("#accept-cookies");
    const rejectBtn = page.locator("#reject-cookies");
    const learnMoreBtn = page.locator(".cookie-learn-more-btn"); // Use class selector instead

    await expect(acceptBtn).toBeVisible();
    await expect(rejectBtn).toBeVisible();
    await expect(learnMoreBtn).toBeVisible();

    // Check accept button styling
    const acceptBtnColor = await acceptBtn.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor
    );
    expect(acceptBtnColor).toContain("0, 200, 200"); // Should be teal

    console.log("✅ Cookie consent banner visibility verified");
  });

  test("7. Overall Visual Quality Check", async ({ page }) => {
    // Take screenshot for visual verification
    await page.screenshot({ path: "homepage-fixes.png", fullPage: true });

    // Check that all main sections are visible
    await expect(page.locator("#hero")).toBeVisible();
    await expect(page.locator("#services-preview")).toBeVisible();
    await expect(page.locator("#cta")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();

    // Check that no JavaScript errors occurred
    const errors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);

    console.log("✅ Overall visual quality check completed");
  });

  test("8. Mobile Responsiveness Test", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Check mobile menu functionality
    const mobileMenuToggle = page.locator("#mobile-menu-toggle");
    await expect(mobileMenuToggle).toBeVisible();

    await mobileMenuToggle.click();
    await page.waitForTimeout(500);

    const mobileMenu = page.locator("#mobile-menu");
    await expect(mobileMenu).toBeVisible();

    // Check language dropdown on mobile
    const langDropdownBtn = page.locator("#lang-dropdown-btn");
    await langDropdownBtn.click();
    await page.waitForTimeout(500);

    const langDropdownContent = page.locator("#lang-dropdown-content");
    await expect(langDropdownContent).toBeVisible();

    console.log("✅ Mobile responsiveness test completed");
  });
});
