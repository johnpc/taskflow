Feature: Task labels
  As a signed-in user
  I want to tag tasks with reusable colored labels
  So that I can categorize and scan my work (Asana-style tags)

  # Honest e2e: the seeded task carries seeded labels — assert the chip renders on
  # the board, then apply another label on the detail and see it stick.

  Scenario: A seeded label shows as a chip on the board
    Given a signed-in user
    And the user opens the "Product Launch" project
    Then a label chip "Marketing" is visible on the board

  Scenario: Applying a label on the task detail persists
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Design hero banner"
    And the user applies the "Design" label
    Then the "Design" label is shown as applied
