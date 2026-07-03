Feature: Notifications
  As a signed-in user
  I want to be notified when a transaction concerns me
  So that I stay informed of relevant activity

  Scenario: Notification after receiving a payment request
    Given I am signed in
    When another user sends me a payment request
    Then an unread notification badge appears in the navigation bar
