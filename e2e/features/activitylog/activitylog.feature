Feature: Task activity log
  As a signed-in user
  I want a log of what happened on a task
  So that I can see who did what and when

  # "Activity target" (Product Launch — the first, always-warm project whose
  # board many areas read reliably) is dedicated to this area; completing it
  # generates a "completed" event and no other area touches it. The open step
  # reloads-until-present to absorb any board-read GSI lag under peak CI load.
  Scenario: Completing a task records an activity event
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the activity task "Activity target"
    And the user marks the task done from its detail
    Then the activity feed shows a "completed" event
