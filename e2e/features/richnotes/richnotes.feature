Feature: Rich task notes
  As a signed-in user
  I want notes to render bold, links, and checklists
  So that task details are readable and structured

  # Honest e2e: open a seeded task whose notes carry markdown-lite + a checklist
  # and assert the rendered preview shows them.

  Scenario: Notes render as formatted text
    Given a signed-in user
    And the user opens the "Product Launch" project
    When the user opens the task titled "Finalize press list"
    Then the notes preview shows a checklist item
    And the notes preview shows a link to "https://example.com/kit"
