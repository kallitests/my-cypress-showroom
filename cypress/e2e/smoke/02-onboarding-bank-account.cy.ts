// 02-onboarding-bank-account.cy.ts
// Covers: bank-account.feature
// Smoke coverage for adding a bank account right after account creation.

import { selectors } from '../../support/selectors';
import users from '../../fixtures/users.json';
import transactions from '../../fixtures/transactions.json';

describe('Smoke: Bank account onboarding', () => {
  beforeEach(() => {
    cy.task('db:seed'); // Reset the local lowdb database before each test
    cy.loginByApi(users.validUser.username, users.validUser.password); // Start from an authenticated session
  });

  it('adds a valid bank account', () => {
    cy.visit('/bankaccounts'); // Navigate to the bank accounts page
    cy.get(selectors.onboarding.bankNameInput).type(transactions.bankAccount.bankName); // Fill in a valid bank name
    cy.get(selectors.onboarding.routingNumberInput).type(transactions.bankAccount.routingNumber); // Fill in a valid routing number
    cy.get(selectors.onboarding.accountNumberInput).type(transactions.bankAccount.accountNumber); // Fill in a valid account number
    cy.get(selectors.onboarding.submitButton).click(); // Submit the bank account form
    cy.get(selectors.onboarding.accountList).should('contain', transactions.bankAccount.bankName); // Assert the new account is listed
  });
});
