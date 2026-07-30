Feature: Project sharing (members)
  As a signed-in user
  I want to invite people to a project by email
  So that we can collaborate on the same board (Asana-style sharing)

  # "Share Lab" is a dedicated project only this area touches, so inviting +
  # removing a teammate here can't disturb a parallel run. The scenario is
  # self-undoing: invite, assert, then remove — leaving the seed member list.

  Scenario: Inviting and removing a project member
    Given a signed-in user
    And the user opens the "Share Lab" project
    Then the project is shared with "test@example.com"
    When the user invites "teammate@example.com" to the project
    Then the project is shared with "teammate@example.com"
    When the user removes "teammate@example.com" from the project
    Then the project is not shared with "teammate@example.com"
