Feature: Reorder sections
  As a signed-in user
  I want to move a section left or right
  So that my board columns match how I work

  # Honest e2e: move the second column left in a dedicated project and assert it
  # becomes the first column rendered.

  Scenario: Moving a section left reorders the columns
    Given a signed-in user
    And the user opens the "Website Redesign" project
    When the user moves the "This week" section left
    Then the first board column is "This week"
