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

  # "Zephyr report" is seeded in two projects (Product Launch + Website
  # Redesign). Filtering the search to one project drops the other's hit.
  Scenario: Filtering search by project narrows the results
    Given a signed-in user
    When the user searches for "zephyr"
    Then exactly 2 search results are shown
    When the user filters search to the project "Website Redesign"
    Then exactly 1 search result is shown
