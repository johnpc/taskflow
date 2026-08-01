Feature: Project key resources
  As a signed-in user
  I want to keep important links on a project's overview
  So that specs, docs, and designs are one click away (Asana key resources)

  # Adds a key-resource link on a dedicated project ("Resources Lab") and asserts
  # it appears in the list. Idempotent for CI retries (skip-if-present).
  Scenario: Adding a key-resource link to a project
    Given a signed-in user
    And the user opens the "Resources Lab" project
    When the user opens the key-resources panel
    And the user adds the key resource "Design spec" linking to "https://example.com/spec"
    Then the key resource "Design spec" is listed
