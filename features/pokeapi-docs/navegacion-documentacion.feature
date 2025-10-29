#language: es
@web
Característica: Navegación en la documentación de PokeAPI
  Como usuario de PokeAPI
  Quiero navegar por la documentación oficial
  Para conocer las diferentes versiones disponibles de la API

  Antecedentes:
    Dado que estoy en la página de documentación de PokeAPI

  @smoke
  Escenario: Verificar estructura principal de la documentación
    Entonces debo ver el encabezado "Docs"
    Y debo ver los enlaces de navegación principales:
      | API v1            |
      | API v2            |
      | GraphQL v1beta    |

  Escenario: Navegación a API v1 muestra mensaje de deprecación
    Cuando hago clic en el enlace "API v1"
    Entonces debo ver el mensaje de deprecación "End of support for version 1"
    Y debo ver la fecha de fin de soporte "After 15 October 2018"

  Escenario: Navegación a GraphQL muestra documentación
    Cuando hago clic en el enlace "GraphQL v1beta"
    Entonces debo ver el título de GraphQL
    Y debo ver la URL del endpoint "graphql.pokeapi.co/v1beta"
    Y debo ver la sección "GraphiQL"

  Escenario: Navegación a API v2 muestra documentación actual
    Cuando hago clic en el enlace "API v2"
    Entonces debo ver el título "Fair Use Policy"
    Y debo ver secciones de recursos disponibles
    Y debo ver ejemplos de endpoints

  @smoke @regression
  Escenario: Links de navegación están funcionales
    Entonces todos los enlaces principales deben ser clicables
    Y todos los enlaces principales deben tener URLs válidas

  Escenario: Navegación responsive en diferentes tamaños
    Cuando cambio el tamaño de la ventana a "<dispositivo>"
    Entonces la navegación debe ser accesible
    Y el contenido debe ser legible

    Ejemplos:
      | dispositivo |
      | móvil       |
      | tablet      |
      | escritorio  |
