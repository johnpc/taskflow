Feature: Project board
  As a signed-in user
  I want to see my project's tasks in columns and work through them
  So that I can track progress at a glance

  # Honest e2e: assert on the REAL seeded task in a real column, and prove
  # completing it changes the rendered state.

  Scenario: The board shows seeded columns and a seeded task
    Given a signed-in user
    And the user opens the "Product Launch" project
    Then a board column named "To do" is visible
    And a task titled "Draft launch announcement" is visible on the board

  Scenario: Adding a task shows it on the board
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user adds a task titled "Book venue 7c2b" to the "To do" column
    Then a task titled "Book venue 7c2b" is visible on the board

  Scenario: Completing a task marks it done
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user completes the task titled "Draft launch announcement"
    Then the task titled "Draft launch announcement" is shown as done
