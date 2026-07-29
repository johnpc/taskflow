Feature: Task highlight color
  As a signed-in user
  I want to set a highlight color on a task
  So that important tasks stand out visually on the board

  # "Color me" is a dedicated task only this area colors, so its accent can't
  # disturb a parallel run.
  Scenario: Setting a highlight color accents the task card
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Color me"
    And the user sets the highlight color to "sky"
    And the user reopens the "Product Launch" project
    Then the board card "Color me" is color-accented
