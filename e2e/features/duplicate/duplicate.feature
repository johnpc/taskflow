Feature: Duplicate a task
  As a signed-in user
  I want to duplicate a task
  So that I can reuse a task's setup without recreating it

  # "Clone me" is a dedicated target only this area copies. The duplicate is
  # titled "Clone me (copy)" and lands on the same board.
  Scenario: Duplicating a task creates a copy on the board
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Clone me"
    And the user duplicates the task
    And the user reopens the "Product Launch" project
    Then a task titled "Clone me (copy)" is visible on the board
