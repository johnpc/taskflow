Feature: Rich search results
  As a signed-in user
  I want search results to show each task's project
  So that I can tell matching tasks apart across projects

  # "launch" matches "Draft launch announcement" in the Product Launch project;
  # its result row shows the project chip.
  Scenario: A search result shows its project
    Given a signed-in user
    When the user searches for "launch"
    Then a search result "Draft launch announcement" shows the project "Product Launch"
