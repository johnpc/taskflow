Feature: Delete a task
  As a signed-in user
  I want to delete a task I no longer need
  So that my board stays clean

  # Honest e2e: open a dedicated seeded task (no other area touches it), delete
  # it, and confirm it's gone from the board.

  Scenario: Deleting a task removes it from the board
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Retire old logo"
    And the user deletes the task
    Then a task titled "Retire old logo" is not visible
