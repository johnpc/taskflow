Feature: Delete a comment
  As a signed-in user
  I want to delete a comment I posted
  So that I can clean up mistaken or outdated notes

  # "Comment me" is a dedicated task only this area comments on, so posting +
  # deleting here can't disturb a parallel run.
  Scenario: Deleting a comment removes it from the thread
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Comment me"
    And the user posts the comment "Delete me 8b3f"
    Then a comment reading "Delete me 8b3f" is visible
    When the user deletes the comment "Delete me 8b3f"
    Then a comment reading "Delete me 8b3f" is not visible
