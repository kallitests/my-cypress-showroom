// 07-negative-auth.cy.ts
// Covers: auth.feature (negative scenario)
// Smoke coverage for the "wrong password" rejection path — a critical guardrail.

import { selectors } from '../../support/selectors';
import users from '../../fixtures/users.json';

describe('Smoke: Negative authentication', () => {
  beforeEach(() => {
    cy.task('db:seed'); // Reset the local lowdb database before each test
  });

  it('rejects sign-in with an invalid password and stays on the sign-in page', () => {
    cy.loginByUI(users.invalidUser.username, users.invalidUser.password); // Attempt sign-in with a wrong password
    cy.get(selectors.auth.errorMessage).should('contain', 'Username or password is invalid'); // Assert the error banner is shown
    cy.location('pathname').should('equal', '/signin'); // Assert the user stays on the sign-in page
  });
});
