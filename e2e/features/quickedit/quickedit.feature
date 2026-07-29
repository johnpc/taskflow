Feature: Card quick-edit
  As a signed-in user
  I want to set priority and due dates straight from a card
  So that I can triage fast without opening every task (Asana quick-edit)

  # Honest e2e: cycle a card's priority on the board and assert the priority chip
  # renders. "Finalize press list" starts at MEDIUM; one cycle → HIGH.

  Scenario: Cycling priority from a card shows the priority chip
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user cycles the priority of "Finalize press list"
    Then the task "Finalize press list" shows a priority chip
