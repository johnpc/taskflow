Feature: Board filter and sort
  As a signed-in user
  I want to hide completed tasks and filter/sort the board
  So that I can focus on what's left and see it in the order I want

  # Honest e2e: complete a real seeded task (it disappears when done are hidden),
  # then reveal it with the show-completed toggle.

  Scenario: Completed tasks are hidden by default and can be revealed
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user completes the task titled "Design hero banner"
    Then a task titled "Design hero banner" is not visible
    When the user shows completed tasks
    Then a task titled "Design hero banner" is visible on the board
