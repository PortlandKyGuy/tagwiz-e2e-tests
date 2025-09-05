import { expect } from '@playwright/test';
import { snap } from './screenshot.js';

export async function goHome(page) {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
}

export async function register(page, testInfo, user) {
  await goHome(page);
  await page.getByRole('link', { name: /sign up|register/i }).click();
  await page.getByLabel(/email/i).fill(user.email);
  await page.getByLabel(/^password$/i).fill(user.password);
  const confirm = page.locator('[name="confirmPassword"], [data-testid="confirm-password"]');
  if (await confirm.count()) {
    await confirm.fill(user.password);
  }
  await snap(page, testInfo, 'auth-register-form');
  await page.getByRole('button', { name: /sign up|create account|register/i }).click();
  await page.waitForLoadState('networkidle');
  await snap(page, testInfo, 'auth-register-complete');
  await expect(page).toHaveURL(/(dashboard|onboarding|app)/i);
}

export async function login(page, user) {
  await goHome(page);
  await page.getByRole('link', { name: /sign in|log in/i }).click();
  await page.getByLabel(/email/i).fill(user.email);
  await page.getByLabel(/^password$/i).fill(user.password);
  await page.getByRole('button', { name: /sign in|log in/i }).click();
  await page.waitForLoadState('networkidle');
}

export async function logout(page) {
  const menu = page.getByRole('button', { name: /account|user|profile/i });
  if (await menu.count()) {
    await menu.click();
  }
  try {
    await page.getByRole('menuitem', { name: /log out|sign out/i }).click();
  } catch {
    const link = page.getByRole('link', { name: /log out|sign out/i });
    if (await link.count()) await link.click();
  }
  await page.waitForURL(/login|signin/i);
}
