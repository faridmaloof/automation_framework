/**
 * Question: See if endpoint examples are visible (API v2)
 */

import { Actor } from '../../../actors/actor';
import { Question } from '../../question';
import { PokeAPIDocsPage } from '../../../pages/web/PokeAPIDocsPage';

/**
 * Pregunta para verificar si los ejemplos de endpoints están visibles
 */
export class SeeEndpointExamples implements Question<boolean> {
  /**
   * Método estático para crear la pregunta
   * @returns Nueva instancia de SeeEndpointExamples
   * 
   * @example
   * const areVisible = await actor.asks(SeeEndpointExamples.displayed());
   */
  static displayed(): SeeEndpointExamples {
    return new SeeEndpointExamples();
  }

  /**
   * Responde a la pregunta verificando si los ejemplos de endpoints están visibles
   * @param actor - El actor que hace la pregunta
   * @returns true si los ejemplos están visibles, false en caso contrario
   */
  async answeredBy(actor: Actor): Promise<boolean> {
    const docsPage = (actor as any)._docsPage as PokeAPIDocsPage;
    
    if (!docsPage) {
      throw new Error('PokeAPIDocsPage not found in actor context');
    }
    
    return await docsPage.areEndpointExamplesVisible();
  }
}
