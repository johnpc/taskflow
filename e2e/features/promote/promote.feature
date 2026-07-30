Feature: Promote a subtask
  As a signed-in user
  I want to promote a subtask into a standalone task
  So that work that outgrew its parent can stand on its own

  # "Promote Lab" is dedicated to this area; promoting "Promote me" lifts it out
  # of "Promote parent" so it appears as a top-level card on the board.
  Scenario: Promoting a subtask lifts it to the board
    Given a signed-in user
    And the user opens the "Promote Lab" project
    When the user opens the task titled "Promote parent"
    And the user opens the subtask "Promote me"
    And the user promotes the subtask
    Then no parent breadcrumb is shown
