/**
 * JSON Schema para validación de respuestas de la API de Pokemon
 */
export const pokemonSchema = {
  type: 'object',
  required: ['id', 'name', 'abilities', 'types'],
  properties: {
    id: {
      type: 'number',
      minimum: 1
    },
    name: {
      type: 'string',
      minLength: 1
    },
    abilities: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['ability'],
        properties: {
          ability: {
            type: 'object',
            required: ['name', 'url'],
            properties: {
              name: { type: 'string' },
              url: { type: 'string' }
            }
          }
        }
      }
    },
    types: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['type'],
        properties: {
          type: {
            type: 'object',
            required: ['name', 'url'],
            properties: {
              name: { type: 'string' },
              url: { type: 'string' }
            }
          }
        }
      }
    },
    height: { type: 'number' },
    weight: { type: 'number' },
    base_experience: { type: 'number' }
  }
};
