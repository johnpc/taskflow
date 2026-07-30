Feature: Project status updates
  As a signed-in user
  I want to set a project's health status with a note
  So that everyone can see at a glance whether the work is on track

  Scenario: Setting a project to At risk
    Given a signed-in user
    And the user opens the "Status Lab" project
    When the user marks the project "At risk"
    Then the project shows the "At risk" status pill
