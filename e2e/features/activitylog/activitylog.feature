Feature: Task activity log
  As a signed-in user
  I want a log of what happened on a task
  So that I can see who did what and when

  # "Activity target" (Product Launch, a warm project) is dedicated to this
  # area; completing it generates a "completed" event, and no other area touches
  # it. In the first project so its board GSI is warm under peak CI load.
  Scenario: Completing a task records an activity event
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Activity target"
    And the user marks the task done from its detail
    Then the activity feed shows a "completed" event
