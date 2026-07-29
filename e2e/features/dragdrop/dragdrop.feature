Feature: Drag and drop tasks between sections
  As a signed-in user
  I want to drag a card from one column to another
  So that moving work across stages feels direct (Asana's signature interaction)

  # Honest e2e: drag a dedicated seeded card from "To do" to "In progress" and
  # assert it now renders in the target column. "Drag me" is moved by no other area.

  Scenario: Dragging a card to another column moves it there
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user drags the card "Drag me" to the "In progress" column
    Then the "In progress" column contains "Drag me"
