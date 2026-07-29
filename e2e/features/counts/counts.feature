Feature: Task counts
  As a signed-in user
  I want to see how much is on each project and how much is overdue
  So that I can gauge my workload at a glance

  Scenario: Project cards show an open-task count
    Given a signed-in user
    Then the "Product Launch" project shows a task count

  Scenario: My Tasks shows an overdue count
    Given a signed-in user
    When the user opens My Tasks
    Then an overdue count is shown
