Feature: Social interactions
  As a signed-in user
  I want to like and comment on a public transaction
  So that I can interact with my contacts' activity

  Scenario: Liking a public transaction
    Given I am viewing the "Public" feed
    When I click the "like" icon on a transaction
    Then the like counter for that transaction increases by 1

  Scenario: Adding a comment
    Given I am viewing the "Public" feed
    When I add a comment to a transaction
    Then the comment appears immediately below that transaction
