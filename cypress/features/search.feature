Feature: Transaction search
  As a signed-in user
  I want to search transactions by contact name
  So that I can quickly find a past transaction

  Scenario: Searching with a term matching an existing transaction
    Given I am signed in and a transaction with "Devon Becker" exists
    When I type "Devon" into the search bar
    Then the results list contains only transactions related to "Devon Becker"
