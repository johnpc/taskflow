Feature: Comment timestamps
  As a signed-in user
  I want to see when each comment was posted
  So that I can follow the discussion in order

  # Post on the dedicated "Comment me" task; a freshly posted comment shows a
  # "just now" relative timestamp on its row.
  Scenario: A posted comment shows a relative timestamp
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Comment me"
    And the user posts the comment "Timed note 9k2d"
    Then the comment "Timed note 9k2d" shows a timestamp
