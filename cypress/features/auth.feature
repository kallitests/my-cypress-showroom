Feature: Authentication
  As a registered user
  I want to sign in and sign out of the application
  So that I can securely access my financial data

  Scenario: Successful sign-in with valid credentials
    Given I am on the sign-in page
    When I enter a valid username and password
    And I submit the sign-in form
    Then I am redirected to the transaction feed
    And my username is visible in the side navigation

  Scenario: Sign-in rejected with an invalid password
    Given I am on the sign-in page
    When I enter a valid username and an incorrect password
    And I submit the sign-in form
    Then an error message "Username or password is invalid" is displayed
    And I remain on the sign-in page

  Scenario: Sign-out from an active session
    Given I am signed in
    When I click "Sign Out"
    Then I am redirected to the sign-in page
