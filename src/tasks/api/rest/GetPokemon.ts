import { Task } from '../../task';
import { Actor } from '../../../actors/actor';
import { CallAnAPI } from '../../../abilities/callAnAPI';
import { APIResponse } from '@playwright/test';

/**
 * Task para obtener información de un Pokémon por nombre o ID
 * usando REST API
 */
export class GetPokemon implements Task {
  private pokemonIdentifier: string | number;
  private response?: APIResponse;
  private body?: any;
  private responseTime: number = 0;

  constructor(pokemonIdentifier: string | number) {
    this.pokemonIdentifier = pokemonIdentifier;
  }

  async performAs(actor: Actor): Promise<void> {
    const apiAbility = CallAnAPI.from(actor);
    
    const startTime = Date.now();
    
    // Ejecutar request
    const responseWithEvidence = await apiAbility.get(`/api/v2/pokemon/${this.pokemonIdentifier}`);
    this.response = responseWithEvidence.response;
    
    this.responseTime = Date.now() - startTime;
    
    // Parsear body si la respuesta es exitosa
    if (this.response && this.response.ok()) {
      this.body = await this.response.json();
    } else if (this.response) {
      // Intentar parsear el error
      try {
        this.body = await this.response.json();
      } catch {
        this.body = await this.response.text();
      }
    }
  }

  getResponse(): APIResponse | undefined {
    return this.response;
  }

  getResponseBody(): any {
    return this.body;
  }

  getResponseTime(): number {
    return this.responseTime;
  }

  toString(): string {
    return `GetPokemon: ${this.pokemonIdentifier}`;
  }
}
