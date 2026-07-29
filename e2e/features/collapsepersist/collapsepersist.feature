Feature: Persistent list-section collapse
  As a signed-in user
  I want collapsed list sections to stay collapsed
  So that my layout is remembered as I move around

  # "Collapse Lab" is a dedicated project only this area collapses, so its
  # persisted collapse state can't disturb a parallel run.
  Scenario: A collapsed section stays collapsed after navigating away
    Given a signed-in user
    And the user opens the "Collapse Lab" project
    When the user switches to the list view
    And the user collapses the "Backlog" list section
    Then a task titled "Collapse me" is not visible
    When the user reopens the "Collapse Lab" project
    And the user switches to the list view
    Then a task titled "Collapse me" is not visible
