Feature: Project progress
  As a signed-in user
  I want to see how far along each project is
  So that I can gauge completion at a glance

  # "Progress Lab" is seeded with exactly one of two tasks done, so its card
  # always shows a 1-of-2 (50%) progress bar.
  Scenario: A project card shows its completion progress
    Given a signed-in user
    When the user goes to the projects screen
    Then the project "Progress Lab" shows progress "1 of 2 done"
