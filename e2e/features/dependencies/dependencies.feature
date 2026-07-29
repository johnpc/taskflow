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

  # The inverse view: "Design hero banner" blocks "Announce on socials", so its
  # detail shows a Blocking line naming the dependent. Pure read, mutates nothing.
  Scenario: A blocker shows what it is blocking
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Design hero banner"
    Then the blocking line reads "Blocking Announce on socials"

  Scenario: Adding a blocker updates the banner
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Finalize press list"
    And the user marks it blocked by "Reserve launch domain"
    Then the blocked banner reads "Blocked by Reserve launch domain"

  # Completing a still-blocked task asks for confirmation first (Asana parity).
  # Non-mutating: we assert the confirm appears, then cancel — seed stays pristine.
  Scenario: Completing a blocked task asks for confirmation
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Announce on socials"
    And the user tries to complete the blocked task
    Then a blocked-complete confirmation appears

  # The board flags blocked cards from data it already holds (no extra fetch).
  Scenario: A blocked task shows a Blocked badge on the board
    Given a signed-in user
    And the user opens the "Product Launch" project
    Then the board card "Announce on socials" shows a Blocked badge
