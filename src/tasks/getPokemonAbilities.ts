/**
 * GetPokemonAbilities Task
 * 
 * Task para obtener las habilidades de un Pokémon específico
 */

import { Task } from './task';
import { Actor } from '../actors/actor';
import { Get } from '../interactions/get';
import { APIResponse } from '@playwright/test';

export class GetPokemonAbilities implements Task {
  private pokemonName: string;
  private response?: APIResponse;
  private abilities?: any[];

  constructor(pokemonName: string) {
    this.pokemonName = pokemonName;
  }

  /**
   * Crear task para obtener habilidades por nombre
   */
  static of(pokemonName: string): GetPokemonAbilities {
    return new GetPokemonAbilities(pokemonName);
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
      this.abilities = body.abilities;
    }
  }

  /**
   * Obtener las habilidades
   */
  getAbilities(): any[] | undefined {
    return this.abilities;
  }

  /**
   * Obtener la respuesta
   */
  getResponse(): APIResponse | undefined {
    return this.response;
  }

  toString(): string {
    return `GetPokemonAbilities of "${this.pokemonName}"`;
  }
}
