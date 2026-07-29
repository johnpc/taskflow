Feature: Due time on tasks
  As a signed-in user
  I want to set a time on a task's due date
  So that I know not just the day but when it's due

  # "Timed review" is seeded with a due date (so the time input is enabled) and
  # no other area touches it, so setting its time can't disturb a parallel run.
  Scenario: Setting a due time shows it on the task
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Timed review"
    And the user sets the due time to "09:30"
    Then the task due time is "09:30"
    When the user opens the "Product Launch" project
    Then the "Timed review" card due chip shows "9:30 AM"
