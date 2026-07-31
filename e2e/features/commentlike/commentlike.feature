Feature: Like a comment
  As a signed-in user
  I want to like a comment
  So that I can acknowledge it without replying (Asana comment hearts)

  # "Like comment me" is a dedicated task only this area posts on, so liking a
  # uniquely-tagged comment here can't disturb a parallel run. Like then unlike
  # so the shared sandbox is left clean (idempotent across CI retries).
  Scenario: Liking and unliking a comment
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Like comment me"
    And the user posts the comment "Nice one 7f3b"
    And the user likes the comment "Nice one 7f3b"
    Then the comment "Nice one 7f3b" shows 1 like
    When the user likes the comment "Nice one 7f3b"
    Then the comment "Nice one 7f3b" shows no likes
