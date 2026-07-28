Feature: Projects
  As a signed-in user
  I want to see and create projects
  So that I can organize my work into separate spaces

  # Honest e2e: assert on REAL seeded data (a named project from the seed), not
  # just that the page rendered.

  Scenario: The projects screen lists the seeded projects
    Given a signed-in user
    Then the projects screen shows the seeded projects
    And a project named "Product Launch" is visible

  Scenario: Creating a project adds it to the list
    Given a signed-in user
    When the user creates a project named "QA Sweep 8f3a"
    Then a project named "QA Sweep 8f3a" is visible
