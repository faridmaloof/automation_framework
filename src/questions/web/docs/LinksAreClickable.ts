/**
 * Question: Check if all main links are clickable
 */

import { Actor } from '../../../actors/actor';
import { Question } from '../../question';
import { PokeAPIDocsPage } from '../../../pages/web/PokeAPIDocsPage';

/**
 * Pregunta para verificar si todos los enlaces principales son clickeables
 */
export class LinksAreClickable implements Question<boolean> {
  /**
   * Método estático para crear la pregunta
   * @returns Nueva instancia de LinksAreClickable
   * 
   * @example
   * const areClickable = await actor.asks(LinksAreClickable.check());
   */
  static check(): LinksAreClickable {
    return new LinksAreClickable();
  }

  /**
   * Responde a la pregunta verificando si todos los enlaces son clickeables
   * @param actor - El actor que hace la pregunta
   * @returns true si todos los enlaces son clickeables, false en caso contrario
   */
  async answeredBy(actor: Actor): Promise<boolean> {
    const docsPage = (actor as any)._docsPage as PokeAPIDocsPage;
    
    if (!docsPage) {
      throw new Error('PokeAPIDocsPage not found in actor context');
    }
    
    return await docsPage.areAllMainLinksClickable();
  }
}
