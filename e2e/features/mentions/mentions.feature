Feature: Rich comments
  As a signed-in user
  I want @mentions and formatting in comments
  So that I can direct notes at collaborators and emphasize text

  # "Mention target" (Mention Lab) is dedicated to this area; posting a comment
  # here can't disturb another comment area's count.
  Scenario: An @mention in a comment is highlighted
    Given a signed-in user
    And the user opens the "Mention Lab" project
    When the user opens the task titled "Mention target"
    And the user posts the comment "please review @teammate"
    Then the comment mention "@teammate" is highlighted

  # Comments render the same **bold** inline formatting as task notes.
  Scenario: Bold text in a comment is emphasized
    Given a signed-in user
    And the user opens the "Mention Lab" project
    When the user opens the task titled "Mention target"
    And the user posts the comment "this is **critical** now"
    Then the comment bold text "critical" is emphasized
