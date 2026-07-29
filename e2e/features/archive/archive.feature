Feature: Archive and delete projects
  As a signed-in user
  I want to archive or delete a project I'm done with
  So that my project list stays focused

  # Honest e2e: archive/delete a dedicated seeded project (no other area touches
  # it) and assert it leaves the project list.

  Scenario: Archiving a project removes it from the list
    Given a signed-in user
    And the user opens the "Old Campaign" project
    When the user archives the project
    Then a project named "Old Campaign" is not listed

  Scenario: Deleting a project removes it from the list
    Given a signed-in user
    And the user opens the "Scratchpad" project
    When the user deletes the project
    Then a project named "Scratchpad" is not listed
