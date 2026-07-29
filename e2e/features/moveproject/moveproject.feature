Feature: Move a task to another project
  As a signed-in user
  I want to move a task into a different project
  So that I can reorganize work across projects, not just sections

  # "Movable task" starts in "Move From" and is moved into "Move To" — a
  # dedicated source + target only this scenario touches.
  Scenario: Moving a task relocates it to the chosen project board
    Given a signed-in user
    And the user opens the "Move From" project
    When the user opens the task titled "Movable task"
    And the user moves the task to the "Move To" project
    And the user reopens the "Move To" project
    Then a task titled "Movable task" is visible on the board
