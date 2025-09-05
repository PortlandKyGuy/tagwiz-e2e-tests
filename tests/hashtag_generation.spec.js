import { test, expect } from '@playwright/test';
import { createTestUser } from '../lib/users.js';
import { register } from '../lib/flows.js';
import { snap } from '../lib/screenshot.js';

test.describe('Hashtag generation', () => {
  test('Generate hashtags from sample post', async ({ page }, testInfo) => {
    const user = createTestUser();
    await register(page, testInfo, user);

    await page.getByRole('link', { name: /generate|hashtags/i }).click();
    await page.waitForLoadState('networkidle');
    await snap(page, testInfo, 'gen-open');

    const input = page.getByLabel(/post|caption|content/i).first();
    await input.fill('Launching our new TagWiz feature! Generate smart hashtags automatically.');
    await snap(page, testInfo, 'gen-filled');

    const generateBtn = page.getByRole('button', { name: /generate/i }).first();
    await expect(generateBtn).toBeEnabled();
    await generateBtn.click();

    const list = page.locator('[data-testid="hashtag-item"], [data-testid="hashtags-list"] *');
    await list.first().waitFor();
    await snap(page, testInfo, 'gen-results');

    const items = await list.count();
    expect(items).toBeGreaterThan(0);
  });
});
