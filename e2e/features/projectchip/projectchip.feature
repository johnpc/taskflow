Feature: Project chip on My Tasks
  As a signed-in user
  I want each My Tasks card to show its project
  So that I know where a task lives across projects

  # "Renew passport" is a stable open task in the Personal project; its My Tasks
  # card shows a "Personal" project chip.
  Scenario: A My Tasks card shows its project
    Given a signed-in user
    When the user opens My Tasks
    Then the "Renew passport" card shows the project "Personal"
