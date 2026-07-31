Feature: Task cover image
  As a signed-in user
  I want to add a cover image to a task
  So that important tasks stand out visually on the board

  # "Cover target" (Cover Lab) is dedicated to this area; uploading a cover here
  # can't disturb a parallel run.
  Scenario: Adding a cover image to a task
    Given a signed-in user
    And the user opens the "Cover Lab" project
    When the user opens the task titled "Cover target"
    And the user uploads a task cover image
    Then the task cover preview is shown
