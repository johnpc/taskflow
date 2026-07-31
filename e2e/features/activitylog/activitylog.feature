Feature: Task activity log
  As a signed-in user
  I want a log of what happened on a task
  So that I can see who did what and when

  # Create the task LIVE via My Tasks quick-add (not a seeded anchor) so this
  # doesn't depend on a fresh seed row's GSI having propagated to the board on
  # the shared backend. Completing it records a "completed" activity event.
  Scenario: Completing a task records an activity event
    Given a signed-in user
    When the user opens My Tasks
    And the user quick-adds "Activity capture 3b7e" to the "Product Launch" project
    And the user opens the quick-added task "Activity capture 3b7e"
    And the user marks the task done from its detail
    Then the activity feed shows a "completed" event
