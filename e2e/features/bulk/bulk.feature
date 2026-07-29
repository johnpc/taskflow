Feature: Multi-select bulk actions
  As a signed-in user
  I want to select several tasks and act on them at once
  So that I can triage quickly (Asana multi-select)

  # Honest e2e: in list view, select two dedicated seeded tasks and bulk-complete
  # them; they leave the board (hide-completed default). "Bulk one/two" are
  # touched by no other area.

  Scenario: Bulk-completing selected tasks removes them
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user switches to the list view
    And the user selects the tasks "Bulk one" and "Bulk two"
    And the user bulk-completes the selection
    Then a task titled "Bulk one" is not visible
    And a task titled "Bulk two" is not visible
