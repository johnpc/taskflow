Feature: Search filters
  As a signed-in user
  I want to narrow search results by priority and completion
  So that I can find exactly the task I mean

  # "launch" matches the HIGH "Draft launch announcement" and the NONE "Reserve
  # launch domain"; filtering to High leaves only the announcement.
  Scenario: Filtering search results to High priority
    Given a signed-in user
    When the user searches for "launch"
    And the user filters search to "High" priority
    Then a search result "Draft launch announcement" is shown
    And no search result "Reserve launch domain" is shown
