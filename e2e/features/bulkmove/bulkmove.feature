Feature: Bulk move selected tasks
  As a signed-in user
  I want to move several selected tasks to a section at once
  So that I can reorganize quickly without opening each task

  # "Bulk Move Lab" has two tasks in Stage that only this area moves to Shipped.
  Scenario: Moving the selection relocates the tasks to a section
    Given a signed-in user
    And the user opens the "Bulk Move Lab" project
    When the user switches to the list view
    And the user selects the tasks "Bulk move one" and "Bulk move two"
    And the user bulk-moves the selection to "Shipped"
    And the user expands the "Shipped" list section
    Then the "Shipped" list section contains "Bulk move one"
    And the "Shipped" list section contains "Bulk move two"
