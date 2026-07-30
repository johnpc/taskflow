Feature: Board filter and sort
  As a signed-in user
  I want to hide completed tasks and filter/sort the board
  So that I can focus on what's left and see it in the order I want

  # Honest e2e: complete a real seeded task (it disappears when done are hidden),
  # then reveal it with the show-completed toggle.

  Scenario: Completed tasks are hidden by default and can be revealed
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user completes the task titled "Ship changelog"
    Then a task titled "Ship changelog" is not visible
    When the user shows completed tasks
    Then a task titled "Ship changelog" is visible on the board

  # Filter by priority: "Draft launch announcement" is HIGH and "Design hero
  # banner" is MEDIUM, so filtering to High keeps the former and drops the latter.
  Scenario: Filtering the board by priority
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user filters the board to "HIGH" priority
    Then a task titled "Draft launch announcement" is visible on the board
    And a task titled "Design hero banner" is not visible

  # Filter by assignee (shared project only): "Team Board" has the seed user +
  # teammate@example.com; "Teammate task" is assigned to the teammate and
  # "Owner task" to the seed user, so filtering to the teammate drops "Owner task".
  Scenario: Filtering a shared board by assignee
    Given a signed-in user
    And the user opens the "Team Board" project
    When the user filters the board to the assignee "teammate@example.com"
    Then a task titled "Teammate task" is visible on the board
    And a task titled "Owner task" is not visible
