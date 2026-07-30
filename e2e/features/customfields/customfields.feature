Feature: Custom fields
  As a signed-in user
  I want to define custom fields on a project and fill them in on tasks
  So that I can track project-specific data (Asana custom fields)

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
