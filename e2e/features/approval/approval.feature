Feature: Task approval
  As a signed-in user
  I want to mark a task's approval outcome
  So that reviewers can sign off on work (Asana approvals)

  # "Approve me" is a dedicated task only this area sets an outcome on, so the
  # approval badge assertion can't be disturbed by a parallel run. Reset to
  # "No approval" at the end so the shared sandbox stays clean.
  Scenario: Approving a task shows an approval badge
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Approve me"
    And the user sets the approval to "APPROVED"
    Then the task detail shows the approval "APPROVED"
    When the user sets the approval to "NONE"
    Then the task detail shows the approval "NONE"
