const { chromium } = require("@playwright/test");

async function globalSetup(config) {
  console.log("🚀 Starting global setup...");

  // Launch browser for setup tasks
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Wait for the server to be ready
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    console.log("✅ Server is ready");

    // Take baseline screenshots for visual regression testing
    const pages = [
      "index.html",
      "about.html",
      "services.html",
      "projects.html",
      "contact.html",
      "blog.html",
    ];

    for (const pageName of pages) {
      await page.goto(`http://localhost:3000/${pageName}`);
      await page.waitForLoadState("networkidle");

      // Desktop screenshot
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.screenshot({
        path: `test-results/baseline-desktop-${pageName.replace(
          ".html",
          ""
        )}.png`,
        fullPage: true,
      });

      // Mobile screenshot
      await page.setViewportSize({ width: 375, height: 667 });
      await page.screenshot({
        path: `test-results/baseline-mobile-${pageName.replace(
          ".html",
          ""
        )}.png`,
        fullPage: true,
      });
    }

    console.log("✅ Baseline screenshots captured");
  } catch (error) {
    console.error("❌ Global setup failed:", error);
    throw error;
  } finally {
    await browser.close();
  }
}

module.exports = globalSetup;
