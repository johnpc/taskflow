Feature: Follow a task
  As a signed-in user
  I want to follow a task
  So that I can keep track of work I care about (Asana followers)

  # "Follow me" is a dedicated task only this area follows. Follow then unfollow
  # so the shared sandbox is left clean (idempotent across CI retries).
  Scenario: Following and unfollowing a task
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Follow me"
    And the user follows the task
    Then the task shows as followed
    When the user follows the task
    Then the task shows as not followed

  # Commenting on a task auto-follows it (Asana). "Auto follow me" is a dedicated
  # anchor; posting a comment makes the author a follower.
  Scenario: Commenting on a task follows it
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Auto follow me"
    And the user posts the comment "Following via comment 8x2z"
    Then the task shows as followed
