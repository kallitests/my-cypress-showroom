// 06-notifications.cy.ts
// Covers: notifications.feature
// Smoke coverage for the unread notification badge after a relevant event.

import { selectors } from '../../support/selectors';
import users from '../../fixtures/users.json';

describe('Smoke: Notifications', () => {
  beforeEach(() => {
    cy.task('db:seed'); // Reset the local lowdb database before each test
  });

  it('shows an unread badge after receiving a payment request', () => {
    // Simulate another user sending a payment request via the API, faster and more reliable than a second UI session.
    cy.loginByApi(users.secondaryUser.username, users.secondaryUser.password); // Sign in as the sender
    cy.request('POST', `${Cypress.env('apiUrl')}/transactions`, {
      receiverId: users.validUser.username, // Target the main test user
      amount: 15,
      description: 'Notification smoke check',
      status: 'pending',
    });

    cy.loginByApi(users.validUser.username, users.validUser.password); // Switch back to the receiving user
    cy.get(selectors.notifications.unreadBadge).should('be.visible'); // Assert the unread badge is now shown
  });
});
