# language: es
@pokemon @api @smoke @regression
Característica: Consulta de información de Pokémon via API
  Como usuario de la API de PokeAPI
  Quiero consultar información de Pokémon
  Para obtener sus características y estadísticas

  Antecedentes:
    Dado el usuario tiene acceso a la API de PokeAPI

  @smoke @api
  Escenario: Consultar Pokémon Pikachu por nombre
    Cuando busca el Pokémon "pikachu" por nombre via API
    Entonces la respuesta debe tener status 200
    Y la respuesta debe contener el nombre "pikachu"
    Y la respuesta debe contener el ID 25
    Y la respuesta debe contener información del tipo
    Y la respuesta debe contener información de habilidades
    Y la respuesta debe contener el sprite del Pokémon

  @smoke @api
  Escenario: Consultar Pokémon Bulbasaur por ID
    Cuando busca el Pokémon con ID 1 via API
    Entonces la respuesta debe tener status 200
    Y la respuesta debe contener el nombre "bulbasaur"
    Y la respuesta debe contener el ID 1
    Y la respuesta debe contener información del tipo
    Y la respuesta debe contener información de habilidades

  @regression @api
  Escenario: Consultar Pokémon Charizard
    Cuando busca el Pokémon "charizard" por nombre via API
    Entonces la respuesta debe tener status 200
    Y la respuesta debe contener el nombre "charizard"
    Y la respuesta debe contener información del tipo
    Y la respuesta debe contener información de habilidades

  @regression @api
  Esquema del escenario: Consultar múltiples Pokémon por nombre
    Cuando busca el Pokémon "<pokemon>" por nombre via API
    Entonces la respuesta debe tener status 200
    Y la respuesta debe contener el nombre "<pokemon>"
    Y la respuesta debe contener información del tipo
    Y la respuesta debe contener información de habilidades

    Ejemplos:
      | pokemon    |
      | ditto      |
      | mewtwo     |
      | eevee      |
      | snorlax    |
      | dragonite  |

  @regression @api
  Esquema del escenario: Consultar múltiples Pokémon por ID
    Cuando busca el Pokémon con ID <id> via API
    Entonces la respuesta debe tener status 200
    Y la respuesta debe contener el ID <id>
    Y la respuesta debe contener información del tipo

    Ejemplos:
      | id  |
      | 10  |
      | 50  |
      | 100 |
      | 150 |

  @regression @api @validation
  Escenario: Validar estructura de respuesta completa
    Cuando busca el Pokémon "pikachu" por nombre via API
    Entonces la respuesta debe tener status 200
    Y la respuesta debe tener el campo "id"
    Y el campo "id" debe ser de tipo "number"
    Y la respuesta debe tener el campo "name"
    Y el campo "name" debe ser de tipo "string"
    Y la respuesta debe tener el campo "types"
    Y el campo "types" debe ser de tipo "array"
    Y la respuesta debe tener el campo "abilities"
    Y el campo "abilities" debe ser de tipo "array"
    Y la respuesta debe tener el campo "sprites"
    Y el campo "sprites" debe ser de tipo "object"
    Y la respuesta debe tener el campo "stats"
    Y el campo "stats" debe ser de tipo "array"

  @negative @api
  Escenario: Consultar Pokémon inexistente
    Cuando busca el Pokémon "pokemonquenoexiste" por nombre via API
    Entonces la respuesta debe tener status 404
