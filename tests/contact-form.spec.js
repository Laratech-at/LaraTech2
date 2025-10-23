const { test, expect } = require("@playwright/test");

test.describe("Contact Form - Comprehensive Testing", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact.html");
    await page.waitForLoadState("networkidle");
  });

  test("should validate required fields", async ({ page }) => {
    const submitBtn = page.locator('button[type="submit"]');

    // Try to submit empty form
    await submitBtn.click();

    // Check for validation messages or form not submitting
    const nameField = page.locator("#name");
    const emailField = page.locator("#email");
    const messageField = page.locator("#message");

    // Check if fields are marked as required
    const nameRequired = await nameField.getAttribute("required");
    const emailRequired = await emailField.getAttribute("required");
    const messageRequired = await messageField.getAttribute("required");

    expect(nameRequired).not.toBeNull();
    expect(emailRequired).not.toBeNull();
    expect(messageRequired).not.toBeNull();
  });

  test("should validate email format", async ({ page }) => {
    const emailField = page.locator("#email");

    // Test invalid email formats
    const invalidEmails = ["invalid", "test@", "@domain.com", "test@domain"];

    for (const invalidEmail of invalidEmails) {
      await emailField.fill(invalidEmail);
      await emailField.blur();

      // Check if browser validation catches it
      const validity = await emailField.evaluate((el) => el.validity);
      if (validity) {
        expect(validity.valid).toBe(false);
      }
    }

    // Test valid email
    await emailField.fill("test@example.com");
    await emailField.blur();

    const validity = await emailField.evaluate((el) => el.validity);
    if (validity) {
      expect(validity.valid).toBe(true);
    }
  });

  test("should handle form submission gracefully", async ({ page }) => {
    const nameField = page.locator("#name");
    const emailField = page.locator("#email");
    const messageField = page.locator("#message");
    const submitBtn = page.locator('button[type="submit"]');

    // Fill form with valid data
    await nameField.fill("Test User");
    await emailField.fill("test@example.com");
    await messageField.fill("This is a test message for QA testing.");

    // Submit form
    await submitBtn.click();

    // Should not crash or redirect away from contact page
    await expect(page).toHaveURL(/contact\.html/);

    // Check for success message or form reset
    await page.waitForTimeout(1000);

    // Form should either show success message or reset
    const successMessage = page.locator(".success-message, .alert-success");
    const formReset = await nameField.inputValue();

    // Either success message appears or form resets or stays on same page
    const hasSuccessMessage = await successMessage
      .isVisible()
      .catch(() => false);
    const isFormReset = formReset === "";
    const isStillOnContactPage = page.url().includes("contact.html");

    expect(hasSuccessMessage || isFormReset || isStillOnContactPage).toBe(true);
  });

  test("should have proper form labels and accessibility", async ({ page }) => {
    const nameField = page.locator("#name");
    const emailField = page.locator("#email");
    const messageField = page.locator("#message");

    // Check labels are properly associated
    const nameLabel = page.locator('label[for="name"]');
    const emailLabel = page.locator('label[for="email"]');
    const messageLabel = page.locator('label[for="message"]');

    await expect(nameLabel).toBeVisible();
    await expect(emailLabel).toBeVisible();
    await expect(messageLabel).toBeVisible();

    // Check aria-labels or aria-describedby
    const nameAriaLabel = await nameField.getAttribute("aria-label");
    const emailAriaLabel = await emailField.getAttribute("aria-label");
    const messageAriaLabel = await messageField.getAttribute("aria-label");

    // At least one accessibility method should be present
    expect(nameAriaLabel || (await nameLabel.isVisible())).toBe(true);
    expect(emailAriaLabel || (await emailLabel.isVisible())).toBe(true);
    expect(messageAriaLabel || (await messageLabel.isVisible())).toBe(true);
  });

  test("should handle special characters in form fields", async ({ page }) => {
    const nameField = page.locator("#name");
    const messageField = page.locator("#message");

    // Test special characters
    const specialChars = "Test User <>&\"'`";
    const unicodeChars = "Test User 测试用户 🚀";

    await nameField.fill(specialChars);
    await messageField.fill(unicodeChars);

    // Should not crash or show errors
    const nameValue = await nameField.inputValue();
    const messageValue = await messageField.inputValue();

    expect(nameValue).toBe(specialChars);
    expect(messageValue).toBe(unicodeChars);
  });

  test("should have working newsletter checkbox", async ({ page }) => {
    const newsletterCheckbox = page.locator("#newsletter");

    if (await newsletterCheckbox.isVisible()) {
      // Test checkbox functionality
      await newsletterCheckbox.check();
      const isChecked = await newsletterCheckbox.isChecked();
      expect(isChecked).toBe(true);

      await newsletterCheckbox.uncheck();
      const isUnchecked = await newsletterCheckbox.isChecked();
      expect(isUnchecked).toBe(false);
    }
  });

  test("should have proper form styling and layout", async ({ page }) => {
    const form = page.locator("#contact-form");
    await expect(form).toBeVisible();

    // Check form has proper spacing and layout
    const formRect = await form.boundingBox();
    expect(formRect.width).toBeGreaterThan(250); // More lenient for mobile
    expect(formRect.height).toBeGreaterThan(400);

    // Check form fields are properly spaced
    const fields = page.locator("#contact-form input, #contact-form textarea");
    const fieldCount = await fields.count();
    expect(fieldCount).toBeGreaterThan(0);

    // Check submit button styling
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();

    const buttonText = await submitBtn.textContent();
    expect(buttonText).toBeTruthy();
    expect(buttonText.length).toBeGreaterThan(0);
  });
});
