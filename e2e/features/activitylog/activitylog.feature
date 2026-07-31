Feature: Task activity log
  As a signed-in user
  I want a log of what happened on a task
  So that I can see who did what and when

  # "Activity target" (Activity Lab, an early single-task project) is dedicated
  # to this area; completing it generates a "completed" event. Its tiny board
  # loads fast + its GSI is warm early in the seed, avoiding the board-read lag a
  # late/large project hits under peak CI load.
  Scenario: Completing a task records an activity event
    Given a signed-in user
    And the user opens the "Activity Lab" project
    When the user opens the task titled "Activity target"
    And the user marks the task done from its detail
    Then the activity feed shows a "completed" event
