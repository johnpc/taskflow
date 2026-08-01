Feature: Board multi-select
  As a signed-in user
  I want to select several cards on the board and act on them at once
  So that I can triage on the board too, not just the list (Asana multi-select)

  # Honest e2e: on the BOARD (no list switch), select two dedicated seeded cards
  # and bulk-complete them; they leave the board (hide-completed default). They
  # live in their own short "Board Bulk Lab" project so a parallel run against
  # the busy Product Launch column can't make the checkbox un-actionable.
  Scenario: Bulk-completing selected cards on the board removes them
    Given a signed-in user
    And the user opens the "Board Bulk Lab" project
    When the user selects the tasks "Board bulk one" and "Board bulk two"
    And the user bulk-completes the selection
    Then a task titled "Board bulk one" is not visible
    And a task titled "Board bulk two" is not visible

  # Bulk-assign: select two cards in a shared project and assign them to a member
  # via the selection bar; both cards then show an assignee avatar.
  Scenario: Bulk-assigning selected cards to a member
    Given a signed-in user
    And the user opens the "Bulk Assign Lab" project
    When the user selects the tasks "Assign bulk one" and "Assign bulk two"
    And the user bulk-assigns the selection to a member
    Then the board card "Assign bulk one" shows an assignee avatar
    And the board card "Assign bulk two" shows an assignee avatar

  # Bulk-priority: select two LOW cards and bump them to High via the bar.
  Scenario: Bulk-setting the priority of selected cards
    Given a signed-in user
    And the user opens the "Board Bulk Lab" project
    When the user selects the tasks "Prio bulk one" and "Prio bulk two"
    And the user bulk-sets the selection priority to "HIGH"
    Then the board card "Prio bulk one" shows the "High" priority
    And the board card "Prio bulk two" shows the "High" priority

  # Bulk-label: select two cards and add a label to both via the bar.
  Scenario: Bulk-adding a label to selected cards
    Given a signed-in user
    And the user opens the "Board Bulk Lab" project
    When the user selects the tasks "Label bulk one" and "Label bulk two"
    And the user bulk-adds the label "Backend" to the selection
    Then the board card "Label bulk one" shows the label "Backend"
    And the board card "Label bulk two" shows the label "Backend"

  # Bulk-unlabel: select two cards that start WITH "Backend" and strip it via the
  # bar; the label chip leaves both cards.
  Scenario: Bulk-removing a label from selected cards
    Given a signed-in user
    And the user opens the "Board Bulk Lab" project
    When the user selects the tasks "Unlabel bulk one" and "Unlabel bulk two"
    And the user bulk-removes the label "Backend" from the selection
    Then the board card "Unlabel bulk one" does not show the label "Backend"
    And the board card "Unlabel bulk two" does not show the label "Backend"
