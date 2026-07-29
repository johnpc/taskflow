Feature: Keyboard shortcuts
  As a signed-in user
  I want keyboard shortcuts for navigation and help
  So that I can move around fast without the mouse

  Scenario: The help overlay opens with ?
    Given a signed-in user
    When the user presses "?"
    Then the shortcuts help overlay is visible

  Scenario: g then p navigates to Projects
    Given a signed-in user
    When the user presses the "g" then "p" shortcut
    Then the shortcut lands on the projects screen
