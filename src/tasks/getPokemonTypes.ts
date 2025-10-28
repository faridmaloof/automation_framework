/**
 * GetPokemonTypes Task
 * 
 * Task para obtener los tipos de un Pokémon específico
 */

import { Task } from './task';
import { Actor } from '../actors/actor';
import { Get } from '../interactions/get';
import { APIResponse } from '@playwright/test';

export class GetPokemonTypes implements Task {
  private pokemonName: string;
  private response?: APIResponse;
  private types?: any[];

  constructor(pokemonName: string) {
    this.pokemonName = pokemonName;
  }

  /**
   * Crear task para obtener tipos por nombre
   */
  static of(pokemonName: string): GetPokemonTypes {
    return new GetPokemonTypes(pokemonName);
  }

  /**
   * Ejecutar el task
   */
  async performAs(actor: Actor): Promise<void> {
    const endpoint = `/api/v2/pokemon/${this.pokemonName}`;
    
    const getInteraction = Get.from(endpoint);
    await actor.attemptsTo(getInteraction);
    
    this.response = getInteraction.getResponse();
    
    if (this.response?.ok()) {
      const body = await this.response.json();
      this.types = body.types;
    }
  }

  /**
   * Obtener los tipos
   */
  getTypes(): any[] | undefined {
    return this.types;
  }

  /**
   * Obtener la respuesta
   */
  getResponse(): APIResponse | undefined {
    return this.response;
  }

  toString(): string {
    return `GetPokemonTypes of "${this.pokemonName}"`;
  }
}
