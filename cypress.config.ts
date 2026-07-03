// cypress.config.ts
// Central Cypress configuration for the smoke suite.

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000', // Frontend URL of the app-under-test (RWA default port)
    specPattern: 'cypress/e2e/**/*.cy.ts', // Pick up both smoke/ and ai-driven/ specs
    supportFile: 'cypress/support/e2e.ts', // Global support/commands entry point
    env: {
      apiUrl: 'http://localhost:3001', // Backend API URL of the app-under-test
    },
    setupNodeEvents(on, config) {
      on('task', {
        // Reseeds the local lowdb database to a known baseline before each test.
        'db:seed'() {
          // In a real setup this would call the RWA seed script or hit a
          // dedicated test-only endpoint exposed by the backend.
          return null;
        },
      });
      return config;
    },
  },
});
