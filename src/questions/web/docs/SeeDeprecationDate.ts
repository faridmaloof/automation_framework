/**
 * Question: See if deprecation date is visible (API v1)
 */

import { Actor } from '../../../actors/actor';
import { Question } from '../../question';
import { PokeAPIDocsPage } from '../../../pages/web/PokeAPIDocsPage';

/**
 * Pregunta para verificar si la fecha de deprecación de API v1 está visible
 */
export class SeeDeprecationDate implements Question<boolean> {
  /**
   * Método estático para crear la pregunta
   * @returns Nueva instancia de SeeDeprecationDate
   * 
   * @example
   * const isVisible = await actor.asks(SeeDeprecationDate.displayed());
   */
  static displayed(): SeeDeprecationDate {
    return new SeeDeprecationDate();
  }

  /**
   * Responde a la pregunta verificando si la fecha de deprecación está visible
   * @param actor - El actor que hace la pregunta
   * @returns true si la fecha está visible, false en caso contrario
   */
  async answeredBy(actor: Actor): Promise<boolean> {
    const docsPage = (actor as any)._docsPage as PokeAPIDocsPage;
    
    if (!docsPage) {
      throw new Error('PokeAPIDocsPage not found in actor context');
    }
    
    return await docsPage.isDeprecationDateVisible();
  }
}
