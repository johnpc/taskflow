Feature: Mention a teammate in a comment
  As a signed-in user
  I want to @mention people in comments
  So that I can direct a note at a specific collaborator

  # "Mention target" (Mention Lab) is dedicated to this area; posting a comment
  # here can't disturb another comment area's count.
  Scenario: An @mention in a comment is highlighted
    Given a signed-in user
    And the user opens the "Mention Lab" project
    When the user opens the task titled "Mention target"
    And the user posts the comment "please review @teammate"
    Then the comment mention "@teammate" is highlighted
