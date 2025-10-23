const { test, expect } = require("@playwright/test");

test("Manual Counter Animation Test", async ({ page }) => {
  const consoleMessages = [];
  page.on("console", (msg) => {
    consoleMessages.push(`${msg.type()}: ${msg.text()}`);
  });

  await page.goto("http://localhost:8001");
  await page.waitForLoadState("networkidle");

  // Wait for any console messages
  await page.waitForTimeout(2000);

  // Manually trigger counter animation
  await page.evaluate(() => {
    const counters = document.querySelectorAll(".counter");
    console.log(`Found ${counters.length} counters`);

    counters.forEach((counter, index) => {
      const target = parseInt(counter.getAttribute("data-target"));
      console.log(`Counter ${index}: target=${target}`);

      // Simple animation
      let current = 0;
      const increment = target / 50; // 50 steps
      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(interval);
        } else {
          counter.textContent = Math.floor(current);
        }
      }, 40); // 25fps
    });
  });

  // Wait for animation to complete
  await page.waitForTimeout(3000);

  // Check final values
  const counters = await page.locator(".counter").count();
  console.log(`Found ${counters} counters`);

  for (let i = 0; i < counters; i++) {
    const counter = page.locator(".counter").nth(i);
    const target = await counter.getAttribute("data-target");
    const currentValue = await counter.textContent();
    console.log(`Counter ${i}: target=${target}, current="${currentValue}"`);
  }

  console.log("Console messages:");
  consoleMessages.forEach((msg) => console.log(msg));
});
