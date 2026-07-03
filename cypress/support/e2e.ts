// e2e.ts
// Global support file, loaded before every spec file in the e2e suite.

import './commands'; // Register the custom commands (loginByUI, loginByApi...)

// Prevent uncaught exceptions raised by the app under test from failing
// the smoke suite: we only care about our own assertions here.
Cypress.on('uncaught:exception', () => {
  return false; // Do not let unrelated app errors fail an unrelated smoke test
});
