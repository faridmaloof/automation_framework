/**
 * Ability - Base class for all abilities in the Screenplay Pattern
 * 
 * Las habilidades representan capacidades que un actor puede tener.
 * Ejemplos: BrowseTheWeb, CallAnAPI, AccessDatabase, ManageSecrets
 * 
 * Cada ability debe implementar:
 * - name(): Identificador único de la habilidad
 * - as(actor): Devuelve la capacidad que otorga al actor
 */

import { Actor } from '../actors/actor';

export abstract class Ability {
  /**
   * Returns the unique name identifier for this ability
   */
  abstract name(): string;
  
  /**
   * Returns the capability that this ability provides to an actor
   * 
   * @param actor - The actor using this ability
   * @returns The underlying tool/context (Page, APIRequestContext, DatabaseClient, etc.)
   */
  abstract as(actor: Actor): any;
}
