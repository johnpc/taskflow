Feature: Task attachments
  As a signed-in user
  I want to attach links to a task
  So that related docs and pages live alongside the work

  # Adding an attachment only creates a child row — it doesn't change any other
  # area's assertions — so a stable seeded task is a safe target. A unique URL
  # keeps the assertion unambiguous on the shared sandbox.
  Scenario: Attaching a link shows a clickable link on the task
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Draft launch announcement"
    And the user attaches the link "https://taskflow.example/brief-7c2b" titled "Creative brief"
    Then a task attachment titled "Creative brief" links to "https://taskflow.example/brief-7c2b"

  # Uploading a FILE creates an attachment rendered from its stored key (its
  # filename is the label). Dedicated "File Attach Lab" task avoids cross-counting.
  Scenario: Uploading a file attachment
    Given a signed-in user
    And the user opens the "File Attach Lab" project
    When the user opens the task titled "File attach target"
    And the user uploads a file attachment
    Then a task attachment titled "note.txt" is shown
