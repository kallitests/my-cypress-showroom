// commands.ts
// Custom Cypress commands shared across the whole smoke suite.
// Each command wraps a repetitive user flow so specs stay short and readable.

import { selectors } from './selectors';

declare global {
  namespace Cypress {
    interface Chainable {
      /** Logs in through the UI using the given username and password. */
      loginByUI(username: string, password: string): Chainable<void>;
      /** Logs in by calling the backend API directly, bypassing the UI (faster setup). */
      loginByApi(username: string, password: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('loginByUI', (username: string, password: string) => {
  cy.visit('/signin'); // Go to the sign-in page
  cy.get(selectors.auth.usernameInput).type(username); // Type the given username
  cy.get(selectors.auth.passwordInput).type(password); // Type the given password
  cy.get(selectors.auth.submitButton).click(); // Submit the sign-in form
});

Cypress.Commands.add('loginByApi', (username: string, password: string) => {
  cy.request('POST', `${Cypress.env('apiUrl')}/login`, { username, password }) // Call the auth endpoint directly
    .then((response) => {
      window.localStorage.setItem('authState', JSON.stringify(response.body.user)); // Persist the session like the app would
    });
  cy.visit('/'); // Land on the home feed with an already authenticated session
});

export {};
