Feature: My Tasks show completed
  As a signed-in user
  I want to reveal completed tasks in My Tasks
  So that I can review what I've finished, not just what's left

  # "Progress done" is a seeded already-completed task; it's hidden from My Tasks
  # until "Show completed" is on, then it appears in the Completed bucket.
  Scenario: Toggling show-completed reveals a Completed bucket
    Given a signed-in user
    When the user opens My Tasks
    And the user shows completed in My Tasks
    Then the "Completed" bucket contains "Progress done"
