@pokemon @query
Feature: Query Pokémon Information
  As a system user
  I want to query Pokémon information
  So that I can obtain their data and characteristics

  Background:
    Given the system is available

  @smoke @api @rest
  Scenario Outline: Query Pikachu Pokémon via REST API
    When I query the pokemon "<pokemon>" via REST
    Then I get a successful response
    And the pokemon name is "<pokemon>"
    And the pokemon has id <id>
    And the pokemon has abilities

    Examples:
    | pokemon   | id  |
    | pikachu   | 25  |
    | charizard | 6   |
    | bulbasaur | 1   |
    | squirtle  | 7   |

  @smoke @web @chrome
  Scenario Outline: Search Pokémon on web
    When I search for the pokemon "<pokemon>" on the web
    Then I see information for pokemon "<pokemon>"

    Examples:
      | pokemon    |
      | pikachu    |
      | charizard  |
      | bulbasaur  |
      | squirtle   |

  @regression @api @rest
  Scenario Outline: Query multiple Pokémon
    When I query the pokemon "<pokemon>" via REST
    Then I get a successful response
    And the pokemon name is "<pokemon>"
    And the response time is less than 2000 ms

    Examples:
      | pokemon    |
      | pikachu    |
      | charizard  |
      | bulbasaur  |
      | squirtle   |

  @negative @api @rest
  Scenario: Query non-existent Pokémon
    When I query the pokemon "pokemon-inexistente-xxx" via REST
    Then I get a response with status 404

  @validation @api @rest @schema
  Scenario Outline: Validate response structure
    When I query the pokemon "<pokemon>" via REST
    Then I get a successful response
    And the response complies with the Pokemon schema

    Examples:
      | pokemon    |
      | pikachu    |
      | charizard  |
      | bulbasaur  |
      | squirtle   |
