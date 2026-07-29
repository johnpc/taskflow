Feature: Completed tasks view
  As a signed-in user
  I want a per-project list of what I've finished, with the option to reopen
  So that done work is out of the way but still recoverable

  # Honest e2e: complete a dedicated seeded task, open the Completed view, and see
  # it there. "Archive Q1 notes" is completed by no other area.

  Scenario: A completed task appears in the completed view
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user completes the task titled "Archive Q1 notes"
    And the user opens the completed view
    Then a completed task "Archive Q1 notes" is visible
