Feature: Task activity timestamps
  As a signed-in user
  I want to see when a task was created (and completed)
  So that I have a sense of its history

  # Honest e2e: open a real seeded task and assert its "Created …" line renders
  # (every task has a createdAt from Amplify).

  Scenario: A task shows its created time
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Finalize press list"
    Then the task shows a created time
