const { test, expect } = require("@playwright/test");

test("Check Console for Counter Errors", async ({ page }) => {
  const consoleMessages = [];
  page.on("console", (msg) => {
    consoleMessages.push(`${msg.type()}: ${msg.text()}`);
  });

  await page.goto("http://localhost:8001");
  await page.waitForLoadState("networkidle");

  // Wait for any console messages
  await page.waitForTimeout(3000);

  console.log("Console messages:");
  consoleMessages.forEach((msg) => console.log(msg));

  // Check if counters exist and their current state
  const counters = await page.locator(".counter").count();
  console.log(`Found ${counters} counters`);

  for (let i = 0; i < counters; i++) {
    const counter = page.locator(".counter").nth(i);
    const target = await counter.getAttribute("data-target");
    const currentValue = await counter.textContent();
    console.log(`Counter ${i}: target=${target}, current="${currentValue}"`);
  }
});
