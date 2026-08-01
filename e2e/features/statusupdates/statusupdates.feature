Feature: Project status updates
  As a signed-in user
  I want to post a dated status update with a note
  So that the team has a running history of the project's health (Asana)

  # "Status Updates Lab" is a dedicated project only this area posts to (posting
  # also flips the current pill), so it can't race the projectstatus area.
  Scenario: Posting a status update adds it to the history
    Given a signed-in user
    And the user opens the "Status Updates Lab" project
    When the user posts an "At risk" status update reading "Scope grew this week"
    Then a status update reading "Scope grew this week" is visible
    And the project shows the "At risk" status pill
