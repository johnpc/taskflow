Feature: Recurring tasks
  As a signed-in user
  I want a task to repeat on a schedule
  So that routine work reappears without me re-creating it

  # "Weekly sync" is seeded WEEKLY with a due date. Completing it spawns the next
  # occurrence (a fresh open task), so an open "Weekly sync" remains on the board
  # even after the original is completed + hidden.
  Scenario: Completing a recurring task spawns the next occurrence
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user completes the task titled "Weekly sync"
    Then an open task titled "Weekly sync" is still on the board

  Scenario: A recurring task shows a repeat badge
    Given a signed-in user
    And the user opens the "Product Launch" project
    Then the board card "Daily standup" shows a repeat badge
