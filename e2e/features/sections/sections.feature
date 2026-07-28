Feature: Project overview and sections
  As a signed-in user
  I want to describe my project and manage its sections
  So that I can shape the workspace to my process (Asana-style)

  # Honest e2e: add a real section to a real project and see the new column, then
  # set the project description and confirm it persists on reload.

  Scenario: Adding a section shows a new column
    Given a signed-in user
    And the user opens the "Website Redesign" project
    When the user adds a section named "Review QX72"
    Then a board column named "Review QX72" is visible

  Scenario: Setting a project description persists
    Given a signed-in user
    And the user opens the "Website Redesign" project
    When the user sets the project description to "Ship the new marketing site"
    And the user reopens the "Website Redesign" project
    Then the project description is "Ship the new marketing site"
