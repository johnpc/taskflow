Feature: Task start date
  As a signed-in user
  I want to give a task a start date
  So that I know when to begin it, not just when it's due

  # "Prep offsite" is seeded to start in 5 days, so its card always shows the
  # "Starts …" chip instead of a due chip until the start date arrives.
  Scenario: A not-yet-started task shows a Starts chip on the board
    Given a signed-in user
    And the user opens the "Product Launch" project
    Then the board card "Prep offsite" shows a starts chip

  Scenario: Setting a start date persists on the task
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Finalize press list"
    And the user sets the start date to "2999-01-01"
    Then the task start date is "2999-01-01"
