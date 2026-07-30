Feature: Duplicate a section
  As a signed-in user
  I want to duplicate a board section
  So that I can reuse a column's structure and tasks

  # "Section Copy Lab" is dedicated to this area; duplicating "Backlog" creates
  # a "Backlog (copy)" column beside it.
  Scenario: Duplicating a section adds a copy column
    Given a signed-in user
    And the user opens the "Section Copy Lab" project
    When the user duplicates the "Backlog" section
    Then a board column named "Backlog (copy)" is visible
