Feature: Copy task link
  As a signed-in user
  I want to copy a task's link
  So that I can share a direct link to it

  # "Finalize press list" is a stable read anchor — copying its link mutates
  # nothing, so this is safe on the shared sandbox.
  Scenario: Copying a task link confirms with feedback
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Finalize press list"
    And the user copies the task link
    Then the copy-link button confirms "Copied!"
