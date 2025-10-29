/**
 * Question: See if Fair Use Policy title is visible (API v2)
 */

import { Actor } from '../../../actors/actor';
import { Question } from '../../question';
import { PokeAPIDocsPage } from '../../../pages/web/PokeAPIDocsPage';

/**
 * Pregunta para verificar si el título "Fair Use Policy" está visible
 */
export class SeeFairUseTitle implements Question<boolean> {
  /**
   * Método estático para crear la pregunta
   * @returns Nueva instancia de SeeFairUseTitle
   * 
   * @example
   * const isVisible = await actor.asks(SeeFairUseTitle.displayed());
   */
  static displayed(): SeeFairUseTitle {
    return new SeeFairUseTitle();
  }

  /**
   * Responde a la pregunta verificando si el título está visible
   * @param actor - El actor que hace la pregunta
   * @returns true si el título está visible, false en caso contrario
   */
  async answeredBy(actor: Actor): Promise<boolean> {
    const docsPage = (actor as any)._docsPage as PokeAPIDocsPage;
    
    if (!docsPage) {
      throw new Error('PokeAPIDocsPage not found in actor context');
    }
    
    return await docsPage.isFairUseTitleVisible();
  }
}
