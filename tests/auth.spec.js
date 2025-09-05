import { test, expect } from '@playwright/test';
import { createTestUser } from '../lib/users.js';
import { register, logout } from '../lib/flows.js';
import { snap } from '../lib/screenshot.js';

test.describe('Auth', () => {
  test('register → logout → login', async ({ page }, testInfo) => {
    const user = createTestUser();
    await register(page, testInfo, user);

    await logout(page, testInfo);
    await snap(page, testInfo, 'auth-logged-out');
    await expect(page).toHaveURL(/login/i);

    await page.getByLabel(/email/i).fill(user.email);
    await page.getByLabel(/^password$/i).fill(user.password);
    await page.getByRole('button', { name: /sign in|log in/i }).click();
    await page.waitForLoadState('networkidle');
    await snap(page, testInfo, 'auth-login-complete');
    await expect(page).toHaveURL(/dashboard|onboarding|app/i);
  });
});
