Feature: Completion celebration
  As a signed-in user
  I want a little flourish when I complete a task
  So that finishing work feels rewarding (Asana's confetti moment)

  # "Celebrate me" is a dedicated completion target. Completing it on a freshly
  # loaded board is the session's first completion, which always fires confetti.
  Scenario: Completing a task fires a confetti burst
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user completes the task titled "Celebrate me"
    Then a confetti celebration appears
