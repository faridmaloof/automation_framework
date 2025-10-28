/**
 * GetPokemonViaAPI Task
 * 
 * Task que obtiene información de un Pokémon usando la API REST de PokeAPI.
 * Captura evidencia completa de la petición y respuesta.
 * 
 * Ejemplo de uso:
 * ```typescript
 * await actor.attemptsTo(
 *   GetPokemonViaAPI.withName('pikachu')
 * );
 * 
 * // Con validaciones adicionales
 * const task = GetPokemonViaAPI.withName('pikachu');
 * await actor.attemptsTo(task);
 * const response = task.getResponse();
 * const body = task.getResponseBody();
 * ```
 */

import { Task } from './task';
import { Actor } from '../actors/actor';
import { Get } from '../interactions/get';
import { APIResponse } from '@playwright/test';

export class GetPokemonViaAPI implements Task {
  private getInteraction?: Get;
  private pokemonId?: number;

  /**
   * Crea una task para obtener un Pokémon por nombre
   * 
   * @param name - Nombre del Pokémon
   * @returns Nueva instancia de GetPokemonViaAPI
   */
  static withName(name: string): GetPokemonViaAPI {
    return new GetPokemonViaAPI(`/api/v2/pokemon/${name.toLowerCase()}`);
  }

  /**
   * Crea una task para obtener un Pokémon por ID
   * 
   * @param id - ID del Pokémon
   * @returns Nueva instancia de GetPokemonViaAPI
   */
  static withId(id: number): GetPokemonViaAPI {
    const task = new GetPokemonViaAPI(`/api/v2/pokemon/${id}`);
    task.pokemonId = id;
    return task;
  }

  private constructor(private endpoint: string) {}

  /**
   * Ejecuta la petición GET para obtener el Pokémon
   * 
   * @param actor - El actor que ejecuta la task
   */
  async performAs(actor: Actor): Promise<void> {
    this.getInteraction = Get.from(this.endpoint);
    await actor.attemptsTo(this.getInteraction);
  }

  /**
   * Obtiene la respuesta de la petición
   * 
   * @returns APIResponse de Playwright
   */
  getResponse(): APIResponse | undefined {
    return this.getInteraction?.getResponse();
  }

  /**
   * Obtiene el body parseado de la respuesta
   * 
   * @returns Objeto con la información del Pokémon
   */
  getResponseBody(): any {
    return this.getInteraction?.getResponseBody();
  }

  /**
   * Obtiene el nombre del Pokémon de la respuesta
   * 
   * @returns Nombre del Pokémon o undefined
   */
  getPokemonName(): string | undefined {
    return this.getResponseBody()?.name;
  }

  /**
   * Obtiene el ID del Pokémon de la respuesta
   * 
   * @returns ID del Pokémon o undefined
   */
  getPokemonId(): number | undefined {
    return this.getResponseBody()?.id;
  }

  /**
   * Obtiene los tipos del Pokémon de la respuesta
   * 
   * @returns Array de tipos o undefined
   */
  getPokemonTypes(): string[] | undefined {
    return this.getResponseBody()?.types?.map((t: any) => t.type.name);
  }

  /**
   * Obtiene las habilidades del Pokémon de la respuesta
   * 
   * @returns Array de habilidades o undefined
   */
  getPokemonAbilities(): string[] | undefined {
    return this.getResponseBody()?.abilities?.map((a: any) => a.ability.name);
  }
}
