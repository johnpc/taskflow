Feature: Account access
  As someone who wants to organize work
  I want an account so my projects and tasks are private and synced
  So that only I can see and change my workspace

  # Taskflow is account-based (not guest-first): a signed-out visitor can't reach
  # the workspace. These prove the guard + the real sign-in flow.

  Scenario: A signed-out visitor is sent to the welcome screen
    When the user opens the app
    Then they see the welcome screen

  Scenario: A returning user signs in and reaches their projects
    Given a signed-in user
    Then the projects screen shows the seeded projects
