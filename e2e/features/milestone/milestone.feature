Feature: Milestone tasks
  As a signed-in user
  I want to mark a task as a milestone
  So that key checkpoints stand out from regular work

  # "Launch day" is seeded as a milestone, so its card always shows the ◆ marker.
  Scenario: A milestone task shows a marker on its card
    Given a signed-in user
    And the user opens the "Product Launch" project
    Then the board card "Launch day" shows a milestone marker

  Scenario: Marking a task a milestone shows the marker
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Set up analytics"
    And the user marks the task a milestone
    Then the task detail shows it is a milestone
