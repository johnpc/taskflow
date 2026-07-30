Feature: Home dashboard
  As a signed-in user
  I want a landing dashboard with a greeting and what needs attention
  So that I know where to start (Asana Home analogue)

  # Honest e2e: signing in lands on Home; assert the greeting + the overdue stat
  # (the seed has overdue tasks) + a project shortcut render.

  Scenario: The home dashboard greets the user and summarizes work
    Given a signed-in user
    Then the home dashboard shows a greeting
    And the home dashboard shows the overdue stat
    And a home project shortcut "Product Launch" is visible

  # "Design hero banner" is seeded due in 3 days (upcoming), so it shows in the
  # Home "Coming up" list.
  Scenario: The home dashboard lists upcoming tasks
    Given a signed-in user
    Then a home upcoming task "Design hero banner" is visible
