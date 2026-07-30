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
