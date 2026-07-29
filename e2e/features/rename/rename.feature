Feature: Inline card rename
  As a signed-in user
  I want to rename a task right on its card
  So that I can fix a title without opening the whole task

  # Honest e2e: double-click a dedicated seeded card, rename it, and assert the
  # new title renders on the board. "Rename me" is touched by no other area.

  Scenario: Renaming a task from its card
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user renames the card "Rename me" to "Renamed on card 9f"
    Then a task titled "Renamed on card 9f" is visible on the board
