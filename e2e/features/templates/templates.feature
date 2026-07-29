Feature: Project templates
  As a signed-in user
  I want to spin up a ready-made project from a template
  So that I can start fast with sensible sections and tasks (Asana templates)

  # Honest e2e: pick the Sprint template and land on a new board with its seeded
  # columns and starter task. clearAll wipes template-created projects on reseed.

  Scenario: Creating a project from a template
    Given a signed-in user
    When the user creates a project from the "sprint" template
    Then a board column named "Backlog" is visible
    And a task titled "Sprint planning" is visible on the board
