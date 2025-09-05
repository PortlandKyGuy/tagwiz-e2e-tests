import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const BASE_URL = process.env.BASE_URL || 'https://test-b1.tagwiz.app/';
const HEADED = (process.env.HEADED || 'false').toLowerCase() === 'true';
const WORKERS = parseInt(process.env.PARALLEL_WORKERS || '4', 10);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: WORKERS,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'artifacts/report/html' }]
  ],
  use: {
    baseURL: BASE_URL,
    headless: !HEADED,
    viewport: { width: 1366, height: 900 },
    screenshot: 'on',
    trace: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
