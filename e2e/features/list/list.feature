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
  # and each row shows its priority in the Priority column. "Column check" is a
  # dedicated HIGH-priority anchor no other area mutates (parallel-safe; unlike
  # "Finalize press list", whose priority the quickedit area cycles).
  Scenario: The list view shows aligned columns
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user switches to the list view
    Then the list shows a column header row
    And the list row "Column check" shows the priority "High"
    And the "Assignee" column header lines up with its cells
    And the list row "Draft launch announcement" shows an overdue due date

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

  # Group by label: a task appears under each label it carries. "Finalize press
  # list" is seeded with the "Marketing" label, so a "Marketing" group appears
  # and contains it.
  Scenario: Grouping the list by label buckets tasks under their tags
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user switches to the list view
    And the user groups the list by "LABEL"
    Then a list section named "Marketing" is visible
    And a task titled "Finalize press list" is visible on the board

  # You can add a task no matter how the list is grouped: switch List Add Lab to
  # group-by Priority (no single section target) and the top-level composer still
  # files a new task into the project.
  Scenario: Adding a task while grouped by a non-section field
    Given a signed-in user
    And the user opens the "List Add Lab" project
    When the user switches to the list view
    And the user groups the list by "PRIORITY"
    And the user adds a task titled "Added while grouped" from the list composer
    Then a task titled "Added while grouped" is visible on the board

  # Sort by any column: clicking a column header sorts the list by it and marks
  # it active ascending; clicking again flips to descending.
  Scenario: Sorting the list by a column header
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user switches to the list view
    And the user sorts the list by "due"
    Then the list is sorted by "due" ascending
    When the user sorts the list by "due"
    Then the list is sorted by "due" descending
