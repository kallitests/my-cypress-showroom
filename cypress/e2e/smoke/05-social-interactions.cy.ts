// 05-social-interactions.cy.ts
// Covers: social.feature
// Smoke coverage for liking and commenting on a public transaction.

import { selectors } from '../../support/selectors';
import users from '../../fixtures/users.json';

describe('Smoke: Social interactions', () => {
  beforeEach(() => {
    cy.task('db:seed'); // Reset the local lowdb database before each test
    cy.loginByApi(users.validUser.username, users.validUser.password); // Start from an authenticated session
    cy.get(selectors.transaction.feedTabPublic).click(); // Switch to the "Public" feed
  });

  it('increments the like counter on a public transaction', () => {
    cy.get(selectors.social.likeCount).first().invoke('text').then((initialCount) => {
      cy.get(selectors.social.likeButton).first().click(); // Like the first transaction of the feed
      cy.get(selectors.social.likeCount).first().should(($el) => {
        expect(Number($el.text())).to.equal(Number(initialCount) + 1); // Assert the counter increased by exactly 1
      });
    });
  });

  it('adds a comment that appears immediately below the transaction', () => {
    const commentText = 'Looks good, thanks!'; // Comment content used for this smoke check
    cy.get(selectors.transaction.feedItem).first().click(); // Open the first transaction's detail view
    cy.get(selectors.social.commentInput).type(commentText); // Type the comment
    cy.get(selectors.social.commentSubmit).click(); // Submit the comment
    cy.get(selectors.social.commentItem).first().should('contain', commentText); // Assert the comment is now visible
  });
});
