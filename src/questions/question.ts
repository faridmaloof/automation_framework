/**
 * Question - Base para preguntas sobre el estado del sistema
 * 
 * Las Questions permiten al Actor hacer preguntas sobre el estado actual
 * Similar a Interactions pero retornan un valor en lugar de realizar una acción
 */

import { Actor } from '../actors/actor';

export interface Question<T> {
  /**
   * Hacer la pregunta y obtener la respuesta
   */
  answeredBy(actor: Actor): Promise<T> | T;
  
  /**
   * Descripción de la pregunta
   */
  toString(): string;
}
