Feature: List view
  As a signed-in user
  I want to work through a project as a list, not just a board
  So that I can scan and grind through tasks top to bottom (Asana-style)

  # Honest e2e: switch a real seeded project to List view and assert the seeded
  # task renders inside its seeded section as a list row.

  Scenario: Switching a project to the list view
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user switches to the list view
    Then a list section named "To do" is visible
    And a task titled "Draft launch announcement" is visible on the board

  Scenario: Collapsing a list section hides its tasks
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user switches to the list view
    And the user collapses the "To do" list section
    Then a task titled "Draft launch announcement" is not visible
