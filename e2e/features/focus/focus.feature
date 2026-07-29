Feature: My Tasks focus buckets
  As a signed-in user
  I want to sort My Tasks into Today / Upcoming / Later
  So that I can plan what I'll work on regardless of due dates

  # "Renew passport" (Personal, overdue) is a stable open task no other area
  # completes. Setting its focus bucket is independent of its due date.
  Scenario: Filing a task into Today shows it under the Today bucket
    Given a signed-in user
    When the user opens My Tasks
    And the user groups My Tasks by focus
    And the user files "Renew passport" into "Today"
    Then the "Today" focus bucket contains "Renew passport"
