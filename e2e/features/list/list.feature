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
    And a task titled "Finalize press list" is visible on the board

  Scenario: Collapsing a list section hides its tasks
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user switches to the list view
    And the user collapses the "To do" list section
    Then a task titled "Finalize press list" is not visible

  # The Asana-style list is columnar: a header row (Task/Assignee/Due/Priority)
  # and each row shows its priority in the Priority column. "Finalize press list"
  # is seeded MEDIUM.
  Scenario: The list view shows aligned columns
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user switches to the list view
    Then the list shows a column header row
    And the list row "Finalize press list" shows the priority "Medium"

  # Group by any column: switching the group-by to Priority re-buckets the rows
  # into priority groups. "Design hero banner" is seeded MEDIUM, so a
  # "Medium priority" group appears and contains it.
  Scenario: Grouping the list by priority re-buckets the rows
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user switches to the list view
    And the user groups the list by "PRIORITY"
    Then a list section named "Medium priority" is visible
    And a task titled "Design hero banner" is visible on the board
