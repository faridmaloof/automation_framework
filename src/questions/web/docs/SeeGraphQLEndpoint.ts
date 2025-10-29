/**
 * Question: See if GraphQL endpoint URL is visible
 */

import { Actor } from '../../../actors/actor';
import { Question } from '../../question';
import { PokeAPIDocsPage } from '../../../pages/web/PokeAPIDocsPage';

/**
 * Pregunta para verificar si la URL del endpoint de GraphQL está visible
 */
export class SeeGraphQLEndpoint implements Question<boolean> {
  /**
   * Método estático para crear la pregunta
   * @returns Nueva instancia de SeeGraphQLEndpoint
   * 
   * @example
   * const isVisible = await actor.asks(SeeGraphQLEndpoint.displayed());
   */
  static displayed(): SeeGraphQLEndpoint {
    return new SeeGraphQLEndpoint();
  }

  /**
   * Responde a la pregunta verificando si la URL del endpoint está visible
   * @param actor - El actor que hace la pregunta
   * @returns true si la URL está visible, false en caso contrario
   */
  async answeredBy(actor: Actor): Promise<boolean> {
    const docsPage = (actor as any)._docsPage as PokeAPIDocsPage;
    
    if (!docsPage) {
      throw new Error('PokeAPIDocsPage not found in actor context');
    }
    
    return await docsPage.isGraphQLEndpointVisible();
  }
}
