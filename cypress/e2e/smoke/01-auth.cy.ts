// 01-auth.cy.ts
// Covers: auth.feature
// Smoke coverage for sign-in and sign-out — the very first gate of the app.

import { selectors } from '../../support/selectors';
import users from '../../fixtures/users.json';

describe('Smoke: Authentication', () => {
  beforeEach(() => {
    cy.task('db:seed'); // Reset the local lowdb database to a known state before each test
  });

  it('signs in with a valid seeded user and lands on the transaction feed', () => {
    cy.loginByUI(users.validUser.username, users.validUser.password); // Sign in through the real UI form
    cy.location('pathname').should('equal', '/'); // Assert redirect to the home/transaction feed
    cy.get(selectors.auth.sideNavUsername).should('contain', users.validUser.username); // Assert the session is authenticated
  });

  it('signs out from an active session', () => {
    cy.loginByUI(users.validUser.username, users.validUser.password); // Start from an authenticated state
    cy.get(selectors.auth.signOutButton).click(); // Click "Sign Out" in the side navigation
    cy.location('pathname').should('equal', '/signin'); // Assert redirect back to the sign-in page
  });
});
