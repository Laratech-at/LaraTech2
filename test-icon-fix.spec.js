const { test, expect } = require("@playwright/test");

test("Verify SVG Icon Fix", async ({ page }) => {
  // Clear cache and go to new server
  await page.goto("http://localhost:8001/?v=3");
  await page.waitForLoadState("networkidle");

  // Check consultation button
  const consultationBtn = page
    .locator('a[href="contact.html"]')
    .filter({ hasText: "Book Free Consultation" });
  await expect(consultationBtn).toBeVisible();

  // Check for SVG calendar icon
  const calendarIcon = consultationBtn.locator("svg");
  const iconCount = await calendarIcon.count();

  console.log(`Found ${iconCount} SVG icons`);

  if (iconCount > 0) {
    await expect(calendarIcon.first()).toBeVisible();
    console.log("✅ SVG calendar icon is visible!");
  } else {
    console.log("❌ SVG calendar icon not found");
  }

  // Test mobile menu
  await page.setViewportSize({ width: 375, height: 667 });
  await page.reload();
  await page.waitForLoadState("networkidle");

  const mobileMenuToggle = page.locator("#mobile-menu-toggle");
  await mobileMenuToggle.click();
  await page.waitForTimeout(500);

  const mobileConsultationBtn = page
    .locator('#mobile-menu a[href="contact.html"]')
    .filter({ hasText: "Start Your Project" });
  const mobileIcon = mobileConsultationBtn.locator("svg");
  const mobileIconCount = await mobileIcon.count();

  console.log(`Found ${mobileIconCount} SVG icons in mobile menu`);

  if (mobileIconCount > 0) {
    await expect(mobileIcon.first()).toBeVisible();
    console.log("✅ Mobile SVG calendar icon is visible!");
  } else {
    console.log("❌ Mobile SVG calendar icon not found");
  }

  // Take screenshot
  await page.screenshot({ path: "svg-icon-test-result.png" });
});
