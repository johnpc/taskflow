Feature: Saved filter views
  As a signed-in user
  I want to save a filter/sort combo as a named view
  So that I can re-apply a way of looking at a project in one tap (Asana views)

  # Save a High-priority view, clear the filter, then re-apply the saved view and
  # confirm it filters again. "Draft launch announcement" is HIGH and "Design
  # hero banner" is MEDIUM (neither's priority is mutated by another area).
  Scenario: Saving and re-applying a filter view
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user filters the board to "HIGH" priority
    And the user saves the current view as "High only"
    And the user filters the board to "" priority
    And the user applies the saved view "High only"
    Then a task titled "Draft launch announcement" is visible on the board
    And a task titled "Design hero banner" is not visible
