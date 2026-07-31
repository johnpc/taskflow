Feature: Copy project link
  As a signed-in user
  I want to copy a project's link from its menu
  So that I can share a direct link to the board

  # "Product Launch" is a stable read anchor — copying its link mutates nothing.
  Scenario: Copying a project link puts its URL on the clipboard
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user copies the project link from the menu
    Then the clipboard holds a "/projects/" link
