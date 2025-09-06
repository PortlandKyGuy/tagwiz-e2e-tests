import { expect } from '@playwright/test';
import { snap } from './screenshot.js';

export async function acceptCookieConsent(page) {
  // Accept cookie consent if present
  try {
    const acceptButton = page.getByRole('button', { name: /accept/i });
    if (await acceptButton.isVisible({ timeout: 3000 })) {
      await acceptButton.click();
      await page.waitForTimeout(500); // Wait for modal to close
    }
  } catch {
    // Cookie consent not present or already accepted
  }
}

export async function goHome(page) {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  await acceptCookieConsent(page);
}

export async function register(page, testInfo, user) {
  await goHome(page);
  await page.getByRole('link', { name: /sign up|register/i }).first().click();
  await page.getByLabel(/email/i).fill(user.email);
  await page.getByLabel(/^password$/i).fill(user.password);
  const confirm = page.locator('[name="confirmPassword"], [data-testid="confirm-password"]');
  if (await confirm.count()) {
    await confirm.fill(user.password);
  }
  
  // Check the Terms of Use checkbox
  const termsCheckbox = page.getByRole('checkbox', { name: /I agree to the Terms of Use/i });
  if (await termsCheckbox.isVisible({ timeout: 1000 })) {
    await termsCheckbox.check();
  }
  
  await snap(page, testInfo, 'auth-register-form');
  await page.getByRole('button', { name: /sign up|create account|register/i }).click();
  await page.waitForLoadState('networkidle');
  await snap(page, testInfo, 'auth-register-complete');
  await expect(page).toHaveURL(/(dashboard|onboarding|app)/i);
}

export async function login(page, user) {
  await goHome(page);
  await page.getByRole('link', { name: /sign in|log in|login/i }).first().click();
  await page.getByLabel(/email/i).fill(user.email);
  await page.getByLabel(/^password$/i).fill(user.password);
  await page.getByRole('button', { name: /sign in|log in|login/i }).click();
  await page.waitForLoadState('networkidle');
  // Verify successful login by checking we're on a logged-in page
  await expect(page).toHaveURL(/(dashboard|generate|app)/i);
}

export async function logout(page) {
  // Try to find logout link directly in the header
  const logoutLink = page.getByRole('link', { name: /logout|log out|sign out/i });
  if (await logoutLink.isVisible({ timeout: 2000 })) {
    await logoutLink.click();
  } else {
    // Try to find a user menu button first
    const menu = page.getByRole('button', { name: /account|user|profile/i });
    if (await menu.isVisible({ timeout: 2000 })) {
      await menu.click();
      await page.getByRole('menuitem', { name: /logout|log out|sign out/i }).click();
    }
  }
  // Wait for redirect - could be homepage or login page
  await page.waitForLoadState('networkidle');
  // Verify we're logged out by checking for Sign In/Sign Up links
  await expect(page.getByRole('link', { name: /sign in|log in|login|sign up/i }).first()).toBeVisible();
}
