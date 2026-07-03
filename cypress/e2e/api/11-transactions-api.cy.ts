// 11-transactions-api.cy.ts
// Pure API-level tests: no browser UI is exercised, only HTTP requests via
// cy.request against the backend. Faster and more stable than UI tests —
// a good early signal in the pipeline (see cypress-api service in docker-compose.yml).

import users from '../../fixtures/users.json';

describe('API: Authentication and transactions', () => {
  let authCookie: string; // Stores the session cookie returned by a successful login

  before(() => {
    cy.task('db:seed'); // Reset the local lowdb database before this suite runs
  });

  it('POST /login returns a 200 and a valid user payload for correct credentials', () => {
    cy.request('POST', `${Cypress.env('apiUrl')}/login`, {
      username: users.validUser.username,
      password: users.validUser.password,
    }).then((response) => {
      expect(response.status).to.equal(200); // Login must succeed with valid credentials
      expect(response.body.user).to.have.property('username', users.validUser.username); // Correct user is returned
      authCookie = response.headers['set-cookie'] as unknown as string; // Save the session cookie for subsequent calls
    });
  });

  it('POST /login returns a 401 for incorrect credentials', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/login`,
      body: { username: users.invalidUser.username, password: users.invalidUser.password },
      failOnStatusCode: false, // We expect a non-2xx response here, so don't let Cypress fail automatically
    }).then((response) => {
      expect(response.status).to.equal(401); // Invalid credentials must be rejected
    });
  });

  it('GET /transactions returns a paginated list for an authenticated user', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/transactions/public`,
      headers: { Cookie: authCookie }, // Reuse the session cookie captured in the first test
    }).then((response) => {
      expect(response.status).to.equal(200); // Endpoint responds successfully
      expect(response.body.results).to.be.an('array'); // Results are returned as a list
      expect(response.body).to.have.property('pageData'); // Pagination metadata is present
    });
  });

  it('GET /transactions rejects an unauthenticated request', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/transactions/public`,
      failOnStatusCode: false, // We expect a 401 here, not a thrown error
    }).then((response) => {
      expect(response.status).to.equal(401); // No session cookie means no access
    });
  });
});
