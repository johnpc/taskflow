Feature: Board multi-select
  As a signed-in user
  I want to select several cards on the board and act on them at once
  So that I can triage on the board too, not just the list (Asana multi-select)

  # Honest e2e: on the BOARD (no list switch), select two dedicated seeded cards
  # and bulk-complete them; they leave the board (hide-completed default).
  # "Board bulk one/two" are touched by no other area.
  Scenario: Bulk-completing selected cards on the board removes them
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user selects the tasks "Board bulk one" and "Board bulk two"
    And the user bulk-completes the selection
    Then a task titled "Board bulk one" is not visible
    And a task titled "Board bulk two" is not visible
