Feature: Archived projects view
  As a signed-in user
  I want to see the projects I've archived
  So that archiving is reversible, not a dead end

  # "Archive Lab" is seeded already archived, so it appears in the Archived
  # section as a pure read — no archive step, keeping this idempotent across
  # CI retries on the shared sandbox. Restore is covered by unit tests.
  Scenario: An archived project appears in the Archived section
    Given a signed-in user
    When the user goes to the projects screen
    And the user expands the archived section
    Then an archived project "Archive Lab" is listed
    And a "Restore Archive Lab" control is present
