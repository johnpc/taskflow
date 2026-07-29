Feature: Undo a completion
  As a signed-in user
  I want to undo completing a task
  So that an accidental tap is a one-click recovery

  # Honest e2e: complete a dedicated seeded task (it hides), an undo toast shows,
  # and Undo brings it back to the board. "Undo me" is touched by no other area.

  Scenario: Undoing a completion restores the task
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user completes the task titled "Undo me"
    And the user clicks undo on the toast
    Then a task titled "Undo me" is visible on the board
