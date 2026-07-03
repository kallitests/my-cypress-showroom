Feature: Bank account onboarding
  As a newly registered user
  I want to add a bank account
  So that I can send and receive money

  Scenario: Adding a valid bank account
    Given I just created my user account
    When I fill in a valid bank name, routing number and account number
    And I submit the bank account form
    Then the new bank account appears in my list of accounts
