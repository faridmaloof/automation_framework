/**
 * Question: Check if content is readable on current viewport
 */

import { Actor } from '../../../actors/actor';
import { Question } from '../../question';
import { PokeAPIDocsPage } from '../../../pages/web/PokeAPIDocsPage';

/**
 * Pregunta para verificar si el contenido es legible en el viewport actual
 */
export class ContentIsReadable implements Question<boolean> {
  /**
   * Método estático para crear la pregunta
   * @returns Nueva instancia de ContentIsReadable
   * 
   * @example
   * const isReadable = await actor.asks(ContentIsReadable.check());
   */
  static check(): ContentIsReadable {
    return new ContentIsReadable();
  }

  /**
   * Responde a la pregunta verificando si el contenido es legible
   * @param actor - El actor que hace la pregunta
   * @returns true si el contenido es legible, false en caso contrario
   */
  async answeredBy(actor: Actor): Promise<boolean> {
    const docsPage = (actor as any)._docsPage as PokeAPIDocsPage;
    
    if (!docsPage) {
      throw new Error('PokeAPIDocsPage not found in actor context');
    }
    
    return await docsPage.isContentReadable();
  }
}
