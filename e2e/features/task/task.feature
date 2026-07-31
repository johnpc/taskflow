Feature: Task detail
  As a signed-in user
  I want to open a task and manage its details
  So that I can capture everything about a piece of work in one place

  # Honest e2e: open a REAL seeded task, then prove a subtask + comment persist by
  # asserting on the rendered result after the write round-trips.

  Scenario: Opening a task shows its detail
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Draft launch announcement"
    Then the task detail title is "Draft launch announcement"
    And the task shows the project breadcrumb "Product Launch"
    And the task detail due date is flagged overdue

  Scenario: Adding a subtask persists
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Draft launch announcement"
    And the user adds a subtask titled "Write headline 4d9e"
    Then a subtask titled "Write headline 4d9e" is visible

  Scenario: Posting a comment persists
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Draft launch announcement"
    And the user posts the comment "Looks good to me 2a7c"
    Then a comment reading "Looks good to me 2a7c" is visible
