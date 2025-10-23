const { test, expect } = require("@playwright/test");

test("Debug Counter Animation", async ({ page }) => {
  await page.goto("http://localhost:8001");
  await page.waitForLoadState("networkidle");

  // Check if counters exist
  const counters = await page.locator(".counter").count();
  console.log(`Found ${counters} counter elements`);

  // Check each counter
  for (let i = 0; i < counters; i++) {
    const counter = page.locator(".counter").nth(i);
    const target = await counter.getAttribute("data-target");
    const currentValue = await counter.textContent();
    console.log(`Counter ${i}: target=${target}, current=${currentValue}`);
  }

  // Scroll to hero section to trigger animation
  await page.locator("#hero").scrollIntoViewIfNeeded();
  await page.waitForTimeout(3000);

  // Check values after scroll
  console.log("After scroll:");
  for (let i = 0; i < counters; i++) {
    const counter = page.locator(".counter").nth(i);
    const currentValue = await counter.textContent();
    console.log(`Counter ${i}: current=${currentValue}`);
  }

  // Take screenshot
  await page.screenshot({ path: "counter-debug.png" });
});
