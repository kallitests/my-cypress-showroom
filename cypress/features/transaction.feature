Feature: Transactions
  As a signed-in user
  I want to create new transactions
  So that I can exchange money with my contacts

  Scenario: Creating a payment request
    Given I am signed in and have at least one contact
    When I create a new "request" transaction to that contact
    And I fill in an amount and a description
    And I submit the transaction
    Then the transaction appears at the top of the "Mine" feed
    And its status is "pending"

  Scenario: Sending a payment
    Given I am signed in and have a sufficient account balance
    When I create a new "payment" transaction to a contact
    And I submit the transaction
    Then my account balance is debited by the corresponding amount
