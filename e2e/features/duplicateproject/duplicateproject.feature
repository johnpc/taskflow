Feature: Duplicate a project
  As a signed-in user
  I want to duplicate an entire project
  So that I can reuse a project's structure and open work as a starting point

  # "Dup Source Lab" is dedicated to this area; duplicating it creates
  # "Dup Source Lab (copy)" with its sections + open tasks copied over.
  Scenario: Duplicating a project creates a copy with its tasks
    Given a signed-in user
    And the user opens the "Dup Source Lab" project
    When the user duplicates the project
    Then the user is on the project named "Dup Source Lab (copy)"
    And the duplicated board shows a task titled "Copy me"
