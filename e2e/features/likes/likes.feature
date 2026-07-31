Feature: Task likes
  As a signed-in user
  I want to like a task
  So that I can show appreciation or acknowledge work (Asana hearts)

  # Honest e2e: open a dedicated seeded task, like it, and assert the heart is
  # pressed with a count of 1; unlike it and assert it resets. "Like me" is a
  # dedicated anchor no other area touches (like toggles mutate shared state).
  Scenario: Liking and unliking a task
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Like me"
    And the user likes the task
    Then the task shows 1 like
    When the user likes the task
    Then the task shows no likes
