@web
Feature: PokeAPI Documentation Navigation
  As a PokeAPI user
  I want to navigate through the official documentation
  So that I can learn about the different API versions available

  Background:
    Given I am on the PokeAPI documentation page

  @smoke
  Scenario: Verify main documentation structure
    Then I should see the "Docs" heading
    And I should see the main navigation links:
      | API v1            |
      | API v2            |
      | GraphQL v1beta    |

  Scenario: Navigation to API v1 shows deprecation message
    When I click on the "API v1" link
    Then I should see the deprecation message "End of support for version 1"
    And I should see the end of support date "After 15 October 2018"

  Scenario: Navigation to GraphQL shows documentation
    When I click on the "GraphQL v1beta" link
    Then I should see the GraphQL title
    And I should see the endpoint URL "graphql.pokeapi.co/v1beta"
    And I should see the "GraphiQL" section

  Scenario: Navigation to API v2 shows current documentation
    When I click on the "API v2" link
    Then I should see the "Fair Use Policy" title
    And I should see available resource sections
    And I should see endpoint examples

  @smoke @regression
  Scenario: Navigation links are functional
    Then all main links should be clickable
    And all main links should have valid URLs

  Scenario Outline: Responsive navigation on different devices
    When I change the viewport to "<device>"
    Then the navigation should be accessible
    And the content should be readable

    Examples:
      | device  |
      | mobile  |
      | tablet  |
      | desktop |
