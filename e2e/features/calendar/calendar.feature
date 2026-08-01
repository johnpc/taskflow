Feature: Calendar
  As a signed-in user
  I want a two-week view of my upcoming dated tasks
  So that I can see what's coming and plan ahead (Asana calendar analogue)

  # Honest e2e: a seeded task with a near-future due date shows on the calendar.
  # "Plan Q3 goals" is seeded +5 days out and no other area completes it.

  Scenario: Upcoming dated tasks appear on the calendar
    Given a signed-in user
    When the user opens the calendar
    Then a calendar task "Plan Q3 goals" is visible

  Scenario: A calendar task shows which project it belongs to
    Given a signed-in user
    When the user opens the calendar
    Then the calendar task "Plan Q3 goals" shows the project "Personal"

  # "My assigned task" (Personal, due +4, assigned to the seed user) shows its
  # assignee avatar on the calendar — the cross-project who-owns-it cue.
  Scenario: A calendar task shows its assignee avatar
    Given a signed-in user
    When the user opens the calendar
    Then the calendar task "My assigned task" shows an assignee avatar

  # Paging a week forward moves "Plan Q3 goals" (+5d) out of the window; the
  # "Today" button brings the current window (and the task) back.
  Scenario: Paging the calendar forward and back
    Given a signed-in user
    When the user opens the calendar
    And the user pages the calendar to the next week
    Then a calendar task "Plan Q3 goals" is not visible
    When the user returns the calendar to today
    Then a calendar task "Plan Q3 goals" is visible

  # Switching to the month grid shows the same dated tasks laid out on a monthly
  # calendar. "My assigned task" (+4d) always stays within the current month's
  # window (the current window covers today + at least the next 4 days).
  Scenario: Viewing tasks on the month grid
    Given a signed-in user
    When the user opens the calendar
    And the user switches to the month calendar view
    Then the calendar month grid is visible
    And a calendar task "My assigned task" is visible
