Feature: Task activity log
  As a signed-in user
  I want a log of what happened on a task
  So that I can see who did what and when

  # "Activity target" (Activity Lab) is dedicated to this area; completing it
  # generates a "completed" event without disturbing other areas.
  Scenario: Completing a task records an activity event
    Given a signed-in user
    And the user opens the "Activity Lab" project
    When the user opens the task titled "Activity target"
    And the user marks the task done from its detail
    Then the activity feed shows a "completed" event
