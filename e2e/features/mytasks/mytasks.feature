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

  # "My assigned task" is the only task assigned to the seed user, so the
  # "Assigned to me" filter narrows to it and hides "Renew passport".
  Scenario: My Tasks can filter to tasks assigned to me
    Given a signed-in user
    When the user opens My Tasks
    And the user filters My Tasks to assigned-to-me
    Then a task titled "My assigned task" is visible in My Tasks
    And a task titled "Renew passport" is not visible

  # "Followed report" is followed (not assigned) by the seed user, so the
  # "Following" filter surfaces it and hides "Renew passport" (unfollowed).
  Scenario: My Tasks can filter to followed tasks
    Given a signed-in user
    When the user opens My Tasks
    And the user filters My Tasks to following
    Then a task titled "Followed report" is visible in My Tasks
    And a task titled "Renew passport" is not visible

  # Quick-add captures a task into a chosen project without opening it; the new
  # open task then appears in My Tasks. Uses a unique title + dedicated project.
  Scenario: Quick-adding a task from My Tasks
    Given a signed-in user
    When the user opens My Tasks
    And the user quick-adds "Quick capture 9f2a" to the "Quick Add Lab" project
    Then a task titled "Quick capture 9f2a" is visible in My Tasks
