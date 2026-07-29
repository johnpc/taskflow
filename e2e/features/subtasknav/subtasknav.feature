Feature: Subtask navigation
  As a signed-in user
  I want to open a subtask and get back to its parent
  So that I can drill in and out of nested work

  # "Chip parent" is a dedicated task with subtasks "Chip sub one/two" that no
  # other area mutates.
  Scenario: Open a subtask then return via the parent breadcrumb
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Chip parent"
    And the user opens the subtask "Chip sub one"
    Then the parent breadcrumb reads "Chip parent"
    When the user opens the parent breadcrumb
    Then no parent breadcrumb is shown
