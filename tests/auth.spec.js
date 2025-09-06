import { test, expect } from '@playwright/test';
import { createTestUser } from '../lib/users.js';
import { register, logout, login } from '../lib/flows.js';
import { snap } from '../lib/screenshot.js';

test.describe('Auth', () => {
  test('register → logout → login', async ({ page }, testInfo) => {
    const user = createTestUser();
    await register(page, testInfo, user);

    await logout(page);
    await snap(page, testInfo, 'auth-logged-out');
    
    // Login again
    await login(page, user);
    await snap(page, testInfo, 'auth-login-complete');
  });
});
