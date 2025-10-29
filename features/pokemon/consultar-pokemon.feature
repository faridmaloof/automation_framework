@pokemon @consultar
Feature: Consultar información de Pokémon
  Como usuario del sistema
  Quiero consultar información de Pokémon
  Para obtener sus datos y características

  Background:
    Given el sistema está disponible

  @smoke @api @rest
  Scenario: Consultar Pokémon Pikachu por API REST
    When consulto el pokemon "<pokemon>" por REST
    Then obtengo respuesta exitosa
    And el nombre del pokemon es "<pokemon>"
    And el pokemon tiene id 25
    And el pokemon tiene habilidades

    Examples:
      | pokemon    |
      | pikachu    |
      | charizard  |
      | bulbasaur  |
      | squirtle   |

  @smoke @web @chrome
  Scenario: Buscar Pokémon en web
    When busco el pokemon "<pokemon>" en la web
    Then veo información del pokemon "<pokemon>"

    Examples:
      | pokemon    |
      | pikachu    |
      | charizard  |
      | bulbasaur  |
      | squirtle   |

  @regression @api @rest
  Scenario Outline: Consultar múltiples Pokémon
    When consulto el pokemon "<pokemon>" por REST
    Then obtengo respuesta exitosa
    And el nombre del pokemon es "<pokemon>"
    And el tiempo de respuesta es menor a 2000 ms

    Examples:
      | pokemon    |
      | pikachu    |
      | charizard  |
      | bulbasaur  |
      | squirtle   |

  @negative @api @rest
  Scenario: Consultar Pokémon inexistente
    When consulto el pokemon "pokemon-inexistente-xxx" por REST
    Then obtengo respuesta con status 404

  @validation @api @rest @schema
  Scenario: Validar estructura de respuesta
    When consulto el pokemon "<pokemon>" por REST
    Then obtengo respuesta exitosa
    And la respuesta cumple con el schema de Pokemon

    Examples:
      | pokemon    |
      | pikachu    |
      | charizard  |
      | bulbasaur  |
      | squirtle   |
