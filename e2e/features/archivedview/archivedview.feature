Feature: Archived projects view
  As a signed-in user
  I want to see and restore projects I've archived
  So that archiving is reversible, not a dead end

  # "Archive Lab" is a dedicated project only this scenario archives + restores.
  Scenario: An archived project can be viewed and restored
    Given a signed-in user
    And the user opens the "Archive Lab" project
    When the user archives the project
    And the user expands the archived section
    Then an archived project "Archive Lab" is listed
    When the user restores the archived project "Archive Lab"
    Then a project named "Archive Lab" is visible
