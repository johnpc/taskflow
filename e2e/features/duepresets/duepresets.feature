Feature: Due-date presets
  As a signed-in user
  I want one-tap Today / Tomorrow / Next week buttons
  So that setting a due date is fast

  # Honest e2e: open a seeded task with no due date and set it via a preset,
  # asserting the date input becomes populated. "Finalize press list" has no due.

  Scenario: Setting a due date from a preset
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Finalize press list"
    And the user picks the "tomorrow" due preset
    Then the task has a due date set
