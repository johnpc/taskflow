Feature: Subtask progress on cards
  As a signed-in user
  I want to see a task's subtask completion on its card
  So that I can gauge progress without opening the task

  # "Chip parent" is a dedicated read-only task with two open subtasks (no other
  # area mutates it), so its board card always shows a "0/2" subtask chip.
  Scenario: A task with subtasks shows a progress chip on the board
    Given a signed-in user
    And the user opens the "Product Launch" project
    Then the board card "Chip parent" shows subtask progress "0/2"

  # Completing a task with open subtasks asks for confirmation first (Asana
  # parity). Non-mutating: assert the confirm, then cancel — "Chip parent" stays
  # open, so its "0/2" chip is unaffected for the scenario above.
  Scenario: Completing a task with open subtasks asks for confirmation
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Chip parent"
    And the user tries to complete the task with open subtasks
    Then a subtask-complete confirmation appears
