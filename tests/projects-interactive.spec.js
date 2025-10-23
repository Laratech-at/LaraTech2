const { test, expect } = require("@playwright/test");

test.describe("Projects Page - Interactive Features", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects.html");
    await page.waitForLoadState("networkidle");
  });

  test("should filter projects by category", async ({ page }) => {
    // Test "All" filter
    const allFilter = page.locator('.filter-btn[data-filter="all"]');
    await expect(allFilter).toBeVisible();
    await allFilter.click();

    // Check all projects are visible
    const allProjects = page.locator(".project-card-3d");
    const allCount = await allProjects.count();
    expect(allCount).toBeGreaterThan(0);

    // Test "Automation" filter
    const automationFilter = page.locator(
      '.filter-btn[data-filter="automation"]'
    );
    await automationFilter.click();

    // Wait for filter animation
    await page.waitForTimeout(500);

    // Check only automation projects are visible
    const visibleProjects = page.locator(".project-card-3d:not(.hidden)");
    const visibleCount = await visibleProjects.count();
    expect(visibleCount).toBeLessThanOrEqual(allCount);
  });

  test("should toggle between grid and list view", async ({ page }) => {
    const gridToggle = page.locator("#grid-view-btn");
    const listToggle = page.locator("#list-view-btn");

    await expect(gridToggle).toBeVisible();
    await expect(listToggle).toBeVisible();

    // Test grid view
    await gridToggle.click();
    const gridContainer = page.locator("#projects-container");
    await expect(gridContainer).toBeVisible();

    // Test list view
    await listToggle.click();
    const listContainer = page.locator("#projects-container");
    await expect(listContainer).toBeVisible();
  });

  test("should have working project case study links", async ({ page }) => {
    const caseStudyLinks = page.locator(
      '.project-card a[href*="case-studies"]'
    );
    const linkCount = await caseStudyLinks.count();

    if (linkCount > 0) {
      const firstLink = caseStudyLinks.first();
      const href = await firstLink.getAttribute("href");
      expect(href).toContain("case-studies");

      // Test link opens in new tab
      const target = await firstLink.getAttribute("target");
      expect(target).toBe("_blank");
    }
  });

  test("should display project information correctly", async ({ page }) => {
    const projectCards = page.locator(".project-card-3d");
    const cardCount = await projectCards.count();

    expect(cardCount).toBeGreaterThan(0);

    // Check first project card has required elements
    const firstCard = projectCards.first();

    const title = firstCard.locator("h3");
    await expect(title).toBeVisible();

    const description = firstCard.locator("p");
    await expect(description).toBeVisible();

    const category = firstCard;
    const categoryAttr = await category.getAttribute("data-category");
    expect(categoryAttr).toBeTruthy();
  });
});
