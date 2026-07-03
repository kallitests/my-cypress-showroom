// 09-transaction-cy-prompt.cy.ts
// A second cy.prompt demo, on a more complex multi-step flow (contact
// search + form fill), still paired with classic deterministic assertions.

import { selectors } from '../../support/selectors';
import users from '../../fixtures/users.json';

describe('AI-driven: Transaction creation via cy.prompt', () => {
  beforeEach(() => {
    cy.task('db:seed'); // Reset the local lowdb database before each test
    cy.loginByApi(users.validUser.username, users.validUser.password); // Start from an authenticated session
  });

  it('creates a payment request using natural-language steps', () => {
    cy.prompt([
      'Open the new transaction form',
      `Search for the contact "${users.secondaryUser.username}" and select the first match`,
      'Fill in an amount of 25 and a description of "Lunch"',
      'Submit the transaction as a request, not a payment',
    ]);

    cy.get(selectors.transaction.feedTabMine).click(); // Deterministic action: switch to "Mine" feed
    cy.get(selectors.transaction.feedItem).first().should('contain', 'Lunch'); // Deterministic assertion: transaction is listed
  });
});
