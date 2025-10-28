/**
 * Get Interaction
 * 
 * Representa una petición HTTP GET a una API.
 * Captura automáticamente evidencias de la petición y respuesta.
 * 
 * Ejemplo de uso:
 * ```typescript
 * await actor.attemptsTo(
 *   Get.from('/api/v2/pokemon/pikachu'),
 *   Get.from('/api/v2/pokemon').withQueryParams({ limit: 10, offset: 0 }),
 *   Get.from('/api/users/123').withHeaders({ 'Authorization': 'Bearer token' })
 * );
 * ```
 */

import { Interaction } from './interaction';
import { Actor } from '../actors/actor';
import { CallAnAPI } from '../abilities/callAnAPI';
import { APIResponse } from '@playwright/test';

export class Get implements Interaction {
  private queryParams: Record<string, any> = {};
  private headers: Record<string, string> = {};
  private storedResponse?: APIResponse;
  private storedResponseBody?: any;

  /**
   * Crea una interaction Get para un endpoint específico
   * 
   * @param endpoint - Ruta del endpoint (relativa o absoluta)
   * @returns Nueva instancia de Get
   */
  static from(endpoint: string): Get {
    return new Get(endpoint);
  }

  private constructor(private endpoint: string) {}

  /**
   * Agrega parámetros de query a la petición
   * 
   * @param params - Objeto con los parámetros de query
   * 
   * @example
   * ```typescript
   * Get.from('/api/pokemon').withQueryParams({ limit: 10, offset: 0 })
   * // Resultado: GET /api/pokemon?limit=10&offset=0
   * ```
   */
  withQueryParams(params: Record<string, any>): Get {
    this.queryParams = { ...this.queryParams, ...params };
    return this;
  }

  /**
   * Agrega headers a la petición
   * 
   * @param headers - Objeto con los headers HTTP
   * 
   * @example
   * ```typescript
   * Get.from('/api/pokemon').withHeaders({
   *   'Authorization': 'Bearer token',
   *   'Content-Type': 'application/json'
   * })
   * ```
   */
  withHeaders(headers: Record<string, string>): Get {
    this.headers = { ...this.headers, ...headers };
    return this;
  }

  /**
   * Ejecuta la petición GET
   * 
   * @param actor - El actor que realiza la acción
   */
  async performAs(actor: Actor): Promise<void> {
    const apiAbility = CallAnAPI.from(actor);

    const options: any = {};
    
    if (Object.keys(this.queryParams).length > 0) {
      options.params = this.queryParams;
    }
    
    if (Object.keys(this.headers).length > 0) {
      options.headers = this.headers;
    }

    const { response, evidence } = await apiAbility.get(this.endpoint, options);
    
    // Guardar la respuesta para que pueda ser verificada posteriormente
    this.storedResponse = response;
    this.storedResponseBody = evidence.response.body;
  }

  /**
   * Obtiene la respuesta de la última petición ejecutada
   * 
   * @returns Respuesta de la API
   */
  getResponse(): APIResponse | undefined {
    return this.storedResponse;
  }

  /**
   * Obtiene el body de la respuesta de la última petición
   * 
   * @returns Body de la respuesta parseado
   */
  getResponseBody(): any {
    return this.storedResponseBody;
  }
}
