const { test, expect } = require("@playwright/test");

test("Debug Lucide Icons", async ({ page }) => {
  await page.goto("http://localhost:8000");
  await page.waitForLoadState("networkidle");

  // Check if Lucide is loaded
  const lucideLoaded = await page.evaluate(() => typeof lucide !== "undefined");
  console.log("Lucide loaded:", lucideLoaded);

  // Check if icons are being rendered
  const allIcons = await page.locator("i[data-lucide]").count();
  console.log("Total Lucide icons found:", allIcons);

  // Check consultation button specifically
  const consultationBtn = page
    .locator('a[href="contact.html"]')
    .filter({ hasText: "Book Free Consultation" });
  const btnHTML = await consultationBtn.innerHTML();
  console.log("Consultation button HTML:", btnHTML);

  // Check if Lucide is initializing icons
  await page.evaluate(() => {
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  });

  await page.waitForTimeout(2000);

  // Check again after initialization
  const iconsAfterInit = await page.locator("i[data-lucide]").count();
  console.log("Icons after initialization:", iconsAfterInit);

  // Check consultation button again
  const consultationIcon = consultationBtn.locator('i[data-lucide="calendar"]');
  const iconCount = await consultationIcon.count();
  console.log("Calendar icons in consultation button:", iconCount);
});
