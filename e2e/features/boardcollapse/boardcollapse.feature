Feature: Collapse a board column
  As a signed-in user
  I want to collapse a board column
  So that I can focus on the columns that matter right now

  # Collapse state is per-browser (localStorage), so this mutates nothing on the
  # shared backend — safe on a stable seeded project.
  Scenario: Collapsing a column hides its cards
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user collapses the "To do" board column
    Then a task titled "Finalize press list" is not visible
