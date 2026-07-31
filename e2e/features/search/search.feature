Feature: Search
  As a signed-in user
  I want to search my tasks by title
  So that I can jump to any piece of work quickly

  Scenario: Searching finds a seeded task
    Given a signed-in user
    When the user searches for "launch announcement"
    Then a search result reading "Draft launch announcement" is visible

  Scenario: A query with no matches shows an empty state
    Given a signed-in user
    When the user searches for "zzzznomatch"
    Then the search empty state is shown

  Scenario: A search result shows the assignee's avatar
    Given a signed-in user
    When the user searches for "My assigned task"
    Then the search result "My assigned task" shows an assignee avatar
