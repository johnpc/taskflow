Feature: Timeline view
  As a signed-in user
  I want a Gantt-style timeline of a project's dated tasks
  So that I can see what's happening across the next two weeks at a glance

  # "Design hero banner" is seeded with a near-future due date in Product Launch,
  # so it appears as a bar on the timeline. (Read-only; asserts the rendered bar.)
  Scenario: Switching a project to the timeline view
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user switches to the timeline view
    Then a timeline bar for "Design hero banner" is visible
    And the timeline marks today's column
