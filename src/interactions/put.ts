/**
 * Put Interaction
 * 
 * Representa una petición HTTP PUT a una API.
 * Se usa típicamente para actualizar recursos existentes completos.
 * 
 * Ejemplo de uso:
 * ```typescript
 * await actor.attemptsTo(
 *   Put.to('/api/v2/pokemon/25').with({ name: 'pikachu', level: 50 }),
 *   Put.to('/api/users/123').withJSON({ email: 'newemail@example.com' })
 * );
 * ```
 */

import { Interaction } from './interaction';
import { Actor } from '../actors/actor';
import { CallAnAPI } from '../abilities/callAnAPI';
import { APIResponse } from '@playwright/test';

export class Put implements Interaction {
  private data: any;
  private headers: Record<string, string> = {};
  private storedResponse?: APIResponse;
  private storedResponseBody?: any;

  /**
   * Crea una interaction Put para un endpoint específico
   * 
   * @param endpoint - Ruta del endpoint (relativa o absoluta)
   * @returns Nueva instancia de Put
   */
  static to(endpoint: string): Put {
    return new Put(endpoint);
  }

  private constructor(private endpoint: string) {}

  /**
   * Especifica el body de la petición
   */
  with(data: any): Put {
    this.data = data;
    return this;
  }

  /**
   * Especifica el body como JSON
   */
  withJSON(data: any): Put {
    this.data = data;
    this.headers['Content-Type'] = 'application/json';
    return this;
  }

  /**
   * Agrega headers a la petición
   */
  withHeaders(headers: Record<string, string>): Put {
    this.headers = { ...this.headers, ...headers };
    return this;
  }

  /**
   * Ejecuta la petición PUT
   */
  async performAs(actor: Actor): Promise<void> {
    const apiAbility = CallAnAPI.from(actor);

    const options: any = {
      data: this.data
    };
    
    if (Object.keys(this.headers).length > 0) {
      options.headers = this.headers;
    }

    const { response, evidence } = await apiAbility.put(this.endpoint, options);
    
    this.storedResponse = response;
    this.storedResponseBody = evidence.response.body;
  }

  getResponse(): APIResponse | undefined {
    return this.storedResponse;
  }

  getResponseBody(): any {
    return this.storedResponseBody;
  }
}
