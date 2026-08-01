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

  # A subtask with a due date shows a due chip on the parent's checklist,
  # overdue in red — "Chip sub one" is seeded overdue.
  Scenario: A dated subtask shows a due chip on the parent
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Chip parent"
    Then the subtask "Chip sub one" shows an overdue due chip
    And the subtask "Chip sub one" shows an assignee avatar

  # A subtask's due date is editable inline from the checklist (Asana). "Chip sub
  # two" starts undated; setting it to a fixed date round-trips. Idempotent.
  Scenario: Setting a subtask due date inline from the checklist
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Chip parent"
    And the user sets the subtask "Chip sub two" due date to "2026-12-15"
    Then the subtask "Chip sub two" due date is "2026-12-15"

  # A subtask's assignee is editable inline too (Asana). Assigning "Chip sub two"
  # to the seed user surfaces its avatar. Idempotent.
  Scenario: Assigning a subtask inline from the checklist
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Chip parent"
    And the user assigns the subtask "Chip sub two" to themselves
    Then the subtask "Chip sub two" shows an assignee avatar
