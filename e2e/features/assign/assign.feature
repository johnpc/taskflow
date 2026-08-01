Feature: Move and assign tasks
  As a signed-in user
  I want to move a task to another section and assign it to myself
  So that I can reorganize work and claim what I'm responsible for (Asana-style)

  # Honest e2e: open a real seeded task, move it to a different real section, and
  # assign it — asserting the rendered state changes after each write.

  Scenario: Moving a task to another section
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Design hero banner"
    And the user moves the task to the "In progress" section
    Then the task's section is "In progress"

  Scenario: Assigning a task to myself
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Set up analytics"
    And the user assigns the task to themselves
    Then the task is shown as assigned
    # Assigning auto-follows the assignee (Asana) — I now follow this task.
    And the task shows as followed
    When the user goes back to the board
    Then the board card "Set up analytics" shows an assignee avatar
