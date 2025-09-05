IMPORTANT: Critical Insights and Instructions related to the contents of this folder MUST be documented below.
Ensure your information or instruction is accurate, you must never poison context here or elsewhere.  No Hallucinations or Invention.
If you discover and confirm poisoned context you must remove it from here so it does not mislead other agents.
Language must be folder-specific, unambiguous, and kept current by agents.
The instructions and knowledge below are not mandates, threat them as guidence only.
---

## tests/ Directory - E2E Test Specifications

This directory contains Playwright test specifications for the TagWiz application.

### Current Test Coverage:

- **auth.spec.js** - Authentication flows (registration, login, logout)
- **hashtag_generation.spec.js** - Hashtag generation functionality testing

### Test Structure Patterns:

1. **Test Organization**: Use `test.describe()` blocks for logical grouping
2. **User Creation**: Always create fresh test users via `createTestUser()` 
3. **Visual Regression**: Capture screenshots at critical UI states using `snap()`
4. **Flexible Selectors**: Use role-based and regex patterns for resilient element selection

### Testing Best Practices:

- Always wait for appropriate network/DOM states before assertions
- Use data-testid attributes as primary selectors when available
- Capture screenshots before and after critical actions
- Test both happy paths and edge cases
- Clean up test data when possible (though fresh users minimize conflicts)