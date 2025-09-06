# /qa/tagwiz-e2e

**Purpose:**  
End-to-end UI validation for TagWiz in the **test environment** using **Playwright (headless)**.  
Creates **new throwaway user accounts**, runs **full or targeted** feature flows, **takes screenshots**, and **evaluates** them (visual checklists + pass/fail notes + diffs where possible). Produces a succinct **HTML/Markdown report** and saves artifacts.

## Usage

```
/qa/tagwiz-e2e
env: https://test-b1.tagwiz.app/
scope: all | list
features: (comma-separated; used when scope=list)
seed: (optional integer; used to derive deterministic emails)
parallel: 4   # adjust to your CPU; Playwright projects/shards
```

**Examples**
- Full suite:  
  `env=https://test-b1.tagwiz.app/ scope=all parallel=6`
- Targeted tests (Auth + Hashtag Generation):  
  `env=https://test-b1.tagwiz.app/ scope=list features=auth,hashtag_generation parallel=2`

## Test Users

- Generate unique emails per run: `tagwiz+<timestamp>.<rand>@example.com`  
- Password policy: use `Twz!Test12345` for all passwords  

## Features Covered (modular; toggle via `features`)
1. **auth** — Register → Login → Logout → Login again  
2. **hashtag_generation** — Enter sample post text → generate tags → basic validations  
3. **pricing_visibility** — Pricing page loads, plan cards visible, CTA buttons present  
4. **subscription_ui** — verify upgrade flows through payment wall. Validate upgrade flows up to the payment wall using Lemon Squeezy test cards (see https://docs.lemonsqueezy.com/help/getting-started/test-mode#checkout-testing).
5. **settings** — Change a user preference, confirm persistence after reload, confirm saved preferences load on generate page.
6. **navigation** — Header/footer links work, 404/redirects sane, news page loads news 
7. **accessibility_smoke** — Axe-core smoke (no blocking; record issues in report)

> If a feature doesn’t exist in test yet, log as **“Not Implemented (NI)”** and continue.

## Artifacts

- **Screenshots:** `./artifacts/screenshots/<feature>/<step>.png`  
- **Playwright trace:** `./artifacts/traces/` (for failures)  
- **Logs:** `./artifacts/logs/`  
- **Report:** `./artifacts/report/report.md` and `report.html`

## High-Level Steps (Claude, do these automatically)

1. **Bootstrap a Playwright project**
   - Create a new workspace folder `tagwiz-e2e/`.
   - Initialize Node project and install deps:  
     - `playwright` (with `@playwright/test`)  
     - `axe-core/playwright` (a11y smoke)  
     - `zod` (config validation)  
     - `fs-extra`, `uuid` (helpers)
   - Run `npx playwright install --with-deps` (Linux/Mac) to ensure browsers.
   - Create `playwright.config.ts` with:
     - `use: { headless: true, screenshot: "on", trace: "retain-on-failure", viewport: { width: 1366, height: 900 } }`
     - `reporter: [["list"], ["html", { outputFolder: "artifacts/report/html" }]]`
     - Projects for chromium (default). (Optionally add webkit/firefox later.)
     - Global timeout sensible (e.g., 45s/test), retries: 1–2.
   - Create `.env.local` with `BASE_URL=<env>` from command, validated by Zod.

2. **Helpers**
   - `lib/users.ts` to generate unique emails + strong password.
   - `lib/flows.ts` common steps: goHome, register, login, logout, fillTextArea, waitForToast, etc.
   - `lib/screenshot.ts` utility to snapshot and store with deterministic names.
   - `lib/eval.ts` naive visual checks (DOM presence assertions) + attach screenshots; record findings.

3. **Specs** (create modular files under `tests/`)
   - `auth.spec.ts`
   - `profile_setup.spec.ts`
   - `hashtag_generation.spec.ts`
   - `collections.spec.ts`
   - `pricing_visibility.spec.ts`
   - `subscription_ui.spec.ts`
   - `settings.spec.ts`
   - `navigation.spec.ts`
   - `accessibility_smoke.spec.ts`

   Each spec:
   - **Registers a fresh user** if needed for isolation.
   - Uses `test.step()` blocks with **screenshot after each major step**.
   - **Asserts key UI elements** (cards, buttons, labels, outputs).
   - Writes human-readable notes to a run log.

4. **Run**
   - Accept `scope`, `features`, `parallel`, `seed` params from the slash command, convert to Playwright CLI args/projects grep.
   - `npx playwright test --workers=<parallel> --grep <features|all>`

5. **Evaluation (after tests)**
   - Load all screenshots and **have Claude review** them against an **Expected UI checklist** (below).
   - Produce `report.md` with:
     - Run metadata (env, seed, parallel, git sha if available).
     - Per-feature results, inline thumbnails, human notes, and blocking issues.
     - A short **Pass/Fail summary** and **Recommended fixes**.

6. **Output**
   - Return a compact summary to the chat and attach `artifacts/report/report.md` plus a zip of `artifacts/screenshots/`.

## Expected UI Checklists (used for screenshot evaluation)

### auth
- Registration page has: Email, Password, (Confirm if present), Submit/Continue.
- After registration: redirect to app dashboard or onboarding — no fatal toast/errors.
- Logout leads to login page; login returns to dashboard.

### hashtag_generation
- Text input area for post content visible.
- Generate button present and enabled after input.
- Results area shows **non-empty** hashtag list; duplicates not present; copy/save actions visible.

### pricing_visibility / subscription_ui
- Pricing page shows **Free/Plus/Premium** (or current plans) with price and CTA buttons.
- Attempted upgrade flow shows paywall or plan selection modal without error loops.

### navigation
- Header links route to correct pages; active state updates.
- 404 page shows a friendly message when visiting `/does-not-exist`.

### preferences
- Preferences page loads
- Preferences are disabled for free plan subscribers
- Preferences are enabled for plus and premium plan subscribers.
- When preferences are changed and saved, the new values shows on a fresh generate page.
- After logout and log back in, preferences reflect last change. 

### accessibility_smoke
- Axe scan yields **no serious/critical** issues on main pages; list any found.

## Sample Spec Skeletons

```ts
// tests/auth.spec.ts
import { test, expect } from "@playwright/test";
import { createTestUser, register, login, logout, snap } from "../lib/flows";

test.describe("Auth", () => {
  test("register → logout → login", async ({ page }) => {
    const user = createTestUser();
    await page.goto(process.env.BASE_URL!);
    await test.step("Register", async () => {
      await register(page, user);
      await snap(page, "auth/register-complete");
      await expect(page).toHaveURL(/dashboard|onboarding/);
    });
    await test.step("Logout", async () => {
      await logout(page);
      await snap(page, "auth/logged-out");
      await expect(page).toHaveURL(/login/);
    });
    await test.step("Login", async () => {
      await login(page, user);
      await snap(page, "auth/login-complete");
      await expect(page).toHaveURL(/dashboard/);
    });
  });
});
```

```ts
// tests/hashtag_generation.spec.ts
import { test, expect } from "@playwright/test";
import { createTestUser, register, snap } from "../lib/flows";

test("Generate hashtags from sample post", async ({ page }) => {
  const user = createTestUser();
  await page.goto(process.env.BASE_URL!);
  await register(page, user);

  await test.step("Open generator", async () => {
    await page.getByRole("link", { name: /generate/i }).click();
    await page.waitForLoadState("networkidle");
    await snap(page, "gen/open");
  });

  await test.step("Input and generate", async () => {
    await page.getByLabel(/post|caption|content/i).fill(
      "Launching our new TagWiz feature! Generate smart hashtags automatically."
    );
    await snap(page, "gen/filled");
    await page.getByRole("button", { name: /generate/i }).click();
    await page.getByTestId("hashtags-list").waitFor({ state: "visible" });
    await snap(page, "gen/results");
    const tags = await page.locator('[data-testid="hashtag-item"]').allTextContents();
    expect(tags.length).toBeGreaterThan(0);
  });
});
```

## Screenshot & Trace Conventions

- File names: `<feature>/<step>.png`  
- Take a screenshot at the **end of each `test.step`** and on **failure**.  
- Keep **Playwright trace** for failed tests.

## Non-Destructive Policy

- Do not delete or mutate production-like data outside the test user’s scope.  
- Only operate on **freshly created** test users and data.

## Output Requirements

- Zip `./artifacts/screenshots` as `screenshots.zip`  
- Save `./artifacts/report/report.md` (summary + inline image refs)  
- Provide a short chat summary with:
  - ✅ Passed features, ❌ Failed with reason, ⚠️ Not Implemented
  - Links/paths to artifacts
  - Next-step fixes (3–7 bullets)

## Notes / Assumptions

- Test env: **`https://test-b1.tagwiz.app/`**  
- Registration **does not require inbox verification**. If it does, log as **Blocked** and propose a mock/override path or magic link handler for test.  
- Payment flows are **UI-only** validation to the paywall boundary.
