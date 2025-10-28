/**
 * SearchPokemon Task
 * 
 * Task de nivel superior que busca un Pokémon por nombre usando la interfaz web de PokeAPI.
 * Compone múltiples interactions para realizar la búsqueda completa.
 * 
 * Ejemplo de uso:
 * ```typescript
 * await actor.attemptsTo(
 *   SearchPokemon.named('pikachu')
 * );
 * ```
 */

import { Task } from './task';
import { Actor } from '../actors/actor';
import { Navigate } from '../interactions/navigate';
import { Fill } from '../interactions/fill';
import { Click } from '../interactions/click';
import { WaitFor } from '../interactions/waitFor';

export class SearchPokemon implements Task {
  /**
   * Crea una task para buscar un Pokémon por nombre
   * 
   * @param pokemonName - Nombre del Pokémon a buscar
   * @returns Nueva instancia de SearchPokemon
   */
  static named(pokemonName: string): SearchPokemon {
    return new SearchPokemon(pokemonName);
  }

  private constructor(private pokemonName: string) {}

  /**
   * Ejecuta la búsqueda del Pokémon
   * 
   * Flujo:
   * 1. Navega a PokeAPI web
   * 2. Llena el campo de búsqueda
   * 3. Hace clic en el botón de búsqueda
   * 4. Espera los resultados
   * 
   * @param actor - El actor que ejecuta la task
   */
  async performAs(actor: Actor): Promise<void> {
    await actor.attemptsTo(
      Navigate.to('https://pokeapi.co').andWaitForLoadState('networkidle'),
      WaitFor.element('input[type="text"]').toBeVisible(),
      Fill.field('input[type="text"]').with(this.pokemonName).andPressEnter(),
      WaitFor.element('.pokemon-result').toBeVisible().withTimeout(10000)
    );
  }
}
