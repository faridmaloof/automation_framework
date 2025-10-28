/**
 * GetMultiplePokemon Task
 * 
 * Task para obtener múltiples Pokémon en una sola operación
 */

import { Task } from './task';
import { Actor } from '../actors/actor';
import { GetPokemonViaAPI } from './getPokemonViaAPI';

export class GetMultiplePokemon implements Task {
  private pokemonNames: string[];
  private results: Map<string, any> = new Map();

  constructor(pokemonNames: string[]) {
    this.pokemonNames = pokemonNames;
  }

  /**
   * Crear task para obtener múltiples Pokémon
   */
  static named(pokemonNames: string[]): GetMultiplePokemon {
    return new GetMultiplePokemon(pokemonNames);
  }

  /**
   * Ejecutar el task
   */
  async performAs(actor: Actor): Promise<void> {
    for (const name of this.pokemonNames) {
      const task = GetPokemonViaAPI.withName(name);
      await actor.attemptsTo(task);
      
      const body = task.getResponseBody();
      if (body) {
        this.results.set(name, body);
      }
    }
  }

  /**
   * Obtener los resultados
   */
  getResults(): Map<string, any> {
    return this.results;
  }

  /**
   * Obtener resultado específico
   */
  getResult(pokemonName: string): any | undefined {
    return this.results.get(pokemonName);
  }

  toString(): string {
    return `GetMultiplePokemon: ${this.pokemonNames.join(', ')}`;
  }
}
