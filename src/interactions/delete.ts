/**
 * Delete Interaction
 * 
 * Representa una petición HTTP DELETE a una API.
 * Se usa para eliminar recursos específicos.
 * 
 * Ejemplo de uso:
 * ```typescript
 * await actor.attemptsTo(
 *   Delete.from('/api/v2/pokemon/25'),
 *   Delete.from('/api/users/123').withHeaders({ 'Authorization': 'Bearer token' })
 * );
 * ```
 */

import { Interaction } from './interaction';
import { Actor } from '../actors/actor';
import { CallAnAPI } from '../abilities/callAnAPI';
import { APIResponse } from '@playwright/test';

export class Delete implements Interaction {
  private headers: Record<string, string> = {};
  private storedResponse?: APIResponse;
  private storedResponseBody?: any;

  /**
   * Crea una interaction Delete para un endpoint específico
   * 
   * @param endpoint - Ruta del endpoint (relativa o absoluta)
   * @returns Nueva instancia de Delete
   */
  static from(endpoint: string): Delete {
    return new Delete(endpoint);
  }

  private constructor(private endpoint: string) {}

  /**
   * Agrega headers a la petición
   */
  withHeaders(headers: Record<string, string>): Delete {
    this.headers = { ...this.headers, ...headers };
    return this;
  }

  /**
   * Ejecuta la petición DELETE
   */
  async performAs(actor: Actor): Promise<void> {
    const apiAbility = CallAnAPI.from(actor);

    const options: any = {};
    
    if (Object.keys(this.headers).length > 0) {
      options.headers = this.headers;
    }

    const { response, evidence } = await apiAbility.delete(this.endpoint, options);
    
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
