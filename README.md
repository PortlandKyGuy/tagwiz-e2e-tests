# TagWiz E2E Tests (Playwright - JavaScript)

Standalone Playwright suite for TagWiz running against a deployed environment.

## Quick Start

```bash
npm install
npm run install:browsers
cp .env.example .env.local
# edit .env.local BASE_URL if needed
npm test
```

## Environment

- `.env.local`:
```
BASE_URL=https://test-b1.tagwiz.app/
HEADED=false
PARALLEL_WORKERS=4
```

## Artifacts
- Screenshots: `artifacts/screenshots`
- HTML report: `artifacts/report/html`
- Traces: `artifacts/traces` (on failures)
