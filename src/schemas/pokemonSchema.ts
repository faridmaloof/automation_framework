/**
 * Pokemon JSON Schemas
 * 
 * Schemas para validar respuestas de PokeAPI
 */

import { JSONSchemaType } from 'ajv';

/**
 * Tipo de Pokémon (simplificado)
 */
export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

/**
 * Habilidad de Pokémon (simplificado)
 */
export interface PokemonAbility {
  is_hidden: boolean;
  slot: number;
  ability: {
    name: string;
    url: string;
  };
}

/**
 * Sprite de Pokémon (simplificado)
 */
export interface PokemonSprite {
  front_default: string | null;
  front_shiny: string | null;
  back_default: string | null;
  back_shiny: string | null;
}

/**
 * Stat de Pokémon (simplificado)
 */
export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

/**
 * Pokémon Response completo (simplificado)
 */
export interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  is_default: boolean;
  order: number;
  types: PokemonType[];
  abilities: PokemonAbility[];
  sprites: PokemonSprite;
  stats: PokemonStat[];
}

/**
 * Schema JSON para validar Pokémon
 * Usamos tipo genérico 'any' para evitar conflictos con nullable en JSONSchemaType
 */
export const pokemonSchema: any = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    base_experience: { type: 'number' },
    height: { type: 'number' },
    weight: { type: 'number' },
    is_default: { type: 'boolean' },
    order: { type: 'number' },
    types: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          slot: { type: 'number' },
          type: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              url: { type: 'string' }
            },
            required: ['name', 'url'],
            additionalProperties: true
          }
        },
        required: ['slot', 'type'],
        additionalProperties: true
      }
    },
    abilities: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          is_hidden: { type: 'boolean' },
          slot: { type: 'number' },
          ability: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              url: { type: 'string' }
            },
            required: ['name', 'url'],
            additionalProperties: true
          }
        },
        required: ['is_hidden', 'slot', 'ability'],
        additionalProperties: true
      }
    },
    sprites: {
      type: 'object',
      properties: {
        front_default: { type: ['string', 'null'] },
        front_shiny: { type: ['string', 'null'] },
        back_default: { type: ['string', 'null'] },
        back_shiny: { type: ['string', 'null'] }
      },
      required: ['front_default', 'front_shiny', 'back_default', 'back_shiny'],
      additionalProperties: true
    },
    stats: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          base_stat: { type: 'number' },
          effort: { type: 'number' },
          stat: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              url: { type: 'string' }
            },
            required: ['name', 'url'],
            additionalProperties: true
          }
        },
        required: ['base_stat', 'effort', 'stat'],
        additionalProperties: true
      }
    }
  },
  required: ['id', 'name', 'base_experience', 'height', 'weight', 'is_default', 'order', 'types', 'abilities', 'sprites', 'stats'],
  additionalProperties: true
};
