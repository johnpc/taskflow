Feature: My Tasks
  As a signed-in user
  I want one view of everything I have to do across projects, grouped by due date
  So that I know what to work on next

  # Assert on "Renew passport" (Personal project, overdue) — a task no other
  # scenario completes, so it stays open regardless of test order on the shared
  # seeded backend.
  Scenario: My Tasks groups open tasks by due date
    Given a signed-in user
    When the user opens My Tasks
    Then a due bucket "Overdue" is visible
    And a task titled "Renew passport" is visible in My Tasks

  # "Renew passport" is seeded HIGH priority, so switching the grouping surfaces
  # it under a "High priority" bucket instead of a due bucket.
  Scenario: My Tasks can group by priority
    Given a signed-in user
    When the user opens My Tasks
    And the user groups My Tasks by priority
    Then a due bucket "High priority" is visible
    And a task titled "Renew passport" is visible in My Tasks
