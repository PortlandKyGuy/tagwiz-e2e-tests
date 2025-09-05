IMPORTANT: Critical Insights and Instructions related to the contents of this folder MUST be documented below.
Ensure your information or instruction is accurate, you must never poison context here or elsewhere.  No Hallucinations or Invention.
If you discover and confirm poisoned context you must remove it from here so it does not mislead other agents.
Language must be folder-specific, unambiguous, and kept current by agents.
The instructions and knowledge below are not mandates, threat them as guidence only.
---

## lib/ Directory - Test Utilities and Helpers

This directory contains reusable utility functions and helpers for the Playwright E2E test suite.

### Key Files:

- **flows.js** - Authentication and navigation flows (register, login, logout, goHome)
- **screenshot.js** - Screenshot capture utility for visual regression testing
- **users.js** - Test user generation and management utilities

### Design Patterns:

1. **Error Resilience**: Functions use flexible selectors to handle UI variations
2. **Screenshot Integration**: Flows automatically capture screenshots at key points
3. **Reusability**: All utilities are exported as ES modules for use across test files

### Best Practices:

- Use flexible selectors (regex patterns, multiple fallbacks) to handle UI changes
- Always wait for appropriate load states before proceeding
- Capture screenshots at critical flow points for debugging
- Keep utilities focused and single-purpose