Feature: Duplicate a task
  As a signed-in user
  I want to duplicate a task
  So that I can reuse a task's setup without recreating it

  # "Clone me" is a dedicated target only this area copies. The duplicate is
  # titled "Clone me (copy)", lands on the same board, and carries the source's
  # subtasks across (Asana copies subtasks). One scenario (not two parallel ones)
  # so the "(copy)" it creates can't make a sibling's "Clone me" match ambiguous.
  Scenario: Duplicating a task copies it (with subtasks) onto the board
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Clone me"
    And the user duplicates the task
    And the user reopens the "Product Launch" project
    Then a task titled "Clone me (copy)" is visible on the board
    When the user opens the task titled "Clone me (copy)"
    Then a subtask titled "Clone step one" is visible
