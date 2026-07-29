Feature: Drag to reorder onto a card
  As a signed-in user
  I want to drag a card onto another card to reorder
  So that I can order work precisely, not just move it a step at a time

  # "Reorder Lab" seeds "Order alpha" then "Order bravo" in the Queue column,
  # touched by no other area. Dropping bravo onto alpha puts bravo first.
  Scenario: Dropping a card onto another reorders the column
    Given a signed-in user
    And the user opens the "Reorder Lab" project
    When the user drops the card "Order bravo" onto the card "Order alpha"
    Then the first card in the "Queue" column is "Order bravo"
