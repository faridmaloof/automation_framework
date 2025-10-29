/**
 * Question: See if deprecation message is visible (API v1)
 */

import { Actor } from '../../../actors/actor';
import { Question } from '../../question';
import { PokeAPIDocsPage } from '../../../pages/web/PokeAPIDocsPage';

/**
 * Pregunta para verificar si el mensaje de deprecación de API v1 está visible
 */
export class SeeDeprecationMessage implements Question<boolean> {
  /**
   * Método estático para crear la pregunta
   * @returns Nueva instancia de SeeDeprecationMessage
   * 
   * @example
   * const isVisible = await actor.asks(SeeDeprecationMessage.displayed());
   */
  static displayed(): SeeDeprecationMessage {
    return new SeeDeprecationMessage();
  }

  /**
   * Responde a la pregunta verificando si el mensaje de deprecación está visible
   * @param actor - El actor que hace la pregunta
   * @returns true si el mensaje está visible, false en caso contrario
   */
  async answeredBy(actor: Actor): Promise<boolean> {
    const docsPage = (actor as any)._docsPage as PokeAPIDocsPage;
    
    if (!docsPage) {
      throw new Error('PokeAPIDocsPage not found in actor context');
    }
    
    return await docsPage.isDeprecationMessageVisible();
  }
}
