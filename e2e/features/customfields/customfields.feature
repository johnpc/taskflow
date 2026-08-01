Feature: Custom fields
  As a signed-in user
  I want to define custom fields on a project and fill them in on tasks
  So that I can track project-specific data (Asana custom fields)

  # You can define a project's custom fields straight from the board — no task
  # needed. "Field Manager Lab" is dedicated to this area for parallel isolation.
  Scenario: Defining a custom field from the board-level manager
    Given a signed-in user
    And the user opens the "Field Manager Lab" project
    When the user opens the custom-fields manager
    And the user adds the custom field "Team" from the manager
    Then the custom-fields manager lists the field "Team"

  # "Fields Lab" is a dedicated project only this area touches, so defining a
  # field + setting its value here can't disturb a parallel run.
  Scenario: Defining a custom field and setting its value on a task
    Given a signed-in user
    And the user opens the "Fields Lab" project
    When the user opens the task titled "Field target"
    And the user adds the custom field "Story points"
    Then the custom field "Story points" is shown on the task
    When the user sets the custom field "Story points" to "8"
    Then the custom field "Story points" has the value "8"
    When the user reloads the task
    Then the custom field "Story points" has the value "8"

  # A SELECT field renders a dropdown of its options; picking one persists. Uses
  # its own project ("Select Lab") since this feature's scenarios run in parallel.
  Scenario: A single-select custom field
    Given a signed-in user
    And the user opens the "Select Lab" project
    When the user opens the task titled "Select target"
    And the user adds the select field "Stage" with options "Todo, Doing, Done"
    And the user sets the custom field "Stage" to "Doing"
    When the user reloads the task
    Then the custom field "Stage" has the value "Doing"

  # A NUMBER field renders a numeric input; its value persists like any other.
  # Own project ("Number Lab") — scenarios run in parallel on one backend.
  Scenario: A number custom field
    Given a signed-in user
    And the user opens the "Number Lab" project
    When the user opens the task titled "Number target"
    And the user adds the "NUMBER" field "Estimate"
    And the user sets the custom field "Estimate" to "13"
    When the user reloads the task
    Then the custom field "Estimate" has the value "13"

  # Filter the board by a SELECT custom-field value: tag two cards with different
  # options, then narrow the board to one and the other card disappears. Own
  # project ("Field Filter Lab") for parallel isolation.
  Scenario: Filtering the board by a custom-field value
    Given a signed-in user
    And the user opens the "Field Filter Lab" project
    When the user opens the custom-fields manager
    And the user adds the select field "Stage" with options "Alpha, Bravo"
    And the user opens the task titled "CF filter alpha"
    And the user sets the custom field "Stage" to "Alpha"
    And the user goes back to the board
    And the user opens the task titled "CF filter bravo"
    And the user sets the custom field "Stage" to "Bravo"
    And the user goes back to the board
    And the user filters the board by custom field "Stage" being "Alpha"
    Then a task titled "CF filter alpha" is visible on the board
    And a task titled "CF filter bravo" is not visible

  # A set custom-field value shows as a chip on the task's board card. Own
  # project ("Chips Lab") for parallel isolation.
  Scenario: A set custom-field value shows as a card chip
    Given a signed-in user
    And the user opens the "Chips Lab" project
    When the user opens the task titled "Chip field target"
    And the user adds the "TEXT" field "Owner"
    And the user sets the custom field "Owner" to "Alex"
    And the user goes back to the board
    Then the board card "Chip field target" shows the custom-field chip "Owner: Alex"
    When the user switches to the list view
    Then the board card "Chip field target" shows the custom-field chip "Owner: Alex"
