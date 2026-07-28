Feature: Reorder tasks in a section
  As a signed-in user
  I want to move a task up or down within its section
  So that I can prioritize the order I work through it

  # Honest e2e: in a dedicated project (Personal), move the second task up and
  # assert it becomes the first card rendered in its column.

  Scenario: Moving a task up reorders the column
    Given a signed-in user
    And the user opens the "Personal" project
    When the user moves the task "Renew passport" up
    Then the first task in the "To do" column is "Renew passport"
