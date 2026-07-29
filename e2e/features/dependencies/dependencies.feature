Feature: Task dependencies
  As a signed-in user
  I want to mark a task as blocked by other tasks
  So that I know what has to finish before I can start it

  # "Announce on socials" is seeded blocked by "Design hero banner" (an open,
  # never-completed task), so the Blocked banner is always present.
  Scenario: A blocked task shows a Blocked banner naming its blocker
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Announce on socials"
    Then the blocked banner reads "Blocked by Design hero banner"

  Scenario: Adding a blocker updates the banner
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Finalize press list"
    And the user marks it blocked by "Reserve launch domain"
    Then the blocked banner reads "Blocked by Reserve launch domain"

  # The board flags blocked cards from data it already holds (no extra fetch).
  Scenario: A blocked task shows a Blocked badge on the board
    Given a signed-in user
    And the user opens the "Product Launch" project
    Then the board card "Announce on socials" shows a Blocked badge
