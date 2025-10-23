const { test, expect } = require("@playwright/test");

test("Final Counter Animation Test", async ({ page }) => {
  await page.goto("http://localhost:8001");
  await page.waitForLoadState("networkidle");

  // Wait for counter animation to complete
  await page.waitForTimeout(3000);

  // Check final values
  const counters = await page.locator(".counter").count();
  console.log(`Found ${counters} counters`);

  for (let i = 0; i < counters; i++) {
    const counter = page.locator(".counter").nth(i);
    const target = await counter.getAttribute("data-target");
    const currentValue = await counter.textContent();
    console.log(`Counter ${i}: target=${target}, current="${currentValue}"`);

    // Verify counter has animated to target value
    expect(currentValue.trim()).toBe(target);
  }

  console.log("✅ All counters animated successfully!");
});
