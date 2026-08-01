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

  # Favorited projects group into a "Starred" section (Asana). "Product Launch"
  # is seeded favorite, so it appears there.
  Scenario: Favorited projects appear in the Starred section
    Given a signed-in user
    When the projects screen shows the seeded projects
    Then the project "Product Launch" is in the Starred section

  Scenario: Creating a project adds it to the list
    Given a signed-in user
    When the user creates a project named "QA Sweep 8f3a"
    Then a project named "QA Sweep 8f3a" is visible

  # Favoriting from the board header: "Fav Lab" is dedicated to this area so
  # flipping its flag can't disturb another area's project ordering.
  Scenario: Favoriting a project from its board header
    Given a signed-in user
    And the user opens the "Fav Lab" project
    When the user favorites the project from the header
    Then the project header shows it as favorited

  # Recoloring: "Color Lab" is dedicated to this area so changing its accent
  # can't disturb another area's card color.
  Scenario: Recoloring a project from its header
    Given a signed-in user
    And the user opens the "Color Lab" project
    When the user picks the project color "sky"
    Then the project color "sky" is selected
