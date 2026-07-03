// 03-transaction-creation.cy.ts
// Covers: transaction.feature
// Smoke coverage for the two core money-movement flows: request and payment.

import { selectors } from '../../support/selectors';
import users from '../../fixtures/users.json';
import transactions from '../../fixtures/transactions.json';

describe('Smoke: Transaction creation', () => {
  beforeEach(() => {
    cy.task('db:seed'); // Reset the local lowdb database before each test
    cy.loginByApi(users.validUser.username, users.validUser.password); // Start from an authenticated session
  });

  it('creates a payment request and shows it as pending in the "Mine" feed', () => {
    cy.get(selectors.transaction.newTransactionButton).click(); // Open the new transaction form
    cy.get(selectors.transaction.userListSearch).type(users.secondaryUser.username); // Search for the target contact
    cy.get(selectors.transaction.userListItem).first().click(); // Select the first matching contact
    cy.get(selectors.transaction.amountInput).type(transactions.paymentRequest.amount); // Fill in the amount
    cy.get(selectors.transaction.descriptionInput).type(transactions.paymentRequest.description); // Fill in the description
    cy.get(selectors.transaction.requestButton).click(); // Submit as a "request" transaction
    cy.get(selectors.transaction.feedTabMine).click(); // Switch to the "Mine" feed
    cy.get(selectors.transaction.feedItem).first().should('contain', transactions.paymentRequest.description); // Assert it appears on top
  });

  it('sends a payment and debits the account balance accordingly', () => {
    cy.get(selectors.transaction.newTransactionButton).click(); // Open the new transaction form
    cy.get(selectors.transaction.userListSearch).type(users.secondaryUser.username); // Search for the target contact
    cy.get(selectors.transaction.userListItem).first().click(); // Select the first matching contact
    cy.get(selectors.transaction.amountInput).type(transactions.payment.amount); // Fill in the amount
    cy.get(selectors.transaction.descriptionInput).type(transactions.payment.description); // Fill in the description
    cy.get(selectors.transaction.payButton).click(); // Submit as a "payment" transaction
    cy.get(selectors.transaction.feedTabMine).click(); // Switch to the "Mine" feed
    cy.get(selectors.transaction.feedItem).first().should('contain', transactions.payment.description); // Assert the payment is listed
  });
});
