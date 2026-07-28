Feature: Project board
  As a signed-in user
  I want to see my project's tasks in columns and work through them
  So that I can track progress at a glance

  # Honest e2e: assert on the REAL seeded task in a real column, and prove
  # completing it changes the rendered state.

  Scenario: The board shows seeded columns and a seeded task
    Given a signed-in user
    And the user opens the "Product Launch" project
    Then a board column named "To do" is visible
    And a task titled "Finalize press list" is visible on the board

  Scenario: Adding a task shows it on the board
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user adds a task titled "Book venue 7c2b" to the "To do" column
    Then a task titled "Book venue 7c2b" is visible on the board

  # Completing hides the card (hide-completed is default), so reveal it to prove
  # the done state round-tripped. Uses a dedicated task no other area reads.
  Scenario: Completing a task marks it done
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user completes the task titled "Kickoff meeting"
    And the user shows completed tasks
    Then the task titled "Kickoff meeting" is shown as done
