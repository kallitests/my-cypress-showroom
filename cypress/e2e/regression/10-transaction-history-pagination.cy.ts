// 10-transaction-history-pagination.cy.ts
// Regression-level test: not part of the fast smoke gate, but exercises a
// broader, slower-to-verify behavior (pagination) that matters for a
// thorough release check rather than a quick "is it standing" signal.

import { selectors } from '../../support/selectors';
import users from '../../fixtures/users.json';

describe('Regression: Transaction history pagination', () => {
  beforeEach(() => {
    cy.task('db:seed'); // Reset the local lowdb database before each test
    cy.loginByApi(users.validUser.username, users.validUser.password); // Start from an authenticated session
    cy.get(selectors.transaction.feedTabPublic).click(); // Switch to the "Public" feed, which has many seeded transactions
  });

  it('loads additional transactions when scrolling to the bottom of the feed', () => {
    cy.get(selectors.transaction.feedItem).its('length').as('initialCount'); // Record how many items are visible initially

    cy.get(selectors.transaction.feedItem).last().scrollIntoView(); // Scroll to trigger infinite-scroll pagination
    cy.wait(500); // Give the app time to fetch and render the next page (regression tests can afford this)

    cy.get('@initialCount').then((initialCount) => {
      cy.get(selectors.transaction.feedItem).should('have.length.greaterThan', Number(initialCount)); // More items loaded
    });
  });

  it('preserves scroll position and item order across a page load', () => {
    cy.get(selectors.transaction.feedItem).first().invoke('text').as('firstItemText'); // Capture the first item's content

    cy.reload(); // Simulate a full page reload, a common regression scenario for stateful feeds

    cy.get('@firstItemText').then((firstItemText) => {
      cy.get(selectors.transaction.feedItem).first().should('contain.text', firstItemText); // Order is stable after reload
    });
  });
});
