import { test, expect } from '@playwright/test';
import { createTestUser } from '../lib/users.js';
import { register } from '../lib/flows.js';
import { snap } from '../lib/screenshot.js';

test.describe('Hashtag generation', () => {
  test('Generate hashtags from sample post', async ({ page }, testInfo) => {
    const user = createTestUser();
    await register(page, testInfo, user);

    // After registration, user is already on the generate page
    await page.waitForLoadState('networkidle');
    await snap(page, testInfo, 'gen-open');

    const input = page.getByLabel(/post|caption|content/i).first();
    await input.fill('Launching our new TagWiz feature! Generate smart hashtags automatically.');
    
    // Set hashtag count to 2 (free plan limit)
    const hashtagInput = page.locator('input[type="number"]');
    await hashtagInput.clear();
    await hashtagInput.fill('2');
    
    await snap(page, testInfo, 'gen-filled');

    const generateBtn = page.getByRole('button', { name: /generate/i }).first();
    await expect(generateBtn).toBeEnabled();
    await generateBtn.click();

    // Wait for hashtags to appear
    // The hashtags should appear below the button after generation completes
    // They typically appear as green text elements
    
    // Wait for the generation to complete - hashtags will appear below the form
    await page.waitForTimeout(2000); // Give initial time for request to start
    
    // Look for hashtags - they should appear as text starting with #
    const hashtagContainer = page.locator('body'); // Start with broad search
    await hashtagContainer.waitFor(); // Ensure page is loaded
    
    // Wait for hashtags to appear - they will be visible text starting with #
    const hashtagElements = page.locator('text=/^#[\\w]+/'); // Matches hashtags like #TagWiz
    
    // Wait for at least one hashtag to be visible
    await expect(hashtagElements.first()).toBeVisible({ timeout: 30000 });
    
    // Give a moment for all hashtags to render
    await page.waitForTimeout(1000);
    
    // Take screenshot after hashtags are visible
    await snap(page, testInfo, 'gen-results');

    const count = await hashtagElements.count();
    expect(count).toBe(2); // Should have exactly 2 hashtags for free plan
  });
});
