// 08-signup-cy-prompt.cy.ts
// Demonstrates cy.prompt: natural-language actions, deterministic assertions.
// AI is used ONLY to drive UI actions here — every assertion below remains
// plain, explicit Cypress. This keeps the suite reliable and debuggable
// while still showcasing AI-assisted authoring for fast-changing UIs.

describe('AI-driven: Signup via cy.prompt', () => {
  it('creates a new account using natural-language steps', () => {
    cy.visit('/signup'); // Standard Cypress navigation, no AI involved here

    // The following steps are delegated to Cypress AI: it locates and
    // interacts with the right fields even if data-test attributes change.
    cy.prompt([
      'Fill the sign-up form with a realistic first name, last name, username and a secure password',
      'Submit the sign-up form',
    ]);

    cy.location('pathname').should('equal', '/'); // Deterministic assertion: confirm redirect to the home feed
  });
});
