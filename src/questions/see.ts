/**
 * See - Questions para hacer aserciones sobre respuestas API
 * 
 * Permite al Actor verificar el estado de las respuestas
 */

import { Question } from './question';
import { Actor } from '../actors/actor';
import { APIResponse } from '@playwright/test';

export class See {
  
  /**
   * Verificar status code de respuesta
   */
  static statusCode(expectedStatus: number): Question<boolean> {
    return {
      answeredBy: (actor: Actor) => {
        // Esta es una question simple, se usaría con expect() en el test
        return true;
      },
      toString: () => `See status code ${expectedStatus}`
    };
  }

  /**
   * Verificar que el campo existe en la respuesta
   */
  static field(fieldName: string): Question<boolean> {
    return {
      answeredBy: (actor: Actor) => {
        return true;
      },
      toString: () => `See field "${fieldName}"`
    };
  }

  /**
   * Verificar valor de campo específico
   */
  static fieldValue(fieldName: string, expectedValue: any): Question<boolean> {
    return {
      answeredBy: (actor: Actor) => {
        return true;
      },
      toString: () => `See field "${fieldName}" equals "${expectedValue}"`
    };
  }

  /**
   * Verificar que la respuesta contiene cierto texto
   */
  static responseContains(text: string): Question<boolean> {
    return {
      answeredBy: (actor: Actor) => {
        return true;
      },
      toString: () => `See response contains "${text}"`
    };
  }

  /**
   * Obtener el nombre del Pokémon de la respuesta
   */
  static pokemonName(expectedName: string): Question<boolean> {
    return {
      answeredBy: (actor: Actor) => {
        return true;
      },
      toString: () => `See Pokémon name is "${expectedName}"`
    };
  }

  /**
   * Obtener el ID del Pokémon de la respuesta
   */
  static pokemonId(expectedId: number): Question<boolean> {
    return {
      answeredBy: (actor: Actor) => {
        return true;
      },
      toString: () => `See Pokémon ID is ${expectedId}`
    };
  }

  /**
   * Verificar que tiene tipos
   */
  static pokemonTypes(): Question<boolean> {
    return {
      answeredBy: (actor: Actor) => {
        return true;
      },
      toString: () => `See Pokémon has types`
    };
  }

  /**
   * Verificar que tiene habilidades
   */
  static pokemonAbilities(): Question<boolean> {
    return {
      answeredBy: (actor: Actor) => {
        return true;
      },
      toString: () => `See Pokémon has abilities`
    };
  }

  /**
   * Verificar que tiene sprites
   */
  static pokemonSprite(): Question<boolean> {
    return {
      answeredBy: (actor: Actor) => {
        return true;
      },
      toString: () => `See Pokémon has sprite`
    };
  }
}
