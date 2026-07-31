Feature: Account profile
  As a signed-in user
  I want an account area to manage my sign-in
  So that I can change my password or sign out

  # Safe e2e: submitting a WRONG current password surfaces the error without
  # actually changing the test user's password (which would break other areas).
  Scenario: Changing the password rejects a wrong current password
    Given a signed-in user
    When the user opens the You tab
    And the user submits a password change with current "wrongpass9" and new "brandnew12345"
    Then the password change shows an error

  Scenario: A display name resolves onto shared work
    Given a signed-in user
    When the user opens the You tab
    And the user sets their display name to "Test Person"
    Then the display name is saved
    # Team Board is shared (2 members), so its header shows a member presence
    # stack; the test user's avatar there resolves to the name just set.
    When the user opens the "Team Board" project
    Then a member avatar for "Test Person" is shown

  Scenario: Uploading a profile avatar
    Given a signed-in user
    When the user opens the You tab
    And the user uploads an avatar image
    Then the avatar image is shown
