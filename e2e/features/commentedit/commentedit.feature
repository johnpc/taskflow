Feature: Edit a comment
  As a signed-in user
  I want to edit a comment I posted
  So that I can fix a mistake without deleting and re-typing

  # "Comment me" is a dedicated task only the comment areas post on, so editing
  # a uniquely-tagged comment here can't disturb a parallel run.
  Scenario: Editing a comment updates its text
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Comment me"
    And the user posts the comment "Edit orig 5c1a"
    And the user edits the comment "Edit orig 5c1a" to "Edit done 5c1a"
    Then a comment reading "Edit done 5c1a" is visible
    And a comment reading "Edit orig 5c1a" is not visible
