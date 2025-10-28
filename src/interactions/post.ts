/**
 * Post Interaction
 * 
 * Representa una petición HTTP POST a una API.
 * Captura automáticamente evidencias de la petición y respuesta.
 * 
 * Ejemplo de uso:
 * ```typescript
 * await actor.attemptsTo(
 *   Post.to('/api/v2/pokemon').with({ name: 'bulbasaur', type: 'grass' }),
 *   Post.to('/api/users').withJSON({ username: 'test', email: 'test@example.com' }),
 *   Post.to('/api/upload').withFormData({ file: buffer })
 * );
 * ```
 */

import { Interaction } from './interaction';
import { Actor } from '../actors/actor';
import { CallAnAPI } from '../abilities/callAnAPI';
import { APIResponse } from '@playwright/test';

export class Post implements Interaction {
  private data: any;
  private headers: Record<string, string> = {};
  private storedResponse?: APIResponse;
  private storedResponseBody?: any;

  /**
   * Crea una interaction Post para un endpoint específico
   * 
   * @param endpoint - Ruta del endpoint (relativa o absoluta)
   * @returns Nueva instancia de Post
   */
  static to(endpoint: string): Post {
    return new Post(endpoint);
  }

  private constructor(private endpoint: string) {}

  /**
   * Especifica el body de la petición
   * 
   * @param data - Datos a enviar (serán convertidos a JSON automáticamente)
   * 
   * @example
   * ```typescript
   * Post.to('/api/pokemon').with({
   *   name: 'pikachu',
   *   type: 'electric'
   * })
   * ```
   */
  with(data: any): Post {
    this.data = data;
    return this;
  }

  /**
   * Alias para with() - especifica el body como JSON
   */
  withJSON(data: any): Post {
    this.data = data;
    this.headers['Content-Type'] = 'application/json';
    return this;
  }

  /**
   * Especifica el body como form data
   * 
   * @param data - Datos del formulario
   */
  withFormData(data: any): Post {
    this.data = data;
    this.headers['Content-Type'] = 'multipart/form-data';
    return this;
  }

  /**
   * Agrega headers a la petición
   * 
   * @param headers - Objeto con los headers HTTP
   */
  withHeaders(headers: Record<string, string>): Post {
    this.headers = { ...this.headers, ...headers };
    return this;
  }

  /**
   * Ejecuta la petición POST
   * 
   * @param actor - El actor que realiza la acción
   */
  async performAs(actor: Actor): Promise<void> {
    const apiAbility = CallAnAPI.from(actor);

    const options: any = {
      data: this.data
    };
    
    if (Object.keys(this.headers).length > 0) {
      options.headers = this.headers;
    }

    const { response, evidence } = await apiAbility.post(this.endpoint, options);
    
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
