// 04-transaction-search.cy.ts
// Covers: search.feature
// Smoke coverage for the global search bar, filtering transactions by contact name.

import { selectors } from '../../support/selectors';
import users from '../../fixtures/users.json';

describe('Smoke: Transaction search', () => {
  beforeEach(() => {
    cy.task('db:seed'); // Reset the local lowdb database before each test
    cy.loginByApi(users.validUser.username, users.validUser.password); // Start from an authenticated session
  });

  it('returns only transactions related to the searched contact', () => {
    cy.get(selectors.search.searchInput).type('Devon'); // Search for a term matching a seeded contact name
    cy.get(selectors.search.searchResultItem).each(($item) => {
      cy.wrap($item).should('contain.text', 'Devon Becker'); // Every visible result must relate to the searched contact
    });
  });
});
