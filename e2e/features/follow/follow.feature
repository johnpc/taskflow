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
